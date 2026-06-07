# EarthPulse — Claude Code context

This file is read automatically by Claude Code at the start of every session.
It provides full project context so Claude Code can continue development without re-explanation.

---

## Project summary

**EarthPulse** is an open-source, content-first environmental education website with a planetary data Observatory.
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · MDX · Recharts · Vercel
**Repo:** https://github.com/yourusername/earthpulse *(update this)*
**Live site:** https://earthpulse.org *(once deployed)*

---

## Architecture

- Fully statically generated (SSG) — no server, no database for editorial content
- Content lives as `.mdx` files in `/content`, parsed at build time
- Observatory data fetched from public APIs at build time, stored as static JSON in `/public/data/`
- Deployed to Vercel free Hobby tier — auto-deploys on every push to `main`
- `prebuild` script runs `fetch-observatory-data.ts` automatically before every build

```
scripts/
  fetch-observatory-data.ts  ← build-time fetch from NASA/NOAA/NSIDC/GFW/WGMS
content/                     ← all articles as .mdx files
  our-planet/
  through-time/
  human-footprint/
  in-action/
  voices/
  take-action/
public/
  images/
  og/
  data/                      ← Observatory JSON datasets (generated at build)
    temperature.json
    co2.json
    sea-level.json
    sea-ice.json
    deforestation.json
    glaciers.json
src/
  app/
    layout.tsx               ← ThemeProvider + ObservatoryFAB
    page.tsx                 ← Homepage
    about/
    newsletter/
    contribute/
    privacy/
    observatory/
      page.tsx               ← Observatory landing dashboard
      [metric]/page.tsx      ← Deep-dive per metric
    api/observatory/[metric]/route.ts  ← Optional live data refresh
    [pillar]/page.tsx
    [pillar]/[slug]/page.tsx
    tag/[tag]/page.tsx
  components/
    layout/
      Navbar.tsx             ← Observatory pill added
      Footer.tsx
      ThemeProvider.tsx
    article/
      ArticleCard.tsx
      Tip.tsx
      DidYouKnow.tsx
      Impact.tsx
    observatory/
      ObservatoryFAB.tsx
      Dashboard.tsx
      MetricCard.tsx
      MetricChart.tsx
      ThresholdBands.tsx
      LifetimeWidget.tsx
      YearScrubber.tsx
      StatusBadge.tsx
      DataProvenancePanel.tsx
    ui/
      ThemeToggle.tsx
  lib/
    content.ts               ← MDX loader, getAllArticles, getArticle, PILLAR_META
    observatory.ts           ← MetricDataset type, METRIC_META, threshold logic, helpers
CLAUDE.md
README.md
FUNCTIONAL_SPEC.md
TECHNICAL_DESIGN.md
```

---

## Content model

Every article is a `.mdx` file with this frontmatter:

```yaml
---
title: "Article title"
description: "Short summary for SEO and cards"
date: "2024-06-01"
author: "Author Name"
tags: ["tag1", "tag2"]
featured: false
coverImage: "/images/articles/my-image.jpg"   # optional; accepts Pexels URLs too
---
```

---

## Six content pillars

| Slug | Label | Description |
|------|-------|-------------|
| `our-planet` | Our Planet | Ecosystems, biodiversity, living world |
| `through-time` | Through Time | Earth history, evolution |
| `human-footprint` | Human Footprint | Human impact today |
| `in-action` | In Action | Initiatives and solutions |
| `voices` | Voices & Research | Blog, opinion, deep dives |
| `take-action` | Take Action | Practical guides |

---

## Design tokens

- **Brand colour:** teal-green ramp — `brand-400 = #1D9E75`
- **Dark mode:** `class` strategy via `next-themes` — manual toggle, defaults to system
- **Observatory palette (dark-first, independent of site theme):**
  - Background: `bg-slate-950` / `bg-slate-900`
  - Accent: `brand-400`
  - Warning: amber `#F59E0B`
  - Critical: red `#EF4444`
- **Typography plugin:** `@tailwindcss/typography` — use `prose-custom` on article bodies
- **Shared CSS classes:** `.btn-primary`, `.btn-outline`, `.card`, `.tag`, `.nav-link`, `.section-title`

---

## Key conventions

- All new pages go in `src/app/` following App Router conventions
- All new components go in `src/components/` grouped by function
- Use `getAllArticles()` and `getArticle()` from `src/lib/content.ts` — never read MDX files directly in pages
- Use `generateStaticParams()` on all dynamic routes
- Export `generateMetadata()` from every page for SEO
- Use Tailwind utility classes — no inline styles
- TypeScript strict mode — no `any` types
- Dark mode must work on every new component
- All Observatory chart components must be `'use client'` and dynamically imported (`next/dynamic`, `ssr: false`) — Recharts does not support SSR

---

## Callout components (available in all MDX articles)

