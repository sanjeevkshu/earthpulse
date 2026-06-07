@AGENTS.md

# EarthPulse — Claude Code context

This file is read automatically by Claude Code at the start of every session.
It provides full project context so Claude Code can continue development without re-explanation.

---

## Project summary

**EarthPulse** is an open-source, content-first environmental education website with a planetary data Observatory.
**Current version:** v3.0.0 (Jun 2026)
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · MDX · Recharts · Vercel
**Repo:** https://github.com/sanjeevkshu/earthpulse *(update this)*
**Live site:** https://earthpulse.org *(once deployed)*

---

## Architecture

- Fully statically generated (SSG) — no server, no database for editorial content
- Content lives as `.mdx` files in `/content`, parsed at build time
- Observatory data fetched from public APIs at build time, stored as static JSON in `/public/data/`
- `prebuild` script runs `fetch-observatory-data.ts` automatically before every build
- Deployed to Vercel free Hobby tier — auto-deploys on every push to `main`
- No CMS — content is authored directly as Markdown in Git

```
scripts/
  fetch-observatory-data.ts  ← build-time fetch from NASA/NOAA/NSIDC/GFW/WGMS
content/                     ← all MDX content
  our-planet/                ← pillar articles
  through-time/
  human-footprint/
  in-action/
  voices/
  take-action/
  pages/                     ← static site pages (About, Contribute, Newsletter, Privacy)
public/
  images/
  data/                      ← Observatory JSON datasets (generated at build)
    temperature.json · co2.json · sea-level.json · sea-ice.json · deforestation.json · glaciers.json
doc/                         ← authoring guides for content authors (see below)
src/
  app/
    layout.tsx               ← ThemeProvider + ObservatoryFAB
    page.tsx                 ← Homepage
    observatory/
      page.tsx               ← Observatory landing dashboard
      [metric]/page.tsx      ← Deep-dive per metric
    api/observatory/
      [metric]/route.ts      ← Layer 2: current value, edge-cached 24h
    [pillar]/page.tsx · [pillar]/[slug]/page.tsx · tag/[tag]/page.tsx
    about/ · newsletter/ · contribute/ · privacy/
  components/
    layout/                  ← Navbar (Observatory pill), Footer, ThemeProvider
    article/                 ← ArticleCard, Tip, DidYouKnow, Impact, Callout
    observatory/             ← ObservatoryFAB, MetricCard, MetricChart, YearScrubber,
                             ←   LifetimeWidget, StatusBadge, DataProvenancePanel
    ui/                      ← ThemeToggle, HeroMedia, BannerImage, PageHero, NewsletterForm
  lib/
    content.ts               ← MDX loader, getAllArticles, getArticle, PILLAR_META
    observatory.ts           ← MetricDataset type, METRIC_META, threshold logic, helpers
    pages.ts                 ← static page loader, getStaticPage
    mediaConfig.ts           ← all image/video URLs, resolveCoverImage
CLAUDE.md                    ← this file
README.md
functional_spec.md
technical_design.md
launch_guide.md
```

---

## Content model

Every article is a `.mdx` file with this frontmatter:

```yaml
---
title: "Article title"
description: "Short summary for SEO and cards"
date: "2024-06-01"          # ISO format
author: "Author Name"        # defaults to "EarthPulse Editorial"
tags: ["tag1", "tag2"]
featured: false              # true = shown in homepage featured section
coverImage: "https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1920&q=80"
coverVideo: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
---
```

**`coverVideo` convention:**
- Optional MP4 URL for the article/page PageHero hover/touch video effect
- Falls back through `resolveCoverVideo()`: frontmatter → pillar `videoSrc` → `NATURE_VIDEO_SRC`
- **CDN must return `Access-Control-Allow-Origin: *`** — see Security → Videos rule. Confirmed working source: `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4` (MDN CC0, 1.1MB, CORS `*`)
- If omitted, the pillar's default video plays (set in `PILLAR_IMAGES.videoSrc` in `mediaConfig.ts`)
- `coverVideo` is CONTENT metadata — it lives in MDX frontmatter, not in `mediaConfig.ts`
- Resolution function: `resolveCoverVideo(article.coverVideo, pillar)` in `src/lib/mediaConfig.ts`

**`coverImage` convention (v2.3.2+):**
- Recommended on all new articles — all 6 seed articles carry one
- If omitted, the article page automatically falls back to the pillar's contextual banner image so every article always has a visual header
- Use Unsplash CDN URLs (`images.unsplash.com`) — hotlinking permitted; routes through Next.js image proxy
- Choose an image specific to the article's subject — distinct from its pillar banner for visual variety
- Include `?auto=format&fit=crop&w=1920&q=80` to cap source resolution at 1920px
- Cover images are CONTENT metadata — they live in MDX frontmatter, not in `mediaConfig.ts`
- Fallback chain: `coverImage` → pillar image → pillar CSS gradient (all handled automatically)

---

## Static page content model (`content/pages/`)

Pages in `content/pages/` are authored in MDX and rendered with `PageHero` + `MDXRemote`, exactly like pillar article pages. The loader is `src/lib/pages.ts`.

Frontmatter fields:
```yaml
title: "Page title"
description: "One sentence — used as subtitle on PageHero and in <meta description>"
date: "2024-06-01"      # ISO — shown as "Last updated" on legal pages
icon: "🌿"              # Emoji badge overlaid on the PageHero
coverImage: "https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1920&q=80"
coverVideo: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
```

`coverVideo` frontmatter overrides `PAGE_CONFIG.videoSrc` when present. Falls back to `PAGE_CONFIG.videoSrc` → `NATURE_VIDEO_SRC` if absent. CDN must serve `Access-Control-Allow-Origin: *`.

