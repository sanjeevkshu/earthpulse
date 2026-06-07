# Feature: EarthPulse Observatory — planetary data dashboard

Read CLAUDE.md fully before starting. Pay particular attention to the **three-layer data architecture** section — the data design is critical and must not be simplified to build-time-only. Build in the sequence below. Verify each phase before proceeding.

---

## Architecture summary (read before writing any code)

The Observatory uses three data layers. Each layer is mandatory — do not merge them:

```
Layer 1  Build-time static    scripts/fetch-observatory-data.ts → /public/data/*.json
         Max staleness: 31 days. Powers all trend charts and sparklines.

Layer 2  Route Handler        /api/observatory/[metric]/route.ts
         Fetches latest single data point on demand. Edge-cached 24h. Falls back
         to Layer 1 if upstream unreachable. Powers current value badge + StatusBadge.

Layer 3  GitHub Action        .github/workflows/refresh-data.yml
         Monthly cron. Re-runs fetch-data.ts, commits updated JSON, triggers Vercel
         rebuild. Keeps Layer 1 current so trend charts never drift more than 31 days.
```

This ensures:
- Trend charts always have the full historical series (fast, from CDN)
- The "current value" badge is always within 24 hours of the real NASA/NOAA figure
- Historical data refreshes automatically without manual intervention

---

## Phase 0 — Install dependencies

```bash
npm install recharts csv-parse
npm install -D tsx
```

---

## Phase 1 — Layer 1: build-time data fetch script

### Create scripts/fetch-observatory-data.ts

This script fetches 6 public-domain datasets, parses them, and writes normalised JSON to `/public/data/`. It must:

1. Use native Node.js fetch (Node 18+) to retrieve each URL
2. Parse CSV lines, skip comment lines starting with `#` and header rows
3. Extract year + annual value per dataset (see parsing notes below)
4. Write output conforming to the `MetricDataset` schema (in CLAUDE.md)
5. Include `lastFetched` ISO timestamp in each file's `source` block
6. On any fetch or parse failure: log the error clearly, leave the existing JSON file untouched if it exists, continue to the next metric — never throw and crash the whole script

**Parsing notes per dataset:**

```
temperature (NASA GISS GLB.Ts+dSST.csv):
  Skip first row. Columns: Year, Jan–Dec monthly anomalies, then J-D (annual mean).
  Extract: "Year" column and "J-D" column. Skip rows where J-D is "****".
  Unit: °C anomaly vs 1951–1980 average

co2 (NOAA co2_annmean_mlo.csv):
  Skip lines starting with "#". Columns: year, mean, unc.
  Extract: year and mean columns.
  Unit: ppm

sea-level (NASA MSL_Seasonal_v3.1.txt):
  Space-delimited. Skip header lines starting with "HDR".
  Columns: year (decimal float), GMSL variation (mm).
  Group by floor(year), take mean value per integer year.
  Unit: mm vs 1993 baseline

sea-ice (NSIDC N_09_extent_v3.0.csv):
  Skip header row. Columns: year, mo, data-type, region, extent, area.
  Filter rows where mo = 9 (September). Extract year and extent.
  Unit: million km²

deforestation:
  GFW API may be unreliable — use hardcoded annual series as primary:
  { 2001:11.5, 2002:10.8, 2003:11.1, 2004:13.2, 2005:11.8, 2006:10.9,
    2007:10.4, 2008:10.6, 2009:9.7,  2010:10.1, 2011:10.4, 2012:11.0,
    2013:12.1, 2014:11.9, 2015:13.7, 2016:15.1, 2017:15.8, 2018:14.5,
    2019:16.2, 2020:15.6, 2021:14.8, 2022:13.9 }
  Unit: Mha/year (tropical tree cover loss, Hansen et al. / GFW)

glaciers:
  WGMS ZIP download is complex — use hardcoded cumulative series as primary:
  { 1950:0, 1955:-710, 1960:-1420, 1965:-2280, 1970:-3200, 1975:-4500,
    1980:-5800, 1985:-7400, 1990:-9200, 1995:-11500, 2000:-13800,
    2005:-17200, 2010:-21000, 2015:-25800, 2020:-29500, 2022:-31200 }
  Unit: mm water equivalent (cumulative global mass balance, WGMS)
```

