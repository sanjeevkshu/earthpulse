# EarthPulse — Technical Design Document

**Version:** 2.0
**Status:** Active
**Last updated:** June 2026

---

## 1. Architecture overview

EarthPulse is a statically generated website with a decoupled content layer. Content is authored as MDX files in a Git repository and rendered at build time into static HTML. There is no server, no database, and no runtime content fetching for editorial content.

The Observatory feature adds a hybrid static + optional live data layer for planetary metrics — datasets are fetched at build time and bundled as static JSON, with an optional Route Handler for near-live top-ups.

```
┌─────────────────────────┐
│   GitHub repository      │  ← Source of truth: code + content + data scripts
└────────┬────────────────┘
         │ git push
         ▼
┌─────────────────────────┐
│   Vercel CI/CD           │  ← Detects push, runs prebuild (fetch-data) then next build
└────────┬────────────────┘
         │ builds static HTML/CSS/JS + public/data/*.json
         ▼
┌─────────────────────────┐
│   Vercel CDN             │  ← Serves globally, SSL automatic, JSON files cached at edge
└─────────────────────────┘
         │ browser request
         ▼
┌─────────────────────────┐
│   User browser           │  ← No server runtime; Observatory data from CDN-cached JSON
└─────────────────────────┘
```

**Key architectural properties:**

- No server to manage. All pages are pre-rendered at build time.
- Content updates trigger a rebuild. A push to `main` triggers Vercel to rebuild and deploy in under 90 seconds.
- Observatory data is pre-fetched at build time from public APIs (NASA, NOAA, NSIDC, GFW, WGMS) and stored as static JSON in `/public/data/` — zero API dependency at runtime.
- Content is version-controlled. Every article and data snapshot is tracked in Git.
- Zero cost to operate on Vercel Hobby tier.

---

## 2. Technology stack

| Layer | Technology | Version | Licence |
|-------|-----------|---------|---------|
| Framework | Next.js | 14.2.x | MIT |
| Language | TypeScript | 5.x | Apache 2.0 |
| Styling | Tailwind CSS | 3.4.x | MIT |
| Typography plugin | @tailwindcss/typography | 0.5.x | MIT |
| Content parsing | gray-matter | 4.x | MIT |
| MDX rendering | next-mdx-remote | 5.x | MIT |
| Reading time | reading-time | 1.5.x | MIT |
| Date formatting | date-fns | 3.x | MIT |
| Theme management | next-themes | 0.3.x | MIT |
| Data charting | recharts | 2.x | MIT |
| CSV parsing (build) | csv-parse | 5.x | MIT |
| Script runner | tsx | 4.x | MIT |
| Runtime | Node.js | 20 LTS | MIT |
| Package manager | npm | 9+ | — |
| Hosting | Vercel | — | Proprietary (free tier) |

All dependencies are open-source and free.

---

## 3. Directory structure