Gradient and default `videoSrc` live in `PAGE_CONFIG` inside `pages.ts` — not in frontmatter.

Available MDX components: `Tip`, `DidYouKnow`, `Impact`, `Callout`, `NewsletterForm` (newsletter page only).

Current pages: `about.mdx` · `contribute.mdx` · `newsletter.mdx` · `privacy.mdx`

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

- **Brand colour:** teal-green (`brand-400 = #1D9E75`)
- **Dark mode:** `class` strategy via `next-themes` — toggle in Navbar, defaults to system preference, persists in localStorage. Tailwind v4 requires `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` to make `dark:` utilities respond to the class instead of the OS media query.
- **Observatory palette (dark-first, independent of site theme):**
  - Background: `bg-slate-950` / `bg-slate-900`
  - Accent: `brand-400` (#1D9E75)
  - Warning: amber `#F59E0B` (`text-amber-400`, `bg-amber-500/20`)
  - Critical: red `#EF4444` (`text-red-400`, `bg-red-500/20`)
- **Typography plugin:** `@tailwindcss/typography` — use `prose-custom` class on article bodies
- **Shared CSS classes:** `.btn-primary`, `.btn-outline`, `.card`, `.tag`, `.nav-link`, `.section-title`

---

## Release history

| Version | Date | Feature | Status |
|---------|------|---------|--------|
| v1.0.0 | Jun 2024 | Initial launch — homepage, pillar pages, article pages, tag pages, Navbar, Footer, ArticleCard, 6 seed articles | ✅ |
| v2.0.0 | Jun 2025 | Dark mode toggle — `next-themes`, `ThemeProvider`, `ThemeToggle` in Navbar | ✅ |
| v2.1.0 | Jun 2025 | Tailwind v4 dark mode bugfix — `@custom-variant dark` in `globals.css` | ✅ |
| v2.2.0 | Jun 2026 | Hero video/image banner · pillar banner images · article cover image · MDX callout components | ✅ |
| v2.3.0 | Jun 2026 | Media reliability fix — Unsplash CDN, 3-layer fallback, `mediaConfig.ts`, `HeroMedia`, `BannerImage` | ✅ |
| v2.3.1 | Jun 2026 | Content patch — `coverImage` added to all 6 seed articles; `mediaConfig.ts` scope boundary documented | ✅ |
| v2.3.2 | Jun 2026 | Fallback — article cover auto-fills from pillar image when `coverImage` frontmatter is absent | ✅ |
| v2.4.0 | Jun 2026 | UX elevation — session-rotating hero pool · PageHero (full-bleed, hybrid video/image, overlay title) · tag-based `resolveCoverImage` | ✅ |
| v2.5.0 | Jun 2026 | Static pages → MDX — About, Contribute, Newsletter, Privacy moved to `content/pages/`; new `pages.ts` loader; `Callout` + `NewsletterForm` components | ✅ |
| v3.0.0 | Jun 2026 | Observatory — planetary data dashboard with 6 metrics, fetch script, Recharts charts, YearScrubber, LifetimeWidget, deep-dive pages, Navbar pill + mobile FAB | 🔲 |
| v3.1.0 | — | Reading progress bar on article pages | 🔲 |
| v2.7.0 | — | Site search (Pagefind) · Sitemap · robots.txt | 🔲 |
| v2.8.0 | — | Interactive timeline · Data visualisations | 🔲 |
| v2.9.0 | — | Mega-menu | 🔲 |
| v3.0.0 | — | User accounts · Comments · Live data dashboards · Multilingual | 🔲 |

---

## Planned features — next up (v3.0.0+)

| Feature | Target | Notes |
|---------|--------|-------|
| **Observatory** | v3.0.0 | Planetary data dashboard — see Observatory sections below |
| Reading progress bar | v3.1.0 | Client component, scroll event listener, on article pages |
| Site search | v3.2.0 | Pagefind — runs at build time, zero server needed |
| Sitemap | v3.2.0 | `src/app/sitemap.ts` using `getAllArticles()` + Observatory routes |
| robots.txt | v3.2.0 | `src/app/robots.ts` |
| GitHub Action data refresh | v3.2.0 | `.github/workflows/refresh-data.yml` monthly cron |
| Interactive timeline | v3.3.0 | Visual, filterable timeline for Through Time section |
| Mega-menu | v3.4.0 | Rich pillar navigation with sub-topic links |

## Component inventory (`src/components/`)

| Path | Component | Since | Notes |
|------|-----------|-------|-------|
| `layout/Navbar.tsx` | Navbar | v1.0.0 | Sticky, responsive, mobile hamburger; ThemeToggle added v2.0.0 |
| `layout/Footer.tsx` | Footer | v1.0.0 | Navigation columns, GitHub link |
| `layout/ThemeProvider.tsx` | ThemeProvider | v2.0.0 | `next-themes` wrapper, class strategy |
| `ui/ThemeToggle.tsx` | ThemeToggle | v2.0.0 | Sun/moon icon button, hydration-safe |
| `article/ArticleCard.tsx` | ArticleCard | v1.0.0 | Pillar badge, tags, reading time |
| `ui/HeroMedia.tsx` | HeroMedia | v2.3.0 | Homepage hero — session-rotating pool, video→image→gradient fallback (client) |
| `ui/BannerImage.tsx` | BannerImage | v2.3.0 | Generic next/image + gradient fallback — utility; superseded by PageHero for full-bleed |
| `ui/PageHero.tsx` | PageHero | v2.4.0 | Full-bleed hybrid hero — static image, lazy video on hover/touch, IntersectionObserver, overlay title/breadcrumb |
| `ui/ThemeToggle.tsx` | ThemeToggle | v2.0.0 | Sun/moon icon button, hydration-safe |
| `ui/NewsletterForm.tsx` | NewsletterForm | v2.5.0 | Topics grid + Brevo embed placeholder (client); registered in newsletter.mdx |
| `article/Tip.tsx` | Tip | v2.2.0 | Amber callout box — 💡 |
| `article/DidYouKnow.tsx` | DidYouKnow | v2.2.0 | Brand-teal callout box — 🌍 |
| `article/Impact.tsx` | Impact | v2.2.0 | Orange callout box — ⚡ |
| `article/Callout.tsx` | Callout | v2.5.0 | Generic icon+title+body card — used in static MDX pages |

## Component inventory — Observatory (`src/components/observatory/`)

| Path | Component | Since | Notes |
|------|-----------|-------|-------|
| `observatory/ObservatoryFAB.tsx` | ObservatoryFAB | v3.0.0 | Fixed mobile FAB bottom-right, `lg:hidden`, links to `/observatory` |
| `observatory/MetricCard.tsx` | MetricCard | v3.0.0 | Sparkline, delta, StatusBadge, agency — client, dynamically imported |
| `observatory/MetricChart.tsx` | MetricChart | v3.0.0 | Full Recharts chart with Area, ReferenceLine, Brush — `ssr: false` |
| `observatory/YearScrubber.tsx` | YearScrubber | v3.0.0 | Range input, `accent-emerald-500`, controls baseline year |
| `observatory/LifetimeWidget.tsx` | LifetimeWidget | v3.0.0 | Birth year → personalised metric deltas, client-only, no data stored |
| `observatory/StatusBadge.tsx` | StatusBadge | v3.0.0 | Safe/Caution/Critical pill from `getThresholdStatus()` |
| `observatory/DataProvenancePanel.tsx` | DataProvenancePanel | v3.0.0 | Source agency, dataset, last fetched, methodology link |

## Library inventory (`src/lib/`)

| File | Since | Purpose |
|------|-------|---------|
| `content.ts` | v1.0.0 | MDX loader for pillar articles — `getAllArticles()`, `getArticle()`, `PILLAR_META` |
| `observatory.ts` | v3.0.0 | `MetricDataset` type, `METRIC_META`, `getThresholdStatus()`, `getDeltaFromYear()`, `getLatestValue()` |
| `mediaConfig.ts` | v2.3.0 | All image/video URLs — `PILLAR_IMAGES`, `HERO_MEDIA_POOL`, `ARTICLE_MEDIA_TAGS`, `resolveCoverImage()`, `NATURE_VIDEO_SRC` |
| `pages.ts` | v2.5.0 | MDX loader for `content/pages/` — `getStaticPage()`, `getAllPageSlugs()`, `PAGE_CONFIG` |

---

## Planned features — v3 (future)

- User accounts (Clerk or NextAuth — free tiers)
- Comments (Giscus — GitHub Discussions backed)
- Live data dashboards (public environmental APIs)
- Multilingual support (Next.js i18n routing)
- Community article submissions with editorial review workflow
- Personal carbon footprint calculator widget

---

## Observatory — three-layer data architecture

The Observatory uses three layers. Each has a defined max staleness and powers specific UI components. **Do not collapse these into a single build-time approach** — the Route Handler (Layer 2) is essential for current value accuracy. MetricCard current value and StatusBadge must use Layer 2, not Layer 1.

```
Layer 1  build-time static     /public/data/*.json via CDN
         max staleness: 31 days (refreshed monthly by Layer 3)
         powers: trend charts, sparklines, YearScrubber, LifetimeWidget

Layer 2  Route Handler          /api/observatory/[metric]/route.ts
         on-demand, edge-cached 24h (s-maxage=86400, stale-while-revalidate=3600)
         falls back to Layer 1 with { fallback: true } on upstream failure
         powers: MetricCard "current value" badge, StatusBadge

Layer 3  GitHub Action cron     .github/workflows/refresh-data.yml
         runs 1st of each month 02:00 UTC, re-runs fetch-data.ts, commits JSON
         triggers Vercel rebuild — keeps Layer 1 historical series current
```

### Staleness per UI component

| UI component | Data source | Max staleness |
|---|---|---|
| Trend chart (full history) | Layer 1 static JSON | 31 days |
| Sparkline on MetricCard | Layer 1 static JSON | 31 days |
| YearScrubber / LifetimeWidget | Layer 1 static JSON | 31 days |
| Current value badge | Layer 2 Route Handler | 24 hours |
| StatusBadge (Safe/Caution/Critical) | Layer 2 Route Handler | 24 hours |
| DataProvenancePanel "last updated" | Layer 2 + Layer 1 `lastFetched` | 24 hours |

### Layer 2 Route Handler response shape

```ts
// GET /api/observatory/[metric]
{ year: number; value: number; unit: string; agency: string; fallback?: true; }
// fallback: true only when served from static JSON (upstream unavailable)
```

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

## Observatory — MetricDataset schema (`public/data/*.json`)

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
    lastFetched: string;   // ISO timestamp of last successful fetch
  };
  thresholds: { safe: number; caution: number; critical: number; };
  series: Array<{ year: number; value: number | null; }>;
}
```

---

## Observatory — METRIC_META (in `src/lib/observatory.ts`)

```ts
export const METRIC_META = {
  temperature:   { label: 'Temperature Anomaly', unit: '°C',      icon: '🌡️', agency: 'NASA GISS',           thresholds: { safe: 1.0,    caution: 1.5,    critical: 2.0    }, higherIsBetter: false },
  co2:           { label: 'Atmospheric CO₂',     unit: 'ppm',     icon: '💨', agency: 'NOAA',                thresholds: { safe: 350,    caution: 400,    critical: 450    }, higherIsBetter: false },
  'sea-level':   { label: 'Sea Level Rise',       unit: 'mm',      icon: '🌊', agency: 'NASA JPL',            thresholds: { safe: 50,     caution: 100,    critical: 150    }, higherIsBetter: false },
  'sea-ice':     { label: 'Arctic Sea Ice',       unit: 'M km²',   icon: '🧊', agency: 'NSIDC',              thresholds: { safe: 6.0,    caution: 4.5,    critical: 3.5    }, higherIsBetter: true  },
  deforestation: { label: 'Deforestation Rate',   unit: 'Mha/yr',  icon: '🌳', agency: 'Global Forest Watch', thresholds: { safe: 8,      caution: 12,     critical: 15     }, higherIsBetter: false },
  glaciers:      { label: 'Glacier Mass Balance', unit: 'mm w.e.', icon: '⛰️', agency: 'WGMS',               thresholds: { safe: -10000, caution: -20000, critical: -28000 }, higherIsBetter: true  },
};
```

---

## Observatory — component conventions

- **All chart components** must be `'use client'` and dynamically imported (`next/dynamic`, `ssr: false`) — Recharts does not support SSR
- **`ObservatoryFAB`**: `fixed bottom-6 right-6 z-50 lg:hidden` — mobile only, links to `/observatory`
- **`MetricCard`**: client — sparkline via `<LineChart>`, no axes, thin line; delta from `baselineYear` prop; emerald/amber/red line colour based on status
- **`MetricChart`**: dynamically imported; `<ComposedChart>` with `<Area>`, `<ReferenceLine>` per threshold, `<Brush>` for zoom
- **`YearScrubber`**: `<input type="range">` with `accent-emerald-500`; state lives in parent Dashboard, passed down
- **`LifetimeWidget`**: client-side only — birth year input, uses `getDeltaFromYear()`, never persists or transmits data
- **`StatusBadge`**: derives status via `getThresholdStatus()` from `observatory.ts`
- **Observatory pages**: use `bg-slate-950` dark layout independently of site theme toggle

---

## Observatory — Navbar integration

**Desktop:** teal pill between nav links and ThemeToggle:
```tsx
<Link href="/observatory" className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-400/10 border border-brand-400/30 text-brand-400 hover:bg-brand-400/20 transition-colors">
  🛰️ Observatory