```mdx
<Tip>Practical advice or actionable suggestion</Tip>
<DidYouKnow>Surprising or counterintuitive fact</DidYouKnow>
<Impact>Quantified impact stat or consequence</Impact>
```

Registered in `src/app/[pillar]/[slug]/page.tsx` via `MDXRemote` `components` prop.

---

## Hero media sources (Pexels — free licence)

| Location | Type | URL |
|----------|------|-----|
| Homepage hero | Video | `https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4` |
| Homepage fallback | Image | `https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg` |
| our-planet | Image | `https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg` |
| through-time | Image | `https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg` |
| human-footprint | Image | `https://images.pexels.com/photos/929385/pexels-photo-929385.jpeg` |
| in-action | Image | `https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg` |
| voices | Image | `https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg` |
| take-action | Image | `https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg` |

`next.config.mjs` must have `images.pexels.com` and `videos.pexels.com` in `remotePatterns`.

---

## Observatory — three-layer data architecture

The Observatory uses three layers. Each has a defined max staleness and powers specific UI components. **Do not collapse these into a single build-time approach** — the Route Handler (Layer 2) is essential for current value accuracy.

```
Layer 1  build-time static     /public/data/*.json via CDN
         max staleness: 31 days (refreshed by Layer 3)
         powers: trend charts, sparklines, YearScrubber, LifetimeWidget

Layer 2  Route Handler          /api/observatory/[metric]/route.ts
         on-demand, edge-cached 24h, falls back to Layer 1 on failure
         powers: MetricCard current value badge, StatusBadge

Layer 3  GitHub Action cron     .github/workflows/refresh-data.yml
         runs 1st of each month, re-runs fetch-data.ts, commits JSON, triggers rebuild
         keeps Layer 1 historical series current
```

### Layer 2 — Route Handler pattern

```ts
// src/app/api/observatory/[metric]/route.ts
export async function GET(req, { params }) {
  try {
    // fetch only the latest row from upstream CSV
    // parse and return { year, value }
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600' }
    });
  } catch {
    // fallback: read from /public/data/[metric].json, return last non-null series entry
  }
}
```

### Layer 3 — GitHub Action pattern

```yaml
# .github/workflows/refresh-data.yml
on:
  schedule:
    - cron: '0 2 1 * *'   # 1st of month, 02:00 UTC
  workflow_dispatch:
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run fetch-data
      - run: |
          git config user.email "bot@earthpulse.org"
          git config user.name "EarthPulse Data Bot"
          git add public/data/
          git diff --staged --quiet || git commit -m "chore: refresh observatory data $(date +%Y-%m)"
          git push
```

### Staleness per UI component

| UI component | Data source | Max staleness |
|-------------|-------------|---------------|
| Trend chart (full history) | Layer 1 JSON | 31 days |
| Sparkline on MetricCard | Layer 1 JSON | 31 days |
| YearScrubber / LifetimeWidget | Layer 1 JSON | 31 days |
| Current value badge | Layer 2 Route Handler | 24 hours |
| StatusBadge (Safe/Caution/Critical) | Layer 2 Route Handler | 24 hours |
| DataProvenancePanel "last updated" | Layer 2 + Layer 1 `lastFetched` | 24 hours |

---

## Observatory — data sources (all public domain, no API key required)

| Metric | Agency | URL |
|--------|--------|-----|
| Temperature anomaly | NASA GISS | `https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv` |
| Atmospheric CO₂ | NOAA | `https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv` |
| Sea level rise | NASA JPL | `https://sealevel.nasa.gov/ftp/txt/MSL_Seasonal_v3.1.txt` |
| Arctic sea ice | NSIDC | `https://noaadata.apps.nsidc.org/NOAA/G02135/north/monthly/data/N_09_extent_v3.0.csv` |
| Deforestation | Global Forest Watch | GFW Open Data API (fallback: hardcoded series) |
| Glacier mass balance | WGMS | `https://wgms.ch/downloads/` (fallback: hardcoded series) |

---

## Observatory — MetricDataset schema

All 6 JSON files in `/public/data/` follow this schema:

```ts
interface MetricDataset {
  id: string;
  label: string;
  unit: string;
  source: {
    agency: string;
    dataset: string;
    url: string;
    methodology: string;
    lastFetched: string;       // ISO timestamp
  };
  thresholds: {
    safe: number;
    caution: number;
    critical: number;
  };
  series: Array<{
    year: number;
    value: number | null;      // null for gap years
  }>;
}
```

---

## Observatory — METRIC_META (in src/lib/observatory.ts)