### Update package.json scripts:

```json
"fetch-data": "tsx scripts/fetch-observatory-data.ts",
"prebuild": "npm run fetch-data"
```

---

## Phase 2 — Layer 2: Route Handler (current value, 24h edge cache)

### Create src/app/api/observatory/[metric]/route.ts

This handler fetches only the **most recent row** from the upstream API for the requested metric. It is the sole source for the "current value" displayed on MetricCard.

Requirements:
- Accept GET requests with `params.metric` as one of the 6 metric IDs
- For each metric, fetch its source URL, parse only the last non-null data row
- Return `{ year: number, value: number, unit: string, agency: string }` as JSON
- Set edge cache header: `Cache-Control: s-maxage=86400, stale-while-revalidate=3600`
- On any upstream failure: read `/public/data/[metric].json`, return the last non-null entry from its `series` array as fallback — with an additional `{ fallback: true }` flag in the response so the UI can show a subtle "cached" indicator
- Return 400 for unknown metric IDs

```ts
// Response shape
{
  year: number;
  value: number;
  unit: string;
  agency: string;
  fallback?: true;    // present only when served from static JSON fallback
}
```

---

## Phase 3 — Layer 3: GitHub Action monthly refresh

### Create .github/workflows/refresh-data.yml

```yaml
name: Refresh Observatory Data

on:
  schedule:
    - cron: '0 2 1 * *'
  workflow_dispatch:

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run fetch-data
      - name: Commit updated data
        run: |
          git config user.email "bot@earthpulse.org"
          git config user.name "EarthPulse Data Bot"
          git add public/data/
          git diff --staged --quiet || (
            git commit -m "chore: refresh observatory data $(date +%Y-%m)"
            git push
          )
```

---

## Phase 4 — Data library

### Create src/lib/observatory.ts

Include:
- `MetricDataset` interface (schema as defined in CLAUDE.md)
- `MetricId` type union of all 6 metric slugs
- `ThresholdStatus` type: `'safe' | 'caution' | 'critical'`
- `METRIC_META` record with label, unit, icon, description, agency, thresholds, higherIsBetter per metric (values in CLAUDE.md)
- `getThresholdStatus(metricId, value)` — returns ThresholdStatus using higherIsBetter logic
- `getDeltaFromYear(series, fromYear)` — returns delta from a given year to latest non-null value
- `getLatestValue(series)` — returns `{ value, year }` of last non-null entry

---

## Phase 5 — Observatory components

### Create src/components/observatory/StatusBadge.tsx
Safe = emerald pill, Caution = amber pill, Critical = red pill. Animated pulse dot on the left. Dark-mode compatible using opacity-based backgrounds.

### Create src/components/observatory/MetricCard.tsx
Client component. Props: `metricId`, `dataset: MetricDataset`, `baselineYear: number`.

On mount, fetch `/api/observatory/[metricId]` to get the live current value. While loading, show the last value from `dataset.series` as a skeleton placeholder. Replace with live value when resolved.

Display:
- Icon + label + agency badge
- Live current value (large, bold) + unit
- Delta from `baselineYear` to current — formatted as `+X.X` or `−X.X` with colour
- StatusBadge derived from live current value
- Mini sparkline — Recharts `<ResponsiveContainer><LineChart>` — last 30 data points, no axes, no grid, 1.5px line, colour matches StatusBadge
- If `fallback: true` in API response, show a subtle "cached" label in gray
- "Explore →" Link to `/observatory/[metricId]`

Card background: `bg-slate-900 border border-slate-700/50 rounded-2xl p-5`

### Create src/components/observatory/YearScrubber.tsx
Range input from 1950 to current year. Shows year value. `accent-emerald-500`. State lives in parent Dashboard, passed as props.