</Link>
```

**Mobile:** `<ObservatoryFAB />` rendered in `layout.tsx` inside `<ThemeProvider>`, after `<Footer />`.

---

## Authoring documentation (`doc/`)

The `doc/` folder contains practical guides for **content authors** — people who write MDX files but are not necessarily developers. These docs are the single source of truth for content authoring conventions.

| File | Audience | Covers |
|------|----------|--------|
| [`doc/README.md`](./doc/README.md) | All authors | Index, folder map, one-minute publish workflow |
| [`doc/authoring-articles.md`](./doc/authoring-articles.md) | Article writers | Frontmatter reference, content structure, sources, word count, publish workflow |
| [`doc/authoring-components.md`](./doc/authoring-components.md) | All authors | `<Tip>`, `<DidYouKnow>`, `<Impact>`, `<Callout>`, `<NewsletterForm>` — usage + live examples |
| [`doc/authoring-media.md`](./doc/authoring-media.md) | All authors | Finding Unsplash photos, URL format, local images, attribution |
| [`doc/authoring-static-pages.md`](./doc/authoring-static-pages.md) | Site editors | Editing About, Contribute, Newsletter, Privacy pages |

**For developers:** these docs describe the authored interface of components. When adding a new MDX component, update `doc/authoring-components.md` with its usage and examples before closing the feature. When changing frontmatter fields, update `doc/authoring-articles.md` or `doc/authoring-static-pages.md` accordingly.

---

## Key conventions

- All new pages go in `src/app/` following App Router conventions
- All new components go in `src/components/` — group by function (`layout/`, `article/`, `ui/`)
- Use `getAllArticles()` and `getArticle()` from `src/lib/content.ts` — do not read MDX files directly in pages
- Use `generateStaticParams()` on all dynamic routes
- Use Tailwind utility classes — avoid inline styles
- All pages must export `generateMetadata()` for SEO
- TypeScript strict mode is on — no `any` types
- Dark mode must work on every new component — test with both `dark` and light class on `<html>`

---

## NFR compliance — mandatory checks on every feature build

NFR compliance is not optional and is not a post-build review. Each category below must be
actively considered **while writing code**, not after. A feature is not complete until every
applicable item in the closing gate at the bottom of this section is checked.

The rules below are grounded in real bugs found and fixed in this project. Each one maps to
a specific past failure — they are not theoretical.

---

### Design system

**Colour palette — use tokens, never raw hex or non-token Tailwind shades**
- All colours must come from the EarthPulse design token set defined in `globals.css` `@theme` block. Do not use arbitrary hex values or one-off Tailwind shades that aren't part of the palette.
- Approved brand palette: `brand-50` through `brand-900` (teal-green, `#1D9E75` base).
- Status colours (Observatory and callouts): `emerald-*` (safe), `amber-*` (caution), `red-*` (critical).
- Surface colours for cards and backgrounds: `gray-50 / gray-100 / gray-200` (light mode), `gray-800 / gray-900 / gray-950` (dark mode).
- `slate-*` shades are NOT part of the EarthPulse palette. If you reach for `slate-900`, `slate-950`, or any `slate-*` colour, stop — you are about to hardcode a dark-only surface.