```
earthpulse/
├── scripts/
│   └── fetch-observatory-data.ts    ← build-time data fetch from NASA/NOAA/NSIDC/GFW/WGMS
├── content/                         ← all article content (MDX files)
│   ├── our-planet/
│   ├── through-time/
│   ├── human-footprint/
│   ├── in-action/
│   ├── voices/
│   └── take-action/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   └── articles/
│   ├── og/                          ← Open Graph images
│   └── data/                        ← Observatory: static JSON datasets (generated)
│       ├── temperature.json
│       ├── co2.json
│       ├── sea-level.json
│       ├── sea-ice.json
│       ├── deforestation.json
│       └── glaciers.json
├── src/
│   ├── app/
│   │   ├── layout.tsx               ← Root HTML shell; ThemeProvider + ObservatoryFAB
│   │   ├── page.tsx                 ← Homepage
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── newsletter/
│   │   │   └── page.tsx
│   │   ├── contribute/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── observatory/
│   │   │   ├── page.tsx             ← Observatory landing dashboard
│   │   │   └── [metric]/
│   │   │       └── page.tsx         ← Individual metric deep-dive
│   │   ├── api/
│   │   │   └── observatory/
│   │   │       └── [metric]/
│   │   │           └── route.ts     ← Optional live data refresh endpoint
│   │   ├── [pillar]/
│   │   │   ├── page.tsx             ← Pillar index
│   │   │   └── [slug]/
│   │   │       └── page.tsx         ← Article page
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           ← Observatory pill added
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── article/
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── Tip.tsx              ← MDX callout component
│   │   │   ├── DidYouKnow.tsx       ← MDX callout component
│   │   │   └── Impact.tsx           ← MDX callout component
│   │   ├── observatory/
│   │   │   ├── ObservatoryFAB.tsx   ← Mobile floating action button
│   │   │   ├── Dashboard.tsx        ← Landing dashboard layout
│   │   │   ├── MetricCard.tsx       ← Metric card with sparkline + status
│   │   │   ├── MetricChart.tsx      ← Full Recharts interactive chart
│   │   │   ├── ThresholdBands.tsx   ← IPCC threshold overlay
│   │   │   ├── LifetimeWidget.tsx   ← Birth year personalisation widget
│   │   │   ├── YearScrubber.tsx     ← Global timeline slider
│   │   │   ├── StatusBadge.tsx      ← Safe / Caution / Critical indicator
│   │   │   └── DataProvenancePanel.tsx
│   │   └── ui/
│   │       └── ThemeToggle.tsx
│   └── lib/
│       ├── content.ts               ← MDX loader, getAllArticles, PILLAR_META
│       └── observatory.ts           ← MetricDataset type, METRIC_META, threshold logic
├── CLAUDE.md
├── README.md
├── FUNCTIONAL_SPEC.md
├── TECHNICAL_DESIGN.md
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Content pipeline

### 4.1 MDX file format

Every article is a `.mdx` file with YAML frontmatter and Markdown/MDX body:

```
---
title: "Article title"
description: "Short description for SEO and cards"
date: "2024-06-01"
author: "Author Name"
tags: ["tag1", "tag2"]
featured: false
coverImage: "/images/articles/my-image.jpg"   # optional; also accepts Pexels URLs
---

## Article content in Markdown