### Create src/components/observatory/LifetimeWidget.tsx
Number input for birth year (1924–2010). On change, calls `getDeltaFromYear()` for all 6 metrics using Layer 1 static data (passed as props — no fetch needed). Renders a sentence per metric: "Since [year], [metric] has [risen/fallen] by [delta] [unit]." Client-side only — no data leaves the browser, nothing persisted.

### Create src/components/observatory/MetricChart.tsx
Must be `'use client'`. Must be dynamically imported in the page with `ssr: false`.

Use Recharts `<ComposedChart>`:
- `<Area>` for the full historical series (gradient fill, line stroke matching status colour)
- `<ReferenceLine>` for each of the three thresholds (safe = emerald dashed, caution = amber dashed, critical = red dashed) with right-aligned labels
- `<CartesianGrid>` subtle opacity
- `<XAxis>` years, `<YAxis>` with unit label
- `<Tooltip>` custom: shows year, value with unit, threshold status label
- `<Brush>` at the bottom for zoom/pan
- Optional: dashed `<Line>` IPCC projection lines after last data year (SSP2-4.5 and SSP5-8.5 as simple linear extrapolations)

### Create src/components/observatory/ThresholdBands.tsx
Reusable component that renders the three `<ReferenceLine>` elements for a given metric's thresholds. Used inside MetricChart.

### Create src/components/observatory/DataProvenancePanel.tsx
Server component. Displays: source agency, dataset name, last fetched timestamp from `dataset.source.lastFetched`, link to original data URL, link to methodology URL. Styled as a subtle inset card `bg-slate-800/50 rounded-xl p-4`.

### Create src/components/observatory/ObservatoryFAB.tsx
```tsx
'use client';
import Link from 'next/link';
export default function ObservatoryFAB() {
  return (
    <Link
      href="/observatory"
      className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 rounded-full bg-brand-400 shadow-lg shadow-brand-400/30 flex items-center justify-center text-white text-2xl hover:bg-brand-600 transition-colors"
      aria-label="Open EarthPulse Observatory"
    >
      🛰️
    </Link>
  );
}
```

---

## Phase 6 — Observatory pages

### Create src/app/observatory/page.tsx — Landing Dashboard

Server component. Load all 6 static JSON files at build time:
```ts
import temperatureData from '@/../public/data/temperature.json';
// repeat for all 6
```

Pass as props to client islands. Layout:
- Dark full-page: `bg-slate-950 min-h-screen`
- Header: "🛰️ EarthPulse Observatory" + subtitle
- Client island: `<YearScrubber>` with year state (default 1990)
- 2×3 grid desktop / 1-col mobile of `<MetricCard>` — each receives its static dataset + baselineYear from scrubber
- `<LifetimeWidget>` below grid (receives all 6 datasets as props)
- Attribution footer: "Data sourced from NASA, NOAA, NSIDC, Global Forest Watch, and WGMS. All datasets are in the public domain." + back link to main site

### Create src/app/observatory/[metric]/page.tsx — Deep Dive

`generateStaticParams` returns all 6 metric IDs.

1. Load metric JSON from `/public/data/[metric].json`
2. Header: icon, label, StatusBadge (from static last value — live value loaded client-side by MetricCard)
3. Full `<MetricChart>` — dynamically imported (`next/dynamic`, `ssr: false`), receives full `dataset.series`
4. `<DataProvenancePanel>` with source metadata
5. Scientific context — hardcode 2–3 paragraphs per metric explaining what the metric means, why it matters, and what the trend implies. Define these as constants at the top of the file.
6. Related articles: `getAllArticles()` filtered by relevant tags per metric:
   - temperature → `['climate']`
   - co2 → `['climate', 'emissions']`
   - sea-level → `['oceans', 'climate']`
   - sea-ice → `['oceans', 'biodiversity']`
   - deforestation → `['forests', 'biodiversity']`
   - glaciers → `['climate', 'freshwater']`
7. Back link to `/observatory`

---