**Typography**
- All text inherits the Inter font via `--font-inter` CSS variable set on `<html>`. Never set `font-family` inline.
- Body text: `text-gray-900 dark:text-gray-100` (via `body` rule in `globals.css`).
- Heading hierarchy: `text-gray-900 dark:text-white` for `<h1>`–`<h3>`; `text-gray-600 dark:text-gray-300` for descriptive sub-headings.
- Secondary/metadata text: `text-gray-500 dark:text-gray-400` or `text-gray-400 dark:text-gray-500`.

**Shared CSS classes — use these before writing bespoke styles**

| Class | When to use |
|---|---|
| `.card` | Any white bordered card — includes dark mode automatically |
| `.btn-primary` | Filled teal CTA button |
| `.btn-outline` | Outlined teal secondary button |
| `.tag` | Small pill label for content tags |
| `.nav-link` | Navigation anchor with hover colour |
| `.section-title` | `text-2xl md:text-3xl font-bold tracking-tight` heading |
| `.prose-custom` | MDX article body — applies `prose prose-gray` with dark mode |

**Component reuse**
- Before creating a new component, search `src/components/` for something that already solves the problem. Prefer extending an existing component over creating a parallel one.
- New UI primitives belong in `src/components/ui/`. New article-specific components go in `src/components/article/`. Page-specific interactive sections go in the page's own directory.

