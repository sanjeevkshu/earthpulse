# EarthPulse — Technical Design Document

**Version:** 2.0
**Status:** Active — updated for v3.0.0 (Observatory)
**Last updated:** June 2026

---

## 1. Architecture overview

EarthPulse is a statically generated website with a decoupled content layer and a build-time data pipeline for the Observatory. Content is authored as MDX files and rendered at build time. Observatory datasets are fetched from public APIs at build time and stored as static JSON — zero runtime API dependency.

```
┌─────────────────────────┐
│   GitHub repository      │  ← Source of truth: code + content + data scripts
└────────┬────────────────┘
         │ git push
         ▼
┌─────────────────────────┐
│   Vercel CI/CD           │  ← Detects push; runs prebuild (fetch-data) then next build
└────────┬────────────────┘
         │ builds static HTML/CSS/JS + public/data/*.json
         ▼
┌─────────────────────────┐
│   Vercel CDN             │  ← Serves globally; JSON files cached at edge
└─────────────────────────┘
         │ browser request
         ▼
┌─────────────────────────┐
│   User browser           │  ← No server runtime; Observatory data from CDN-cached JSON
└─────────────────────┘
```

**Key architectural properties:**

- **No server to manage.** All pages are pre-rendered at build time.
- **Content updates trigger a rebuild.** A new article pushed to `main` triggers Vercel to rebuild and deploy the site, typically in under 90 seconds.
- **Content is version-controlled.** Every change to an article is tracked in Git history. Rollbacks are trivial.
- **Zero cost to operate.** Vercel's Hobby tier is sufficient for this site at current scale.

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
| Runtime | Node.js | 20 LTS | MIT |
| Package manager | npm | 9+ | — |
| Hosting | Vercel | — | Proprietary (free tier) |

All dependencies are open-source and free. Vercel's free Hobby tier has no cost for personal and open-source projects.

---

## 3. Directory structure

```
earthpulse/
├── content/                   ← All article content (MDX files)
│   ├── our-planet/
│   ├── through-time/
│   ├── human-footprint/
│   ├── in-action/
│   ├── voices/
│   └── take-action/
├── public/                    ← Static assets served as-is
│   ├── images/
│   │   ├── hero/
│   │   └── articles/
│   └── og/                    ← Open Graph images
├── src/
│   ├── app/                   ← Next.js App Router pages
│   │   ├── layout.tsx         ← Root HTML shell
│   │   ├── page.tsx           ← Homepage
│   │   ├── [pillar]/
│   │   │   ├── page.tsx       ← Pillar index page
│   │   │   └── [slug]/
│   │   │       └── page.tsx   ← Article page
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx   ← Tag listing page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── article/
│   │   │   └── ArticleCard.tsx
│   │   └── ui/                ← Shared UI primitives
│   └── lib/
│       └── content.ts         ← Content loading utilities
├── README.md
├── FUNCTIONAL_SPEC.md
├── TECHNICAL_DESIGN.md
├── next.config.ts                 ← TypeScript config (not .mjs)
│                                  NOTE: no tailwind.config.ts — Tailwind v4 uses CSS config
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
coverImage: "/images/articles/my-image.jpg"
---

## Article content in Markdown

Supports all standard Markdown plus JSX components.
```

### 4.2 Content loading (`src/lib/content.ts`)

The content library provides these functions:

| Function | Returns | Purpose |
|----------|---------|---------|
| `getAllArticles(pillar?)` | `ArticleMeta[]` | All articles, optionally filtered by pillar, sorted newest first |
| `getArticle(pillar, slug)` | `Article \| null` | Single article with full MDX content |
| `getFeaturedArticles(n)` | `ArticleMeta[]` | Top N articles with `featured: true` |
| `getArticlesByTag(tag)` | `ArticleMeta[]` | Articles matching a given tag |
| `getSlugsForPillar(pillar)` | `string[]` | All slugs in a pillar directory |

All functions read from the filesystem at build time — no database queries, no API calls.

### 4.3 Reading time

Reading time is calculated automatically at build time using the `reading-time` package, based on a 200 words-per-minute average.

---

## 5. Routing

Next.js App Router with filesystem-based routing:

| URL pattern | Page component | Notes |
|-------------|---------------|-------|
| `/` | `src/app/page.tsx` | Homepage |
| `/[pillar]` | `src/app/[pillar]/page.tsx` | Pillar index |
| `/[pillar]/[slug]` | `src/app/[pillar]/[slug]/page.tsx` | Article |
| `/tag/[tag]` | `src/app/tag/[tag]/page.tsx` | Tag listing |

All routes use `generateStaticParams()` to pre-render at build time. Dynamic routes that do not match a known pillar or slug return a 404 via `notFound()`.

---

## 6. Rendering strategy