## Phase 7 — Navbar + layout integration

### Update src/components/layout/Navbar.tsx

Add Observatory pill between nav links and ThemeToggle on desktop:
```tsx
<Link
  href="/observatory"
  className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-400/10 border border-brand-400/30 text-brand-400 hover:bg-brand-400/20 transition-colors"
>
  🛰️ Observatory
</Link>
```

### Update src/app/layout.tsx

Add `<ObservatoryFAB />` after `<Footer />` inside `<ThemeProvider>`:
```tsx
import ObservatoryFAB from '@/components/observatory/ObservatoryFAB';
// ...
<ThemeProvider>
  <Navbar />
  <main className="flex-1">{children}</main>
  <Footer />
  <ObservatoryFAB />
</ThemeProvider>
```

---

## Phase 8 — Verification checklist

```bash
npm run fetch-data
```
- [ ] All 6 JSON files created in `/public/data/`
- [ ] Each file has complete `id`, `label`, `unit`, `source`, `thresholds`, `series` fields
- [ ] Series arrays have at least 20 data points each with no schema errors
- [ ] Script logs success/failure per metric without crashing on any single failure
- [ ] `lastFetched` is a valid ISO timestamp

```bash
npm run dev
```

Layer 2:
- [ ] `GET /api/observatory/temperature` returns `{ year, value, unit, agency }` with correct Cache-Control header
- [ ] All 6 metric endpoints return valid responses
- [ ] Disconnect network, restart dev server — all 6 endpoints return fallback responses with `fallback: true`

Observatory UI:
- [ ] Observatory pill visible in Navbar desktop (teal, between nav links and theme toggle)
- [ ] Observatory FAB visible bottom-right on mobile viewport, hidden on desktop
- [ ] `/observatory` loads with dark slate background — all 6 MetricCards visible
- [ ] Each MetricCard shows: live current value (from Route Handler), delta from baseline, StatusBadge, sparkline, agency, Explore link
- [ ] MetricCard shows subtle "cached" label when Route Handler returns `fallback: true`
- [ ] YearScrubber changes baseline year — all 6 MetricCard deltas recalculate
- [ ] LifetimeWidget calculates correct personalised deltas for a test birth year
- [ ] `/observatory/temperature` (and all 5 others) load correctly
- [ ] MetricChart renders with area fill, threshold reference lines, brush zoom, tooltip
- [ ] DataProvenancePanel shows correct source, dataset, lastFetched for each metric
- [ ] Related articles section shows tag-matched articles
- [ ] Observatory pages maintain dark aesthetic regardless of site-wide theme toggle
- [ ] No console errors, no hydration warnings

```bash
npm run build
```
- [ ] Build completes without TypeScript errors
- [ ] All 6 `/observatory/[metric]` static pages generated
- [ ] No missing module errors for recharts or csv-parse

---

## Files summary

| File | Action |
|------|--------|
| `scripts/fetch-observatory-data.ts` | Create |
| `public/data/*.json` (×6) | Generated by script |
| `.github/workflows/refresh-data.yml` | Create |
| `src/lib/observatory.ts` | Create |
| `src/app/api/observatory/[metric]/route.ts` | Create |
| `src/components/observatory/StatusBadge.tsx` | Create |
| `src/components/observatory/MetricCard.tsx` | Create |
| `src/components/observatory/MetricChart.tsx` | Create |
| `src/components/observatory/ThresholdBands.tsx` | Create |
| `src/components/observatory/YearScrubber.tsx` | Create |
| `src/components/observatory/LifetimeWidget.tsx` | Create |
| `src/components/observatory/DataProvenancePanel.tsx` | Create |
| `src/components/observatory/ObservatoryFAB.tsx` | Create |
| `src/app/observatory/page.tsx` | Create |
| `src/app/observatory/[metric]/page.tsx` | Create |
| `src/components/layout/Navbar.tsx` | Update |
| `src/app/layout.tsx` | Update |
| `package.json` | Update — add fetch-data + prebuild scripts |