**Recharts / SVG inline colours**
- Recharts chart props (`stroke`, `fill`, `tick.fill`, etc.) are inline values — CSS utility classes do not apply to SVG elements.
- ALWAYS use `useTheme()` from `next-themes` to detect `resolvedTheme` and conditionally set chart colours.
- Initialise the detected theme to `false` / light-mode values in `useState` to avoid hydration mismatch. Update in `useEffect`.
- See `MetricChart.tsx` for the canonical pattern.

---

### Theme integrity — light and dark mode must both work from the first commit

This section exists because the Observatory feature shipped with hardcoded dark-only colours, then required a full redesign when the bug was discovered. **That sequence must never repeat.**

**The cardinal rule — light-mode first, dark variant always paired**

Every new component must be authored for light mode first. Dark mode is added as `dark:` variant classes alongside the light value. There is no such thing as a "dark-mode-only component" on EarthPulse — every component must look correct in both themes.

```tsx
// ❌ Wrong — hardcoded dark only; breaks in light mode
<div className="bg-slate-900 text-white border border-slate-700">

// ✅ Correct — explicit light value, dark: counterpart for every token
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
```

**Banned patterns — these caused the Observatory regression**

| Pattern | Why it is banned | Correct alternative |
|---|---|---|
| `bg-slate-950` without `dark:` | Only visible in dark mode | `bg-white dark:bg-gray-950` |
| `text-white` without light-mode value | Invisible on white background | `text-gray-900 dark:text-white` |
| `bg-slate-900` without `dark:` | Hardcoded dark surface | `bg-gray-50 dark:bg-gray-900` |
| `text-slate-400` without `dark:` | Pale text invisible in light mode | `text-gray-500 dark:text-gray-400` |
| `class="dark"` on a wrapper div to force dark | Breaks theme toggle; makes component an island | Use `dark:` variants instead |
| Hiding Navbar/Footer via `usePathname` in layout | Disconnects feature from site shell | Feature integrates with standard layout |

**Forcing dark mode on a subtree is never the right fix**

If a component only looks correct in dark mode, the fix is to add light-mode styles — not to wrap the component in `<div className="dark">`. Forcing dark mode on a subtree:
1. Breaks the user's theme preference
2. Makes the feature look disconnected from the rest of the site
3. Causes the Navbar and Footer to appear in the wrong theme
4. Is always a symptom of missing light-mode styles, not a solution

**New feature pages must integrate with the site shell**

Every new page must include the standard EarthPulse Navbar and Footer. These are rendered by `src/app/layout.tsx` — they are present on all pages automatically. Do not modify `layout.tsx`, `Navbar.tsx`, or `Footer.tsx` to hide or alter the site shell for a specific feature page. If a page needs a special header, place it INSIDE the page's `<main>` content area, not as a replacement for the global Navbar.

Exception: a full-screen overlay (e.g., a modal) that temporarily covers the shell is acceptable, but the shell must remain in the DOM and return when the overlay closes.

**Theme toggle must work end-to-end on every new page**

The `ThemeToggle` in the Navbar controls `next-themes`, which adds/removes the `dark` class from `<html>`. Our `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` activates all `dark:` Tailwind variants for any descendant of `.dark`. This means:

- If your component uses only `dark:` prefixed Tailwind utilities, the theme toggle will work automatically ✅
- If your component uses hardcoded dark colours (`slate-900`, `gray-950`, etc.) without a light-mode counterpart, the theme toggle will have no effect on those elements ❌

---

### Site integration — new pages and features