| Page type | Strategy | Reason |
|-----------|---------|--------|
| Homepage | SSG (static) | Content rarely changes; fast to serve |
| Pillar index | SSG | Article list is built at deploy time |
| Article page | SSG | Article content is static |
| Tag page | SSG | Tag lists are determined at build time |

No pages use SSR or ISR in v1. Every page is fully static — optimal for CDN caching, TTFB, and Core Web Vitals.

---

## 7. Styling

Tailwind CSS utility classes are used throughout. Custom design tokens are defined in `src/app/globals.css` via `@theme` blocks (Tailwind v4 CSS-based config — no `tailwind.config.ts` file):

- **Brand colour:** A green teal ramp (`brand-50` to `brand-900`) based on `#1D9E75`
- **Dark mode:** `class` strategy — `next-themes` sets the `dark` class on `<html>`; Tailwind v4 requires `@custom-variant dark` in globals.css. Manual toggle in Navbar shipped in v2.0.0.
- **Typography:** `@tailwindcss/typography` plugin provides the `prose` class used for MDX article bodies.

Global utility classes defined in `globals.css`:
- `.btn-primary` — filled green CTA button
- `.btn-outline` — outlined green secondary button
- `.card` — white bordered card with hover state
- `.tag` — green pill for content tags
- `.nav-link` — navigation anchor with hover colour

---

## 8. SEO

### 8.1 Metadata

Each page exports a `generateMetadata()` function returning a `Metadata` object. The root layout defines site-wide defaults with per-page overrides:

- `title`: page-specific via template `%s | EarthPulse`
- `description`: article description or pillar description
- `openGraph.title`, `openGraph.description`: same as above
- `twitter.card`: `summary_large_image`

### 8.2 Sitemap

A `sitemap.ts` file (to be added in the route group) uses `getAllArticles()` to generate a dynamic sitemap at build time, covering all pillar index pages and all article pages.

### 8.3 robots.txt

Standard `robots.txt` allowing all crawlers and pointing to the sitemap.

---

## 9. Performance

Target Core Web Vitals (measured on Vercel deployment):

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

Measures in place:
- Static generation (no server round-trips)
- Next.js automatic code splitting
- Tailwind CSS purging unused styles in production
- `next/link` for client-side navigation (prefetch on hover)
- Images should use `next/image` for automatic WebP conversion and lazy loading

---

## 10. Observatory — data pipeline (three-layer architecture)

### 10.1 Architecture overview

The Observatory uses a three-layer approach to balance freshness, performance, cost, and resilience. **Do not collapse these into a single build-time approach** — Layer 2 is essential for current value accuracy.

```
Layer 1 — Build-time static (historical series)
  scripts/fetch-observatory-data.ts  →  /public/data/*.json  →  Vercel CDN
  Max staleness: 31 days (refreshed monthly by Layer 3)
  Powers: trend charts, sparklines, YearScrubber, LifetimeWidget

Layer 2 — Route Handler (current year value, on-demand)
  Browser request  →  /api/observatory/[metric]/route.ts
                   →  upstream NASA/NOAA endpoint (latest row only)
                   →  Vercel edge cache 24h
  Max staleness: 24 hours
  Powers: MetricCard "current value" badge, StatusBadge

Layer 3 — GitHub Action (monthly scheduled refresh)
  Cron (1st of each month, 02:00 UTC)  →  fetch-data.ts  →  git commit
                                        →  Vercel rebuild  →  Layer 1 updated
  Max staleness of historical series: 31 days
  Powers: keeps Layer 1 JSON current so trend charts never drift
```

**Why this matters:** The MetricCard shows CO₂ at "424 ppm" — a value users cross-check against NOAA. Layer 2 ensures that number is always within 24 hours of reality. The trend chart (Layer 1) uses the full historical series from the last monthly rebuild — never more than 31 days behind.

### 10.2 Layer 1 — build-time fetch script

File: `scripts/fetch-observatory-data.ts`

Runs via `prebuild` hook before every Vercel deploy. Also runnable manually: `npm run fetch-data`.

| Metric | URL | Format |
|--------|-----|--------|
| temperature | NASA GISS GISTEMP CSV | CSV, Year + J-D annual column |
| co2 | NOAA Mauna Loa annual mean | CSV, skip `#` comment lines |
| sea-level | NASA JPL MSL text | Space-delimited, decimal year grouped by integer year |
| sea-ice | NSIDC September extent | CSV, filter mo=9 rows |
| deforestation | GFW (hardcoded fallback) | Hansen et al. annual series |
| glaciers | WGMS (hardcoded fallback) | Cumulative mass balance series |

On failure: logs error, keeps existing JSON, never crashes the build.

### 10.3 Layer 2 — Route Handler (current value)

File: `src/app/api/observatory/[metric]/route.ts`