```ts
export const METRIC_META = {
  temperature:   { label: 'Temperature Anomaly', unit: '°C',      icon: '🌡️', agency: 'NASA GISS',          thresholds: { safe: 1.0,     caution: 1.5,   critical: 2.0   }, higherIsBetter: false },
  co2:           { label: 'Atmospheric CO₂',     unit: 'ppm',     icon: '💨', agency: 'NOAA',               thresholds: { safe: 350,     caution: 400,   critical: 450   }, higherIsBetter: false },
  'sea-level':   { label: 'Sea Level Rise',       unit: 'mm',      icon: '🌊', agency: 'NASA JPL',           thresholds: { safe: 50,      caution: 100,   critical: 150   }, higherIsBetter: false },
  'sea-ice':     { label: 'Arctic Sea Ice',       unit: 'M km²',   icon: '🧊', agency: 'NSIDC',             thresholds: { safe: 6.0,     caution: 4.5,   critical: 3.5   }, higherIsBetter: true  },
  deforestation: { label: 'Deforestation Rate',   unit: 'Mha/yr',  icon: '🌳', agency: 'Global Forest Watch',thresholds: { safe: 8,       caution: 12,    critical: 15    }, higherIsBetter: false },
  glaciers:      { label: 'Glacier Mass Balance', unit: 'mm w.e.', icon: '⛰️', agency: 'WGMS',              thresholds: { safe: -10000,  caution: -20000,critical: -28000}, higherIsBetter: true  },
};
```

---

## Observatory — component conventions

- `ObservatoryFAB`: fixed `bottom-6 right-6 z-50 lg:hidden` — mobile only
- `Dashboard`: dark layout `bg-slate-950`, loads all 6 JSON files as server component, passes data to client islands
- `MetricCard`: client component — sparkline via Recharts `<LineChart>`, no axes, thin line; delta calculated from `baselineYear` prop
- `MetricChart`: dynamically imported (`next/dynamic`, `ssr: false`); `<ComposedChart>` with `<Area>`, `<ReferenceLine>` per threshold, `<Brush>` for zoom
- `YearScrubber`: `<input type="range">` with `accent-emerald-500`; state lives in `Dashboard`, passed down as props
- `LifetimeWidget`: client-side only — birth year input, calculates deltas using `getDeltaFromYear()` from `observatory.ts`, never persists or transmits data
- `StatusBadge`: derives status via `getThresholdStatus()` from `observatory.ts`

---

## Observatory — Navbar integration

**Desktop:** teal pill link between nav links and ThemeToggle:
```tsx
<Link href="/observatory" className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-400/10 border border-brand-400/30 text-brand-400 hover:bg-brand-400/20 transition-colors">
  🛰️ Observatory
</Link>
```

**Mobile:** `ObservatoryFAB` component rendered in `layout.tsx` after `<Footer />`, inside `<ThemeProvider>`.

---

## Completed features

- [x] Homepage — hero video/image, stats bar, pillar grid, featured articles, newsletter CTA
- [x] Pillar index pages with contextual banner images
- [x] Article pages — MDX rendering, breadcrumbs, tags, reading time, optional cover image
- [x] Tag pages
- [x] Navbar — responsive, dark mode toggle, Observatory pill
- [x] Footer
- [x] ArticleCard component
- [x] Content library (`src/lib/content.ts`)
- [x] 6 seed articles (one per pillar)
- [x] Dark mode toggle (`next-themes`)
- [x] MDX callout components — Tip, DidYouKnow, Impact
- [x] About page (`/about`)
- [x] Newsletter page (`/newsletter`) — Brevo embed placeholder
- [x] Contribute page (`/contribute`)
- [x] Privacy page (`/privacy`)
- [x] Observatory — data fetch script, all 6 metrics
- [x] Observatory — landing dashboard (`/observatory`)
- [x] Observatory — deep-dive pages (`/observatory/[metric]`)
- [x] Observatory — MetricCard, MetricChart, YearScrubber, LifetimeWidget, StatusBadge, DataProvenancePanel
- [x] Observatory — ObservatoryFAB (mobile)
- [x] README, FUNCTIONAL_SPEC, TECHNICAL_DESIGN, CLAUDE.md

---

## Planned — v2 remaining

| Feature | Notes |
|---------|-------|
| Site search | Pagefind — static, zero server |
| Sitemap | `src/app/sitemap.ts` covering all routes including Observatory |
| robots.txt | `src/app/robots.ts` |
| Reading progress bar | Client component, scroll listener on article pages |
| Brevo newsletter form | Route Handler + Brevo API key |
| GitHub Action for data refresh | `.github/workflows/refresh-data.yml` monthly cron |

---

## Planned — v3 future

| Feature | Notes |
|---------|-------|
| User accounts | Clerk or NextAuth |
| Comments | Giscus (GitHub Discussions) |
| Community observation pins | Mapbox GL JS + Supabase |
| Live satellite imagery | NASA Worldview WMTS tiles |
| Observatory alert subscriptions | Brevo transactional + threshold comparison |
| Multilingual | Next.js i18n routing |
| Educator mode | Simplified Observatory view |
| Carbon calculator | Client-side only widget |

---

## Commands

```bash
npm run dev          # local dev at http://localhost:3000
npm run fetch-data   # manually refresh Observatory JSON datasets
npm run build        # production build (runs fetch-data first via prebuild)
npm run lint         # ESLint
```