**Standard layout (Navbar + Footer) is mandatory**
- All pages must render with the site Navbar at the top and the site Footer at the bottom. These are provided automatically by `src/app/layout.tsx`.
- Do not suppress, hide, override, or path-detect to conditionally render the Navbar or Footer.
- If a feature page needs its own navigation element (e.g., Observatory's "← Back" breadcrumb), add it as additional content INSIDE the page, not as a replacement for the global Navbar.

**Page-level background**
- New pages inherit `bg-white dark:bg-gray-950` from the body (defined in `globals.css`). Do not override the page root background unless the page has a deliberate hero section with its own background (e.g., a gradient hero banner).
- Exception: a hero section within the page may use `bg-gradient-to-b from-gray-50 dark:from-gray-900` or similar to create visual hierarchy — but only for the hero area, not the whole page.

**Existing `.card` utility for cards and panels**
- Use the `.card` CSS class for standard information panels. It provides `bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800` automatically with hover states.
- Custom panel styles (Observatory chart container, DataProvenancePanel) should follow the same `bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700` pattern.

**The theme toggle must visually affect every element on a new page**
- After building a feature, toggle the theme (click the Navbar moon/sun icon). Every text block, card, background, chart, input, and border on the page must change correctly.
- If any element does not change: it is using a hardcoded colour. Fix by adding the `dark:` variant.

---

---

### Performance

**Images — CORS does not apply to the browser**
- Every `<Image fill>` **must** have `sizes="100vw"` (or a more specific value for constrained containers). Without it Next.js cannot generate a correct responsive srcset and may serve an oversized image to mobile viewports.
- `priority` must only be set on images that are the Largest Contentful Paint (LCP) candidate — typically the first visible image above the fold on a given page. Every other image must not have `priority` (or must explicitly pass `priority={false}`).
- Never use a raw `<img>` for external URLs. Always use `next/image`, which proxies through `/_next/image` server-side. The browser only ever requests our own domain — it never makes a cross-origin request to the image CDN. Raw `<img>` bypasses this proxy and does send a `Referer` header directly to the CDN, which can cause hotlink blocks (root cause of the Pexels image failures in v2.2.0 — resolved by switching to `next/image`).
- Because `next/image` proxies server-side, the CORS/hotlink policy of the image CDN is irrelevant to the browser. Any CDN reachable by the server works. We use Unsplash because hotlinking is explicitly permitted and images are high quality.
- All external image hostnames must be listed in `next.config.ts` `images.remotePatterns` **before** being used in `<Image>`. Only image CDNs go here — video CDN hostnames are never valid `remotePatterns` entries (next/image cannot process MP4).
- Unsplash source URLs should include `?auto=format&fit=crop&w=1920&q=80` to cap the source resolution fetched by the Next.js server. Without `w=`, the original file (up to 6000 px+) is downloaded on every image optimisation request.

**Videos — CORS DOES apply; CDN must be explicitly CORS-enabled**
- `<video>` elements fetch directly from the browser to the video CDN. `next/image` cannot proxy video files (streaming semantics, file size). The browser attaches `Origin` and `Referer` headers; if the CDN returns restrictive CORS headers the browser silently blocks playback — no error, just a blank media element.
- Every video URL must be served by a CDN that returns `Access-Control-Allow-Origin: *`. Approved sources: Google Cloud Storage public buckets, Cloudinary (free tier), Bunny.net, self-hosted. **Pexels video CDN (`videos.pexels.com`) is not approved** — it blocks cross-origin `<video>` requests. This was the root cause of the original hero video failure and is why we now use `storage.googleapis.com`.
- Autoplay background videos must be `muted`, `loop`, and `playsInline` — all three, always.
- Never use a UHD source as the sole video option. Document resolution in `mediaConfig.ts` and note bandwidth cost. If a lower-quality source is available, add it as a second `<source>`.
- Always implement a fallback image for the case where the video fails to load (`onError` → state change → show image layer). This is required because even CORS-enabled CDNs can experience outages.
- Mount the fallback image **only when needed** (video failed or reduced-motion active). Do not render an image element with `priority` while the video is already playing — it wastes a forced high-priority fetch.

**Client components**
- Every `'use client'` component must be justified. Ask: can this be a server component? If state is only needed for a minor UI affordance, consider lifting state or using a lighter pattern.
- Do not leave unused `useRef`, `useState`, or `useEffect` calls. Vestigial hooks add noise and can cause subtle bugs on re-renders.

---

### Security

**External resources**
- `remotePatterns` in `next.config.ts` is the security boundary for `next/image`. Review its entries before every release. Only image CDNs belong here. Remove entries that are no longer used.
- When adding a new external image source, add a comment explaining why that domain is trusted and what it is used for. Do not add domains silently.
- Never pass user-controlled or frontmatter-derived values directly to an image `src` without understanding that `next/image` will attempt to fetch from that URL server-side. The `remotePatterns` allowlist protects against SSRF from unknown domains — rely on it.
- **Never add a video CDN hostname to `remotePatterns`.** `next/image` cannot process video files. Adding `videos.pexels.com` or any other video CDN to `remotePatterns` is non-functional and misleading. Video URLs are used directly in `<video>` elements and must satisfy the separate CORS-enabled CDN requirement (see Performance → Videos above).
- Do not use `dangerouslySetInnerHTML` anywhere. If MDX content requires custom HTML, use registered MDX components (see Tip, DidYouKnow, Impact pattern).

**Sensitive data**
- No `.env` values may be embedded in client components or exported from `'use client'` files. Environment variables prefixed `NEXT_PUBLIC_` are intentionally public; all others must stay server-side.
- The `content/` directory is the trust boundary for MDX authors. Frontmatter fields are parsed as data — they are not evaluated. Do not use `eval()` or `Function()` on any frontmatter value.

---

### Accessibility (WCAG 2.1 AA target)

**Images**
- Meaningful images (convey information not present in surrounding text) → `alt` must describe what is in the image, not its context or filename.
- Decorative images (background, mood, purely visual) → `alt=""` AND the container must carry `aria-hidden="true"`. This prevents screen readers from announcing the image at all. Do not use a descriptive `alt` on an `aria-hidden` container — it is contradictory and confusing to AT users.
- Never use `alt={title}` or `alt={slug}` for cover images. Article titles are not image descriptions.

**Motion and animation**
- Every CSS animation and every autoplay video must be suppressed when `prefers-reduced-motion: reduce` is active.
- For video elements: apply the CSS class `motion-reduce:hidden` on the element itself (handles pre-JS paint), AND check `window.matchMedia('(prefers-reduced-motion: reduce)')` in a `useEffect` to unmount the element after JS loads (frees resources). Both layers are required.
- For CSS animations (e.g., `animate-pulse`, custom keyframes): wrap them with `motion-safe:` Tailwind variant or a `@media (prefers-reduced-motion: no-preference)` block.

**Interactive elements**
- Every `<button>` that contains only an icon (no visible text) must have `aria-label` and `title` that describe the action, not the icon. Both must update dynamically if the state changes (e.g., ThemeToggle: `aria-label` switches between "Switch to dark mode" and "Switch to light mode").
- Every interactive element must have a visible focus style. Do not use `outline-none` without replacing it with an equally visible custom focus ring.
- `<Link>` components that are `<a>` tags must have descriptive text. "Click here" and "Read more" are not acceptable — use "Read more about {title}" or make the card itself the link target.

**Colour contrast**
- Text on coloured backgrounds (brand buttons, pillar badges, callout boxes) must meet 4.5:1 contrast ratio (AA). Use a contrast checker before finalising a new colour combination.
- Brand teal (`#1D9E75`) on white passes AA for large text (3:1) but fails for normal body text (2.8:1). Never use `text-brand-400` on a white background for body-sized text — use `text-brand-600` instead.

**Semantic structure**
- Page headings must follow a logical hierarchy: one `<h1>` per page, `<h2>` for major sections, `<h3>` for sub-sections. Do not skip levels.
- Use semantic HTML elements: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<aside>`. Only use `<div>` and `<span>` for layout and styling with no semantic meaning.
- Form inputs (newsletter, search when built) must have associated `<label>` elements — not just placeholder text.

**Hydration safety**
- Client components that read browser APIs (`window`, `document`, `matchMedia`, `localStorage`) must guard against SSR. Pattern: initialise state to a safe SSR value (`false`, `null`, `''`), read the real value in `useEffect`, and accept the one-render-cycle lag. Do not call browser APIs during render.
- If a client component renders differently on server vs. client (e.g., date formatting, theme state), add `suppressHydrationWarning` to the specific element — not to the whole tree.

---

### NFR compliance gate — run before closing any feature build

This checklist must be satisfied before a feature is marked complete. It is the equivalent of
the versioning checklist — both are required.

**Design system**
- [ ] No raw hex values or `slate-*` colours used — all colours from the approved palette (`brand-*`, `gray-*`, `emerald-*`, `amber-*`, `red-*`)
- [ ] No inline `font-family` or `font-size` styles — typography inherits from `--font-inter` and Tailwind utilities
- [ ] Existing shared classes used where applicable (`.card`, `.btn-primary`, `.btn-outline`, `.tag`, `.nav-link`, `.section-title`)
- [ ] No duplicate component created when an existing one could be extended
- [ ] Recharts/SVG charts use `useTheme()` for inline colour props — no hardcoded chart colours

**Theme integrity — the most critical gate**
- [ ] Every new component has been opened in **light mode** — all text readable, all backgrounds correct, no invisible elements
- [ ] Every new component has been opened in **dark mode** — all text readable, all backgrounds correct, no invisible elements
- [ ] The Navbar theme toggle visually changes every element on every new page in both directions
- [ ] Zero `slate-*` or `gray-9*` hardcoded values without a paired light-mode class
- [ ] Zero `text-white` or `text-gray-100` without a paired `dark:` class to make it theme-conditional
- [ ] No `<div className="dark">` or `<div className="dark contents">` wrappers used to force dark mode — `dark:` variants used instead
- [ ] No `usePathname` check in `Navbar.tsx` or `Footer.tsx` to conditionally hide/restyle them

**Site integration**
- [ ] New pages render with the standard EarthPulse Navbar and Footer — not replaced, not hidden
- [ ] New pages have no `min-h-screen` with a hardcoded background on the outer `<div>` — page inherits body background
- [ ] No modifications to `src/app/layout.tsx` that conditionally exclude the Navbar or Footer
- [ ] The page is navigable from within the site (Navbar links or explicit cross-links)
- [ ] `generateMetadata()` is exported from every new page

**Performance**
- [ ] Every `<Image fill>` has `sizes` prop set
- [ ] `priority` is only on above-the-fold LCP images; all others omit it or pass `priority={false}`
- [ ] No raw `<img>` tags for external URLs — all go through `next/image`
- [ ] New external image domains added to `next.config.ts` `remotePatterns` with a comment
- [ ] No unused `useRef`, `useState`, or `useEffect` remain in any touched file
- [ ] `npm run build` passes with zero errors and zero warnings

**Security**
- [ ] `remotePatterns` contains only image CDNs — no video CDN hostnames
- [ ] No new `dangerouslySetInnerHTML` introduced
- [ ] No `NEXT_PUBLIC_` leak of values that should be server-only
- [ ] Any new external domain in `remotePatterns` has a comment explaining why it is trusted

**Accessibility**
- [ ] Decorative images: `alt=""` AND container has `aria-hidden="true"`
- [ ] Meaningful images: `alt` describes image content (not filename, title, or context label)
- [ ] Icon-only buttons have `aria-label` and `title`; both update dynamically if state-dependent
- [ ] Any animation or autoplay video respects `prefers-reduced-motion` at both CSS and JS layers
- [ ] Page heading hierarchy is logical (one `<h1>`, sequential `<h2>`/`<h3>`)
- [ ] New client components do not call browser APIs during render (SSR-safe)
- [ ] `npm run lint` passes with zero errors

---

### Post-build site functional integrity check

Run this after every feature build to verify the whole site — not just the new feature — is intact.

```bash
npm run build
# Must exit 0. All pages generated. No TypeScript errors.
```

Then open the dev server and verify:

| Check | How to verify |
|---|---|
| Homepage loads | `/` — hero video/image, stats bar, pillar grid, featured articles visible |
| Pillar pages load | `/our-planet` — PageHero, article grid, dark Navbar present |
| Article pages load | `/our-planet/oceans` — PageHero, breadcrumb, article body, tags, callouts |
| Tag pages load | `/tag/oceans` — article list visible |
| Static pages load | `/about`, `/contribute`, `/newsletter`, `/privacy` — Navbar, Footer, content visible |
| Observatory loads | `/observatory` — metric cards visible, YearScrubber functional |
| Observatory deep-dive | `/observatory/co2` — chart, provenance, related articles visible |
| **Light mode** | Toggle to light → every page correct, no invisible text, no dark-only panels |
| **Dark mode** | Toggle to dark → every page correct, no white panels on dark background |
| Theme toggle | Click Navbar sun/moon → page immediately responds, no elements stay frozen |
| Navbar present | All pages have EarthPulse Navbar with logo, links, Observatory pill, ThemeToggle |
| Footer present | All pages have EarthPulse Footer with Explore/Topics/About columns |
| Mobile responsive | Hamburger menu works on small viewport; Observatory FAB visible bottom-right |
| No console errors | Browser console shows zero errors and zero hydration warnings |

---

## Versioning rules — follow these on every Epic or Feature build

### Scheme: `MAJOR.MINOR.PATCH`

| Digit | When to increment | Examples |
|-------|-------------------|---------|
| **MAJOR** (`x.0.0`) | Architectural break — new runtime, new framework, new data model incompatible with previous | v2 → v3: user accounts, i18n routing |
| **MINOR** (`x.y.0`) | Any new user-visible feature, Epic, or batch of related features | New page, new component, new MDX capability |
| **PATCH** (`x.y.z`) | Bug fix, copy correction, style tweak, dependency bump with no behaviour change | Dark mode variant fix (v2.1.0), typo repair |

---

### When starting a new Epic or Feature build

1. **Decide the version bump before writing any code.**
   - New Epic (multiple features) → bump MINOR: e.g. current `v2.2.0` → `v2.3.0`
   - Single small feature → bump MINOR
   - Bug fix only → bump PATCH

2. **Update `CLAUDE.md` header first.**
   ```
   **Current version:** v2.3.0 (Mon YYYY)
   ```

3. **Add a row to the Release history table** (status `🔲 In progress` while building, `✅` on completion).
   ```
   | v2.3.0 | Mon YYYY | Feature | Short description of what ships |  🔲 |
   ```

4. **Tag every new component in the Component inventory** with the new version in the `Since` column.

5. **Update `functional_spec.md`** in the same commit:
   - Bump `**Current version:**` in the header
   - Bump `**Last updated:**`
   - Add the new version row to the Version history table
   - Add a new section `6.x Feature name — vX.Y.Z (released Mon YYYY)` with Behaviour, Accessibility, and Technical approach sub-sections
   - Update the v2 summary table — mark the new feature ✅ Released and set its version

6. **Update `launch_guide.md`** if any new install step, npm package, or file is introduced:
   - Bump `**Current version:**` and `**Last updated:**`
   - Add new files to the file tree with `← (vX.Y.Z)` annotation
   - Add new packages to the Step 1 scaffold block
   - Add the feature to the "Features active in this release" table

---

### Commit message convention

```
feat(v2.3.0): reading progress bar on article pages
fix(v2.1.0): tailwind v4 dark mode variant correction
docs(v2.2.0): update functional spec and launch guide for hero banner
```

Pattern: `type(vX.Y.Z): short description`

---

### Version drift is a bug

If `CLAUDE.md`, `functional_spec.md`, and `launch_guide.md` show different version numbers after a feature build, that is a documentation bug. All three must agree on the current version before the work is considered done.

The checklist before closing any feature build:

- [ ] `CLAUDE.md` — `**Current version:**` updated, release history row added, component inventory updated
- [ ] `functional_spec.md` — `**Current version:**` updated, `**Last updated:**` updated, version history row added, summary table row updated, new detail section added
- [ ] `launch_guide.md` — `**Current version:**` updated, file tree reflects new files, features table updated
- [ ] All three files show the **same** version string

---

## How this project was designed

Full design decisions, content structure rationale, domain choices, and phase planning were documented in a Claude.ai conversation. The key decisions:

- **MDX + GitHub** chosen over a hosted CMS (Contentful/Sanity) for zero cost and full version control
- **Next.js SSG** chosen over SSR for performance and free Vercel hosting
- **Pagefind** chosen over Algolia for static, zero-cost search
- **Brevo** chosen for newsletter — 300 emails/day free, GDPR-ready
- **earthpulse.org** is the target domain (~$10/year on Porkbun)
- **.org TLD** chosen for credibility with educational/environmental audience

---

## How to add a new article

```bash
# Create the file
touch content/voices/my-new-article.mdx

# Write frontmatter + content, then:
git add content/voices/my-new-article.mdx
git commit -m "Add article: my new article title"
git push
# Vercel auto-rebuilds — live in ~90 seconds
```

---

## Commands

```bash
npm run dev          # local dev server at http://localhost:3000
npm run fetch-data   # manually refresh Observatory JSON datasets (also runs via prebuild)
npm run build        # production build — runs fetch-data first via prebuild
npm run lint         # ESLint
```