Fetches only the **most recent row** from the upstream API for the given metric. Returns a single `LivePoint` object. Cached at the Vercel edge for **24 hours**.

**Response shape:**
```ts
{ year: number; value: number; unit: string; agency: string; fallback?: true; }
// fallback: true — present only when served from static JSON (upstream unreachable)
```

**Cache header:**
```ts
'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600'
```

**Fallback behaviour:** on upstream failure, reads `/public/data/[metric].json`, returns the last non-null entry from `series` plus `fallback: true`. MetricCard shows a subtle "cached" label in this case.

### 10.4 Layer 3 — GitHub Action monthly refresh

File: `.github/workflows/refresh-data.yml`

Scheduled cron job (1st of each month, 02:00 UTC). Runs `npm run fetch-data`, commits any changed JSON files, and pushes to `main` — triggering a Vercel rebuild that updates Layer 1.

```yaml
on:
  schedule:
    - cron: '0 2 1 * *'
  workflow_dispatch:
```

### 10.5 Staleness per UI component

| UI component | Data source | Max staleness |
|---|---|---|
| Trend chart (full history) | Layer 1 static JSON | 31 days |
| Sparkline on MetricCard | Layer 1 static JSON | 31 days |
| YearScrubber / LifetimeWidget | Layer 1 static JSON | 31 days |
| Current value badge | Layer 2 Route Handler | 24 hours |
| StatusBadge (Safe/Caution/Critical) | Layer 2 Route Handler | 24 hours |
| DataProvenancePanel "last updated" | Layer 1 `lastFetched` field | 31 days |

### 10.6 Observatory routing

| Route | Component | Render |
|-------|-----------|--------|
| `/observatory` | `src/app/observatory/page.tsx` | SSG |
| `/observatory/[metric]` | `src/app/observatory/[metric]/page.tsx` | SSG ×6 |
| `/api/observatory/[metric]` | `route.ts` | Server (Layer 2) |

### 10.7 Observatory UI components

All chart components use a client wrapper + `next/dynamic` with `ssr: false` (Recharts requirement).

| Component | Type | Data source | Purpose |
|-----------|------|-------------|---------|
| `ObservatoryFAB` | Client, fixed | — | Mobile FAB, `lg:hidden`, bottom-right |
| `MetricCard` | Client | Layer 2 (current value) + Layer 1 (sparkline) | Card: live value, delta, StatusBadge, sparkline |
| `MetricChart` / `MetricChartClient` | Client, ssr:false | Layer 1 | Full Recharts ComposedChart with Area, ReferenceLine, Brush |
| `YearScrubber` | Client | — | Range input controlling baseline year |
| `LifetimeWidget` | Client | Layer 1 (props) | Birth year → personalised deltas |
| `StatusBadge` | Client | Layer 2 (via MetricCard) | Safe/Caution/Critical pill |
| `DataProvenancePanel` | Server | Layer 1 `source` block | Agency, dataset, lastFetched, URLs |

### 10.8 Technology additions (v3.0.0)

| Package | Purpose |
|---------|---------|
| `recharts` | Interactive SVG charts |
| `csv-parse` | CSV parsing in fetch script (build-time only) |
| `tsx` | TypeScript script runner for `fetch-observatory-data.ts` |

---

## 11. Deployment

### 10.1 Vercel deployment

1. Connect GitHub repo to Vercel
2. Set root directory: `/` (default)
3. Framework preset: Next.js (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: `.next` (default)
6. No environment variables required for v1

### 10.2 Environment variables (v2+)

Future phases may require:

| Variable | Purpose |
|----------|---------|
| `BREVO_API_KEY` | Newsletter subscription handling |
| `NEXT_PUBLIC_SITE_URL` | Absolute URL for Open Graph and sitemap |

### 10.3 Branch workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deployed to live site |
| `dev` | Staging — Vercel preview URL |
| `content/*` | New articles — reviewed via PR before merge |
| `feat/*` | Feature development — reviewed via PR |

---

## 11. Content update workflow

For editorial contributors (no code knowledge required):

1. Navigate to the content folder on GitHub
2. Create a new `.mdx` file or edit an existing one
3. Commit changes — either directly to `main` (for trusted editors) or to a new branch for review
4. Vercel detects the change and rebuilds the site automatically
5. The new or updated article is live within ~90 seconds

---

## 12. Phase 2 technical additions

| Feature | Technical approach |
|---------|-------------------|
| Site search | Pagefind: runs at build time, generates a search index, served as static assets |
| Newsletter | Brevo API + Next.js Route Handler for form submission |
| Data visualisations | Recharts embedded in MDX via custom MDX components |
| Dark mode toggle | `next-themes` package, persisted in `localStorage` |
| Reading progress bar | Client component using `scroll` event listener |
| Comments | Giscus script tag in article layout, backed by GitHub Discussions |