<DidYouKnow>A surprising fact.</DidYouKnow>
<Impact>A quantified consequence.</Impact>
<Tip>A practical suggestion.</Tip>
```

### 4.2 Content loading (`src/lib/content.ts`)

| Function | Returns | Purpose |
|----------|---------|---------|
| `getAllArticles(pillar?)` | `ArticleMeta[]` | All articles, optionally filtered, sorted newest first |
| `getArticle(pillar, slug)` | `Article \| null` | Single article with MDX content |
| `getFeaturedArticles(n)` | `ArticleMeta[]` | Top N featured articles |
| `getArticlesByTag(tag)` | `ArticleMeta[]` | Articles matching a tag |
| `getSlugsForPillar(pillar)` | `string[]` | All slugs in a pillar directory |

### 4.3 MDX callout components

Three components registered in the article page via `MDXRemote` `components` prop:

| Component | File | Colour | Icon | Purpose |
|-----------|------|--------|------|---------|
| `<Tip>` | `article/Tip.tsx` | Amber | 💡 | Practical advice |
| `<DidYouKnow>` | `article/DidYouKnow.tsx` | Teal/brand | 🌍 | Surprising fact |
| `<Impact>` | `article/Impact.tsx` | Orange | ⚡ | Quantified impact stat |

---

## 5. Observatory data pipeline

### 5.1 Architecture — three-layer data model

The Observatory uses a three-layer approach to balance freshness, performance, cost, and resilience. Each layer serves a distinct purpose and has a defined maximum staleness.

```
Layer 1 — Build-time static (historical series)
  scripts/fetch-observatory-data.ts  →  /public/data/*.json  →  Vercel CDN
  Max staleness: age of last deploy (refreshed monthly by Layer 3)
  Powers: trend charts, sparklines, YearScrubber, LifetimeWidget

Layer 2 — Route Handler (current year value, on-demand)
  Browser request  →  /api/observatory/[metric]/route.ts
                   →  upstream NASA/NOAA endpoint (latest row only)
                   →  Vercel edge cache 24h
  Max staleness: 24 hours
  Powers: MetricCard "current value" badge, StatusBadge

Layer 3 — GitHub Action (monthly scheduled refresh)
  Cron (1st of each month)  →  fetch-data.ts  →  git commit
                            →  Vercel rebuild  →  Layer 1 updated
  Max staleness of historical series: 31 days
  Powers: keeps Layer 1 JSON current so trend charts never drift
```

**Why this matters for credibility:** The MetricCard shows CO₂ at "424 ppm" — the value users will cross-check against NOAA. Layer 2 ensures that value is always within 24 hours of the real figure. The trend chart behind it (Layer 1) uses the full historical series fetched at the last monthly rebuild — never more than 31 days behind for historical data.

### 5.2 Layer 1 — build-time data fetch script

File: `scripts/fetch-observatory-data.ts`

Runs via `npm run fetch-data`, called automatically as a `prebuild` script before every Vercel deploy. Fetches 6 public-domain datasets, parses CSV, normalises to the `MetricDataset` schema, and writes to `/public/data/*.json`.

**Data sources:**

| Metric | Agency | URL | Format |
|--------|--------|-----|--------|
| Temperature anomaly | NASA GISS | `https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv` | CSV |
| Atmospheric CO₂ | NOAA | `https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv` | CSV |
| Sea level rise | NASA JPL | `https://sealevel.nasa.gov/ftp/txt/MSL_Seasonal_v3.1.txt` | Space-delimited |
| Arctic sea ice | NSIDC | `https://noaadata.apps.nsidc.org/NOAA/G02135/north/monthly/data/N_09_extent_v3.0.csv` | CSV |
| Deforestation | Global Forest Watch | GFW Open Data API | GeoJSON / hardcoded fallback |
| Glacier mass balance | WGMS | `https://wgms.ch/downloads/` | CSV / hardcoded fallback |

All sources are publicly available, no API keys required. Fetch failures fall back to the last known committed JSON — the build never fails due to upstream unavailability.

### 5.3 Layer 2 — Route Handler (current value)

File: `src/app/api/observatory/[metric]/route.ts`

A Next.js Route Handler that fetches only the **most recent row** from the upstream API for a given metric. Returns a single `{ year, value }` object. The response is cached at the Vercel edge for **24 hours** via `Cache-Control: s-maxage=86400, stale-while-revalidate`.

**Behaviour:**
- On cache miss: fetches the upstream CSV, extracts the last non-null row, returns JSON
- On upstream failure: returns the latest value from the static JSON in `/public/data/[metric].json` as fallback
- Client components call this endpoint to display the "current value" on MetricCard

**Edge cache header:**
```ts
return NextResponse.json(data, {
  headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600' }
});
```

### 5.4 Layer 3 — GitHub Action monthly refresh

File: `.github/workflows/refresh-data.yml`

Scheduled cron job (1st of each month, 02:00 UTC). Runs `npm run fetch-data`, commits any changed JSON files with a timestamped message, and pushes to `main` — triggering a Vercel rebuild that updates Layer 1.

```yaml
on:
  schedule:
    - cron: '0 2 1 * *'   # 1st of month, 02:00 UTC
  workflow_dispatch:       # allow manual trigger
```

### 5.5 MetricDataset schema

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
    lastFetched: string;       // ISO timestamp of last successful fetch
  };
  thresholds: {
    safe: number;
    caution: number;
    critical: number;
  };
  series: Array<{
    year: number;
    value: number | null;      // null for missing/gap years
  }>;
}
```

### 5.6 METRIC_META thresholds (IPCC-aligned)

| Metric | Safe | Caution | Critical | Higher is better? |
|--------|------|---------|----------|-------------------|
| temperature | < 1.0°C | 1.0–1.5°C | > 1.5°C | No |
| co2 | < 350 ppm | 350–400 ppm | > 400 ppm | No |
| sea-level | < 50 mm | 50–150 mm | > 150 mm | No |
| sea-ice | > 6.0 M km² | 4.0–6.0 | < 4.0 | Yes |
| deforestation | < 8 Mha/yr | 8–12 Mha/yr | > 12 Mha/yr | No |
| glaciers | > −10,000 mm | −10k to −20k | < −20,000 mm | Yes |

### 5.7 Staleness summary

| What is displayed | Powered by | Max staleness |
|-------------------|-----------|---------------|
| Trend chart (full history) | Layer 1 static JSON | 31 days |
| Sparkline on MetricCard | Layer 1 static JSON | 31 days |
| YearScrubber / LifetimeWidget deltas | Layer 1 static JSON | 31 days |
| Current value badge on MetricCard | Layer 2 Route Handler | 24 hours |
| StatusBadge (Safe/Caution/Critical) | Layer 2 Route Handler | 24 hours |
| DataProvenancePanel "last updated" | Layer 2 response + Layer 1 `lastFetched` | 24 hours |

---

## 6. Routing

| URL pattern | Page component | Render strategy |
|-------------|---------------|-----------------|
| `/` | `src/app/page.tsx` | SSG |
| `/[pillar]` | `src/app/[pillar]/page.tsx` | SSG |
| `/[pillar]/[slug]` | `src/app/[pillar]/[slug]/page.tsx` | SSG |
| `/tag/[tag]` | `src/app/tag/[tag]/page.tsx` | SSG |
| `/about` | `src/app/about/page.tsx` | SSG |
| `/newsletter` | `src/app/newsletter/page.tsx` | SSG |
| `/contribute` | `src/app/contribute/page.tsx` | SSG |
| `/privacy` | `src/app/privacy/page.tsx` | SSG |
| `/observatory` | `src/app/observatory/page.tsx` | SSG |
| `/observatory/[metric]` | `src/app/observatory/[metric]/page.tsx` | SSG |
| `/api/observatory/[metric]` | Route Handler | Server (optional live) |

All non-API routes use `generateStaticParams()` and are fully static.

---

## 7. Rendering strategy

| Page type | Strategy | Reason |
|-----------|---------|--------|
| All editorial pages | SSG | Content is static at build time |
| Observatory dashboard | SSG | Data JSON served from CDN |
| Observatory deep-dive | SSG | One page per metric, static |
| Observatory live endpoint | Route Handler | Optional near-live top-up only |

---

## 8. Styling

Tailwind CSS throughout. Custom design tokens in `tailwind.config.ts`:

- **Brand colour:** teal-green ramp (`brand-400 = #1D9E75`)
- **Dark mode:** `class` strategy via `next-themes` — manual toggle + system default
- **Observatory palette:** dark-first, independent of site theme
  - Background: `bg-slate-950` / `bg-slate-900`
  - Accent: `brand-400` (`#1D9E75`)
  - Warning: amber `#F59E0B`
  - Critical: red `#EF4444`
- **Typography:** `@tailwindcss/typography` for article prose (`prose-custom` class)

**Global CSS utility classes** (defined in `globals.css`):
`.btn-primary`, `.btn-outline`, `.card`, `.tag`, `.nav-link`, `.section-title`, `.prose-custom`

---

## 9. Hero media

All hero media sourced from Pexels (free licence, no attribution required for editorial use) and served directly via URL — no local copies stored in the repository.

| Location | Type | Behaviour |
|----------|------|-----------|
| Homepage | Video + fallback image | Autoplay, muted, looped; `prefers-reduced-motion` shows still image |
| Pillar pages | Static image (Pexels) | `next/image` with `fill`, `priority`, bottom scrim |
| Article pages | Optional `coverImage` frontmatter | Renders if set; clean layout if not |

`next.config.mjs` must allowlist `images.pexels.com` and `videos.pexels.com` as remote patterns.

---

## 10. Observatory UI components

| Component | Type | Purpose |
|-----------|------|---------|
| `ObservatoryFAB` | Client, fixed | Mobile floating action button — bottom-right, links to `/observatory` |
| `Dashboard` | Server + client islands | Landing layout, metric grid, year scrubber |
| `MetricCard` | Client | Card with sparkline, delta, StatusBadge, agency, Explore link |
| `MetricChart` | Client (dynamic import, ssr:false) | Full Recharts interactive chart with threshold bands and brush zoom |
| `ThresholdBands` | Client | IPCC reference lines overlaid on MetricChart |
| `LifetimeWidget` | Client | Birth year input → personalised deltas per metric, client-side only |
| `YearScrubber` | Client | Range input controlling baseline year across all MetricCards |
| `StatusBadge` | Client | Safe / Caution / Critical pill derived from threshold logic |
| `DataProvenancePanel` | Server | Source agency, dataset name, last fetched, methodology link |

All Observatory chart components are dynamically imported (`next/dynamic`, `ssr: false`) to avoid SSR hydration issues with Recharts.

---

## 11. SEO

- `generateMetadata()` exported from every page
- Root layout defines site-wide defaults with per-page overrides
- Observatory pages include structured metadata reflecting current metric values
- Sitemap generation planned (`src/app/sitemap.ts`) — covers all pillar, article, tag, and Observatory pages
- `robots.txt` planned (`src/app/robots.ts`)

---

## 12. Performance

Target Core Web Vitals:

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 100ms |
| CLS | < 0.1 |

Measures in place:
- Full SSG — no server round-trips
- Observatory JSON served from Vercel CDN edge
- Recharts dynamically imported — not in initial bundle
- `next/image` for all images — automatic WebP, lazy load, responsive sizing
- Tailwind CSS purged in production — minimal CSS payload
- `next/link` prefetch on hover for instant client-side navigation
- Skeleton loaders on Observatory metric cards during client hydration

---

## 13. Deployment

### Vercel deployment

1. Connect GitHub repo to Vercel
2. Framework preset: Next.js (auto-detected)
3. Build command: `npm run build` (triggers `prebuild` → `fetch-data` automatically)
4. No environment variables required for v1/v2

### Environment variables (current and planned)

| Variable | Purpose | Required |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | Absolute URL for OG and sitemap | v2 |
| `BREVO_API_KEY` | Newsletter form submission handler | v2 |

### Branch workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deployed to live site |
| `dev` | Staging — Vercel preview URL |
| `content/*` | New articles — reviewed via PR |
| `feat/*` | Feature development — reviewed via PR |
| `data/*` | Observatory data refreshes — PR before merge |

---

## 14. Content update workflow

For editorial contributors (no code knowledge required):

1. Navigate to the content folder on GitHub
2. Create a new `.mdx` file or edit an existing one
3. Commit to `main` (trusted editor) or open a branch PR for review
4. Vercel detects the push and rebuilds — new article live in ~90 seconds

For Observatory data refresh:

1. Run `npm run fetch-data` locally (or trigger GitHub Action)
2. Review the updated `/public/data/*.json` files
3. Commit and push — Vercel rebuilds with fresh data

---

## 15. Phase 2 technical additions (remaining)

| Feature | Technical approach |
|---------|-------------------|
| Site search | Pagefind — runs at build time, generates a static search index |
| Newsletter form | Brevo API + Next.js Route Handler |
| Sitemap | `src/app/sitemap.ts` using `getAllArticles()` + Observatory routes |
| robots.txt | `src/app/robots.ts` |
| Reading progress bar | Client component, `scroll` event listener on article pages |
| Dark mode toggle | ✅ Done — `next-themes` |
| Hero media | ✅ Done — Pexels video/image |
| Callout components | ✅ Done — Tip, DidYouKnow, Impact |
| Observatory | ✅ Done — see sections 5, 10, 13 |
| About / Newsletter / Contribute / Privacy pages | ✅ Done |

---

## 16. Phase 3 future additions

| Feature | Technical approach |
|---------|-------------------|
| User accounts | Clerk or NextAuth (free tiers) |
| Comments | Giscus (GitHub Discussions backed) |
| Community observation pins | Mapbox GL JS free tier + Supabase for pin storage |
| Live satellite imagery | NASA Worldview WMTS tiles (free, public domain) |
| Observatory alert subscriptions | Brevo transactional email + threshold comparison on data refresh |
| Multilingual | Next.js i18n routing |
| Educator mode | Simplified Observatory view with curriculum-aligned copy |
| Personal carbon calculator | Client-side only, no data stored |
