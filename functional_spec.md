# EarthPulse — Functional Specification

**Current version:** 3.0.0  
**Status:** Active  
**Last updated:** June 2026

---

## Version history

| Version | Date | Category | Summary |
|---------|------|----------|---------|
| v1.0.0 | Jun 2024 | Launch | Initial site — core pages, content library, 6 seed articles, Navbar, Footer, ArticleCard |
| v2.0.0 | Jun 2025 | Feature | Dark mode toggle — `next-themes`, `ThemeProvider`, `ThemeToggle` in Navbar (desktop + mobile) |
| v2.1.0 | Jun 2025 | Bugfix | Tailwind v4 dark mode fix — `@custom-variant dark` in `globals.css` to wire `dark:` utilities to class strategy |
| v2.2.0 | Jun 2026 | Feature | Hero banner (video/image) · pillar contextual banner images · article cover image · MDX callout components |
| v2.3.0 | Jun 2026 | Fix | Media reliability — Unsplash CDN for all images, 3-layer fallback chain, centralised `mediaConfig.ts`, `HeroMedia` + `BannerImage` components |
| v2.3.1 | Jun 2026 | Content | `coverImage` frontmatter added to all 6 seed articles; content/structural media boundary documented |
| v2.3.2 | Jun 2026 | Fix | Article cover auto-fallback — pillar image used when `coverImage` is absent; every article always has a visual header |
| v2.4.0 | Jun 2026 | Feature | UX elevation — session-rotating hero pool, PageHero full-bleed hybrid component, tag-based dynamic cover resolution |
| v2.5.0 | Jun 2026 | Feature | Static pages converted to MDX — About, Contribute, Newsletter, Privacy in `content/pages/`; new `pages.ts` loader; `Callout` + `NewsletterForm` components |
| v3.0.0 | Jun 2026 | Feature | Observatory — planetary data dashboard; 6 live metrics; build-time data fetch from NASA/NOAA/NSIDC/GFW/WGMS; Recharts interactive charts; YearScrubber, LifetimeWidget, deep-dive pages |

---

## 1. Purpose and scope

EarthPulse is a public-facing informational website focused on environmental education, ecosystem science, human impact, and sustainability. This document defines what the website does — its functional behaviour, content model, user journeys, and feature set for the initial launch (v1.0.0) and subsequent releases.

---

## 2. Audiences

| Segment | Primary goals | Key needs |
|---------|--------------|-----------|
| General public | Learn, stay informed | Accessible language, visual storytelling, clear navigation |
| Students & educators | Research, cite, teach | Sourced content, topic depth, shareable articles |
| Researchers & policy professionals | Reference, discover initiatives | Accuracy, links to primary sources, topic indexing |
| Activists & NGOs | Advocate, amplify, act | Action-oriented content, shareable resources, newsletter |

---

## 3. Content pillars

The website is organised into six content pillars. Each pillar has a dedicated index page and hosts any number of articles.

### 3.1 Our Planet
Foundational science of Earth's living systems — ecosystems, biomes, biodiversity, and the natural processes that sustain life. Sub-topics include forests, oceans, freshwater systems, atmosphere, soil, and species diversity.

### 3.2 Through Time
The history and evolution of Earth and life — from the formation of the planet through geological epochs, mass extinctions, and the rise of human civilisation. Presented as narrative, with visual timeline support planned for phase 2.

### 3.3 Human Footprint
The measurable impact of human activity on the planet — covering agriculture, energy, transport, urbanisation, and consumption. Includes case studies, data-driven explainers, and sector-by-sector analysis.

### 3.4 In Action
Profiles of government policy, corporate commitments, NGO programmes, and community-level initiatives working to address environmental challenges. Filterable by region, theme, and actor type (phase 2).

### 3.5 Voices & Research
The editorial hub — long-form articles, opinion pieces, research summaries, and expert interviews. This is the primary destination for repeat visitors and newsletter subscribers.

### 3.6 Take Action
Practical guidance for individuals, students, and organisations. Includes ranked action guides, links to vetted external organisations, and downloadable resources.

---

## 4. User journeys

### 4.1 Discovery via search engine
1. User searches for a topic (e.g. "coral bleaching explained")
2. An EarthPulse article appears in results
3. User lands on article page
4. They read the article, follow related tags to more content
5. They subscribe to the newsletter before leaving

### 4.2 Browse by topic
1. User arrives at homepage
2. Selects a pillar from the nav or homepage grid
3. Browses article cards, filters by tag (phase 2)
4. Reads one or more articles
5. Returns to pillar index or follows related article links

### 4.3 Returning subscriber
1. User clicks a link from the weekly email digest
2. Lands directly on the featured article
3. Reads article, explores related content via tags
4. May share via social share buttons

### 4.4 Educator preparing lesson material
1. Searches within site or arrives via external search
2. Reads an article, checks cited sources
3. Downloads or bookmarks content
4. May contribute a correction or suggest a topic via the contribute form

---

## 5. Feature specification — v1.0.0 (released Jun 2024)

### 5.1 Navigation
- Persistent top navigation bar with links to all six pillars
- EarthPulse logo/wordmark links to homepage
- Subscribe CTA button in nav (desktop)
- Hamburger menu on mobile, expanding to full pillar list
- No mega-menu in v1 (planned for v2)

### 5.2 Homepage
- Hero section with headline, subtitle, and two CTAs (Explore / Subscribe)
- Statistics bar with four key environmental facts
- Pillar grid (six cards, each linking to a pillar index)
- Featured articles section (up to 3 articles flagged `featured: true`)
- Latest articles section (6 most recent across all pillars)
- Newsletter sign-up CTA section

### 5.3 Pillar index pages
- Pillar title, icon, and description
- Grid of all article cards for that pillar, sorted newest first
- Empty state for pillars with no articles yet

### 5.4 Article pages
- Full article rendered from MDX
- Breadcrumb navigation
- Cover image (full-width, rounded) rendered between breadcrumb and header when `coverImage` frontmatter is set — all 6 seed articles carry one as of v2.3.1
- Article metadata: author, date, reading time
- Tag pills (linked to tag pages)
- Pillar badge
- Back link to pillar index

### 5.5 Tag pages (v1 basic)
- Simple filtered list of articles sharing a tag
- Tag name as page title

### 5.6 Article cards
Displayed on homepage and pillar index pages. Each card shows:
- Pillar badge (icon + name + colour)
- Article title
- Description (2-line clamp)
- Up to 3 tags
- Author, date, reading time

### 5.7 Footer
- Logo and tagline
- Navigation columns: Explore, Topics, About
- GitHub link
- Copyright notice

### 5.8 SEO
- Unique `<title>` and `<meta description>` per page
- Open Graph tags for social sharing
- Automatic sitemap generation (`/sitemap.xml`)
- robots.txt
- Semantic HTML throughout

---

## 6. Feature specification — v2 (in progress)

| Feature | Version | Status | Description |
|---------|---------|--------|-------------|
| Dark mode toggle | v2.0.0 | ✅ Released | Manual override via toggle in Navbar; defaults to system preference; persisted in localStorage via next-themes |
| Dark mode Tailwind v4 fix | v2.1.0 | ✅ Released | `@custom-variant dark` override — wires `dark:` utilities to `.dark` class strategy |
| Homepage hero video/image banner | v2.2.0 | ✅ Released | Full-bleed autoplay video with image fallback and `prefers-reduced-motion` support |
| Pillar contextual banner images | v2.2.0 | ✅ Released | Full-width banner image per pillar index page |
| Article cover image | v2.2.0 | ✅ Released | Rendered when `coverImage` is set in MDX frontmatter |
| MDX callout components | v2.2.0 | ✅ Released | `Tip`, `DidYouKnow`, `Impact` usable in all MDX articles |
| Hero session rotation | v2.4.0 | ✅ Released | Pool of 5 hero media entries; random pick stored in sessionStorage per session |
| PageHero — full-bleed hybrid | v2.4.0 | ✅ Released | Full-bleed hero with image+video hybrid, overlay title/breadcrumb, IntersectionObserver |
| Dynamic article cover | v2.4.0 | ✅ Released | `resolveCoverImage()` resolves: frontmatter → tag map → pillar image |
| Static pages as MDX | v2.5.0 | ✅ Released | About, Contribute, Newsletter, Privacy authored in MDX under `content/pages/`; `Callout` + `NewsletterForm` components |
| About page | v2.5.0 | ✅ Released | `/about` — mission, values, editorial standards, get involved |
| Contribute page | v2.5.0 | ✅ Released | `/contribute` — what we publish, how to submit, editorial guidelines, article template |
| Newsletter page | v2.5.0 | ✅ Released | `/newsletter` — value props, topic selector, Brevo embed placeholder |
| Privacy page | v2.5.0 | ✅ Released | `/privacy` — full privacy policy in MDX prose |
| Reading progress bar | v2.6.0 | 🔲 Planned | Scroll-driven bar on long-form article pages |
| Site search | v2.7.0 | 🔲 Planned | Pagefind-powered static search with tag/pillar filtering |
| Sitemap | v2.7.0 | 🔲 Planned | `src/app/sitemap.ts` using `getAllArticles()` + `getAllPageSlugs()` |
| robots.txt | v2.7.0 | 🔲 Planned | `src/app/robots.ts` |
| Interactive timeline | v2.8.0 | 🔲 Planned | Visual, filterable timeline for Through Time section |
| Data visualisations | v2.8.0 | 🔲 Planned | Embedded charts (CO₂ trends, deforestation rates) |
| Mega-menu | v2.9.0 | 🔲 Planned | Rich pillar navigation with sub-topic links |

### 6.1 Dark mode toggle — v2.0.0 · v2.1.0 (released Jun 2025)

**Behaviour:**
- On first visit, the site respects the user's OS-level dark/light preference
- A toggle button in the Navbar allows manual override at any time
- The chosen preference is persisted in `localStorage` and survives page refresh and navigation
- On mobile, the toggle appears beside the hamburger menu so it is always accessible
- The toggle icon switches between a sun (dark mode active) and a moon (light mode active)

**Accessibility:**
- `aria-label` on the toggle button updates dynamically to reflect current state
- Readable by screen readers

**Technical approach:**
- `next-themes` package (`ThemeProvider` wrapping the app body, `attribute="class"`, `enableSystem`)
- New `ThemeProvider` client component wraps layout body
- New `ThemeToggle` client component renders the icon button using `useTheme()` hook
- Hydration-safe: toggle renders a placeholder on the server, real button after mount, preventing flicker
- `suppressHydrationWarning` on `<html>` tag handles server/client theme class mismatch
- **Tailwind v4 override required:** `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` — Tailwind v4 defaults `dark:` to a CSS media query; this line switches it to class-based detection so all `dark:` utilities respond to the `.dark` class that `next-themes` applies, not the OS preference alone

---

### 6.2 Homepage hero video/image banner — v2.2.0 (released Jun 2026)

**Behaviour:**
- The homepage hero section is a full-bleed, full-height (`min-h-[85vh]`) media background replacing the previous CSS gradient
- A looping, muted, autoplay video plays continuously; text content is overlaid on a dark gradient scrim
- Users who have enabled `prefers-reduced-motion` in their OS see a static fallback image instead; the video is CSS-hidden via `motion-reduce:hidden`
- The same fallback image URL is used as the `poster` attribute so no blank frame ever flashes
- Headline is `text-white`; subtitle is `text-gray-200`; CTAs are unchanged in structure
- Stats bar below the hero is unchanged

**Accessibility:**
- Video and fallback image both carry `aria-hidden="true"` — they are decorative
- `prefers-reduced-motion` respected at the CSS level; no JavaScript feature detection needed

**Media sources:**
- Video: Google Cloud Storage public bucket (`storage.googleapis.com/gtv-videos-bucket/sample/`) — serves `Access-Control-Allow-Origin: *`, cross-origin `<video>` playback guaranteed. Pexels video CDN was evaluated and rejected: it blocks cross-origin `<video>` requests via restrictive CORS headers.
- Images: Unsplash CDN (`images.unsplash.com`) — routed through `next/image` server proxy, so browser CORS policy is irrelevant for images.

**CORS strategy (why images and videos use different CDNs):**
- Images go through Next.js `/_next/image` proxy — the browser fetches from our server, not from Unsplash directly. CORS/hotlink policy of the image CDN does not apply to the browser.
- Videos are fetched directly by the browser's `<video>` element. `next/image` cannot proxy MP4 files. The video CDN must return `Access-Control-Allow-Origin: *` or the browser blocks playback silently. This rules out Pexels video CDN and any CDN with restrictive CORS headers.

**Technical approach:**
- Session-rotating pool of 5 entries managed by `HeroMedia` client component
- `sessionStorage` key `ep-hero-idx` keeps the selection consistent within a session
- `next.config.ts` `remotePatterns` lists `images.unsplash.com` (active) and `images.pexels.com` (reserved safety net — no current content uses Pexels images, but kept to support any author who supplies a Pexels `coverImage`). Video CDN hostnames are intentionally excluded — next/image cannot process MP4

---

### 6.3 Pillar page contextual banner images — v2.2.0 · v2.4.0 (released Jun 2026)

**Behaviour (v2.4.0):**
- Each pillar page opens with a full-bleed `PageHero` spanning `min-h-[70vh]`
- The pillar title, icon, and description are overlaid on the banner (not below it)
- Static image on load; video plays on hover/touch when a `videoSrc` is supplied
- Previous v2.2.0 behaviour (fixed-height `BannerImage` with heading below) superseded

**Image map (Unsplash — switched from Pexels in v2.3.0):**

| Pillar | Unsplash subject |
|--------|-----------------|
| Our Planet | Aerial tropical rainforest |
| Through Time | Ancient rock strata |
| Human Footprint | Industrial smokestacks at dusk |
| In Action | Wind turbines on green hills |
| Voices & Research | Open books / library |
| Take Action | Community volunteers outdoors |

All images sourced from `images.unsplash.com`. Pexels images were used in v2.2.0 but replaced in v2.3.0 after confirming that Pexels CDN can block hotlinking under certain referrer conditions; Unsplash explicitly permits web embedding.

**Technical approach:**
- `PILLAR_IMAGES` exported from `src/lib/mediaConfig.ts`
- `next/image` with `fill`, `sizes="100vw"`, `priority` (LCP element)
- All images server-proxied via `/_next/image` — browser CORS does not apply
- `videoSrc` field in each entry points to a CORS-enabled CDN (`storage.googleapis.com`)

---

### 6.4 Article page cover image — v2.2.0 · v2.3.1 · v2.3.2 (released Jun 2026)

**Behaviour:**
- Every article page shows a full-width cover image between the breadcrumb and the article header
- **Source priority (resolved at render time):**
  1. `coverImage` from the article's MDX frontmatter — author's specific choice
  2. The pillar's contextual banner image — automatic fallback when `coverImage` is absent
  3. The pillar's CSS gradient — `BannerImage` `onError` handler if the image URL fails
- Authors never need to set `coverImage` for the page to look correct; setting it gives per-article visual identity
- Supports Unsplash CDN URLs (primary), relative paths (`/images/articles/my-image.jpg`), or any absolute URL listed in `next.config.ts` `remotePatterns`
- All 6 seed articles carry article-specific `coverImage` values as of v2.3.1

**Cover images assigned (v2.3.1):**

| Article | Pillar | Image subject |
|---------|--------|--------------|
| The ocean: Earth's life-support system | Our Planet | Turquoise ocean surface |
| 4.5 billion years in brief | Through Time | Earth from space |
| How we feed the world | Human Footprint | Golden wheat field |
| 30x30: protect a third of the planet | In Action | Pristine mountain wilderness |
| What is the biodiversity crisis? | Voices & Research | Wild animal in natural habitat |
| What you can actually do | Take Action | Individual sustainable action |

**Content vs. structural media boundary:**
- Cover images are **content metadata** — they live in MDX frontmatter alongside the article text
- Structural/UI media (hero video, pillar banners) live in `src/lib/mediaConfig.ts`
- This separation means authors control cover images via Git without touching component code

**Technical approach:**
- `BannerImage` component renders the image via Next.js `/_next/image` proxy (no CORS/referrer issues)
- `priority={false}` — cover image is below the breadcrumb nav, not the page LCP element
- `showScrim={false}` — rounded card style does not need a page-blend gradient
- Falls back to the pillar's CSS gradient if the URL is unreachable

---

### 6.5 MDX callout components — v2.2.0 (released Jun 2026)

Three reusable callout boxes available in all MDX articles. Import automatically via `components` prop on `MDXRemote`.

| Component | Icon | Colour | Purpose |
|-----------|------|--------|---------|
| `<Tip>` | 💡 | Amber | Practical tip or reader action |
| `<DidYouKnow>` | 🌍 | Brand teal | Surprising fact or statistic |
| `<Impact>` | ⚡ | Orange | Scale or consequence of an issue |

**Usage in MDX:**
```mdx
<DidYouKnow>
  The ocean produces **50% of Earth's oxygen**.
</DidYouKnow>

<Impact>
  50% of the Great Barrier Reef's shallow corals died in 2016–2017.
</Impact>

<Tip>
  Support Marine Protected Areas to protect ocean biodiversity.
</Tip>
```

All three components are dark-mode aware via Tailwind `dark:` utilities.

---

---

### 6.6 Hero session rotation — v2.4.0 (released Jun 2026)

**Behaviour:**
- On each new browser session the homepage hero shows a different media entry from a pool of 5 nature scenes
- The chosen index is persisted in `sessionStorage` under `ep-hero-idx` so the same scene plays throughout the session but changes on the next visit or new tab
- All entries share the same 3-layer fallback chain (video → Unsplash image → CSS gradient)

**Pool entries:** Forest canopy · Open ocean · Mountain landscape at dawn · Arctic wilderness · Underwater world

**Technical approach:**
- `HERO_MEDIA_POOL` array exported from `src/lib/mediaConfig.ts`
- `HeroMedia` client component reads/writes `sessionStorage` in `useEffect` (SSR-safe; server and first render both use index 0, seamless swap after hydration)

---

### 6.7 PageHero — full-bleed hybrid hero — v2.4.0 (released Jun 2026)

**Behaviour:**
- Replaces the previous `BannerImage` + detached heading pattern on pillar and article pages
- Full-bleed section spanning `min-h-[70–80vh]` — the page "opens" with the visual before content begins
- **Static image on load** — image always renders immediately; no layout shift
- **Lazy video on interaction** — the video element is NOT mounted until the user first hovers (desktop) or touches (mobile); saves bandwidth for users who never interact
- When interaction starts: image cross-fades out (700 ms), video begins playing beneath
- When interaction ends: video pauses, image cross-fades back in
- **IntersectionObserver** — when the hero is >85% scrolled out of viewport the video pauses and image resumes automatically; interaction is required to restart
- **prefers-reduced-motion** — video never mounts; image-only mode throughout
- Video hint text (`▶ Hover or touch to play`) shown only when a `videoSrc` is provided and motion is allowed; `aria-hidden` (decorative)

**Overlay layout:**
- Breadcrumb: top-left, white text at 70% opacity, no background
- Pillar badge: bottom-left above title
- Page `<h1>`: bottom-left, large white text with `drop-shadow-lg`
- Subtitle/description: below title, `text-gray-200`
- Dark gradient scrim (`from-black/45 via-black/10 to-black/75`) ensures WCAG AA contrast for all text

**Accessibility:**
- All media layers are `aria-hidden="true"` (decorative)
- `<h1>` is the first heading in DOM order — correct semantic structure
- Breadcrumb uses `<nav aria-label="Breadcrumb">` with proper link text
- Video hint is `aria-hidden` — purely visual, not needed by screen readers

**Technical approach:**
- `src/components/ui/PageHero.tsx` — client component
- `onCanPlay` fires auto-play after first mount (guarded by `didAutoPlay` ref — one attempt only)
- Subsequent interactions call `videoRef.current.play()` / `.pause()` directly
- `priority` on `<Image>` — banner is the LCP element on pillar and article pages

---

### 6.8 Dynamic article cover — `resolveCoverImage()` — v2.4.0 (released Jun 2026)

**Behaviour:**
- Every article always shows a contextually appropriate cover image with zero author effort
- New articles without `coverImage` frontmatter automatically receive a tag-matched image

**Resolution priority (server-side, pure function):**
1. `article.coverImage` — explicit author choice in MDX frontmatter
2. `ARTICLE_MEDIA_TAGS[tag]` — first matching tag in the article's tag list
3. `PILLAR_IMAGES[pillar].src` — pillar-level fallback; always resolves

**Tag map (`ARTICLE_MEDIA_TAGS`)** covers 19 tags including: `oceans`, `biodiversity`, `climate`, `ecosystems`, `forests`, `agriculture`, `food systems`, `deforestation`, `policy`, `government`, `conservation`, `sustainability`, `evolution`, `geology`, `history`, `extinction`, `science`, `action`, `lifestyle`

**Technical approach:**
- `resolveCoverImage(coverImage, tags, pillar)` exported from `src/lib/mediaConfig.ts`
- Called in the article page server component — no client JS required
- Resolved `src` passed as `imageSrc` prop to `PageHero`

---

## 7. EarthPulse Observatory — v3.0.0

### 7.1 Overview

The EarthPulse Observatory is a data-driven dashboard that surfaces real planetary change metrics from authoritative global research agencies (NASA, NOAA, NSIDC, Global Forest Watch, WGMS). It is designed to give users — from curious members of the public to students, researchers, and policymakers — an immediate, scientifically grounded sense of how the planet is changing across six key indicators.

**Design metaphor:** Earth's vital signs. Each metric is framed as a health indicator of a living system, with safe zones, warning bands, and critical thresholds aligned to IPCC and scientific consensus values.

**Data strategy:** All datasets are fetched from public APIs at build time and stored as static JSON in `/public/data/`. Zero API dependency at runtime — data served from Vercel CDN.

---

### 7.2 Observatory entry points

- **Navbar pill (desktop):** teal `🛰️ Observatory` button between the nav links and ThemeToggle — visually distinct from primary navigation
- **Floating Action Button (mobile):** `ObservatoryFAB` rendered in `layout.tsx`, fixed bottom-right, `lg:hidden` — always accessible on mobile without opening the hamburger menu
- Both link to `/observatory`

---

### 7.3 Observatory landing dashboard (`/observatory`)

Dark-mode-first layout (`bg-slate-950`) independent of site theme toggle.

**Layout:**
- Header: `🛰️ EarthPulse Observatory`, subtitle, last-updated timestamp
- `YearScrubber` — global timeline slider (1950–present); all metric deltas update simultaneously
- 2×3 metric card grid (desktop) / 1-col (mobile) of `MetricCard` components
- `LifetimeWidget` below the grid
- Footer: data attribution + links back to main site

**Each MetricCard shows:**
- Metric icon, label, current value + unit
- Delta from baseline year (1990 default, or user's birth year from LifetimeWidget)
- `StatusBadge` — Safe / Caution / Critical, colour-coded against IPCC thresholds
- Sparkline chart (last 30 data points, no axes, thin coloured line)
- Source agency badge
- "Explore →" link to `/observatory/[metric]`

---

### 7.4 Primary metrics

| Metric | Source | Unit | Period |
|--------|--------|------|--------|
| Global temperature anomaly | NASA GISS | °C | 1880–present |
| Atmospheric CO₂ | NOAA Mauna Loa | ppm | 1958–present |
| Sea level rise | NASA JPL | mm | 1993–present |
| Arctic sea ice extent | NSIDC (September min) | M km² | 1979–present |
| Tropical deforestation | Global Forest Watch | Mha/yr | 2001–present |
| Glacier mass balance | WGMS cumulative | mm w.e. | 1950–present |

---

### 7.5 IPCC-aligned thresholds

| Metric | Safe | Caution | Critical | Higher = better? |
|--------|------|---------|----------|-----------------|
| Temperature | ≤ 1.0°C | 1.0–1.5°C | > 1.5°C | No |
| CO₂ | ≤ 350 ppm | 350–400 ppm | > 400 ppm | No |
| Sea level | ≤ 50 mm | 50–150 mm | > 150 mm | No |
| Sea ice | ≥ 6.0 M km² | 4.5–6.0 | < 3.5 | Yes |
| Deforestation | ≤ 8 Mha/yr | 8–12 Mha/yr | > 15 Mha/yr | No |
| Glacier balance | ≥ −10,000 mm | −10k–−20k | < −28,000 mm | Yes |

---

### 7.6 Deep-dive metric pages (`/observatory/[metric]`)

One static page per metric. Generated via `generateStaticParams()`.

- Full interactive Recharts chart (`ComposedChart` + `Area` + `ReferenceLine` + `Brush`)
- Threshold reference lines with labels at each band boundary
- Scientific context: 2–3 paragraphs explaining the metric, its significance, and what the current trend implies
- `DataProvenancePanel`: source agency, dataset name, last fetched date, methodology URL
- `StatusBadge` + current value prominently displayed
- Related EarthPulse articles (tag-matched via `getAllArticles()`)
- Back link to `/observatory`

---

### 7.7 YearScrubber

- Range input (`<input type="range">`) spanning 1950–current year
- Controls `baselineYear` state in the parent Observatory dashboard
- All MetricCard delta values recalculate from the selected year
- Styled with `accent-emerald-500`; shows min year, max year, selected year labels

---

### 7.8 LifetimeWidget

- Text/number input: "I was born in [year]" (range 1924–2010)
- No data persisted or transmitted — purely client-side calculation
- For each metric: "Since you were born in 1985, CO₂ has risen by X ppm"
- Uses `getDeltaFromYear()` from `src/lib/observatory.ts`
- Updates `baselineYear` in the parent dashboard to match birth year

---

### 7.9 Data pipeline

**Build-time fetch (`scripts/fetch-observatory-data.ts`):**
1. Fetches each dataset via Node.js native fetch
2. Parses CSV / space-delimited / GeoJSON
3. Normalises to `MetricDataset` schema
4. Writes to `public/data/[metric].json`
5. On failure: logs error, keeps existing JSON file, does not crash the build

**`prebuild` npm hook:** runs automatically before every `next build`. Also runnable manually via `npm run fetch-data`.

**Data freshness:** A GitHub Actions workflow (`refresh-data.yml`) triggers monthly to update the datasets without a code change.

---

### 7.10 Accessibility

- All charts include an accessible data table (`sr-only`) for screen readers
- Colour palette tested for Deuteranopia and Protanopia
- `prefers-reduced-motion`: animated chart transitions disabled, static renders shown
- Full mobile feature parity via individual metric pages
- `aria-label` on all interactive Observatory controls

---

## 8. Feature specification — v3.1.0+ (future roadmap)

| Feature | Description |
|---------|-------------|
| User accounts | Save articles, track reading, submit contributions |
| Community submissions | Editorial workflow for external contributors |
| Comments | Giscus (GitHub-backed, moderation-optional) |
| Live data dashboards | Real-time feeds from public environmental APIs |
| Multilingual support | Next.js i18n routing, priority languages TBD |
| Initiative directory | Searchable, filterable database of environmental projects |

---

## 8. Content governance

### 8.1 Editorial standards
- All factual claims must be traceable to a cited source
- Sources should be primary (peer-reviewed papers, government data, reputable institutions) where possible
- Articles should be reviewed and updated when significant new data becomes available

### 8.2 Accuracy and corrections
- A visible correction notice should be added to any article where a factual error is corrected
- The original publication date and correction date should both be recorded

### 8.3 Content model (MDX frontmatter)
Full field specification, component reference, and media sourcing guide are in the `doc/` folder. See section 9 below.

### 8.4 Authoring documentation
The `doc/` folder is the single source of truth for content authors. It is maintained alongside the codebase and updated whenever a component, frontmatter field, or authoring convention changes.

---

## 9. Authoring documentation (`doc/`)

Content authoring guides live in the `doc/` folder alongside the codebase. They cover the full authored interface — frontmatter fields, MDX components, media sourcing, and static page editing.

### 9.1 Document index

| Document | Purpose |
|----------|---------|
| `doc/README.md` | Index of all docs; folder map; one-minute publish workflow |
| `doc/authoring-articles.md` | Writing new articles — frontmatter reference, structure, tags, sources, publishing |
| `doc/authoring-components.md` | MDX component reference — `<Tip>`, `<DidYouKnow>`, `<Impact>`, `<Callout>`, `<NewsletterForm>` |
| `doc/authoring-media.md` | Cover images — finding Unsplash photos, URL format, local images, attribution |
| `doc/authoring-static-pages.md` | Editing About, Contribute, Newsletter, and Privacy pages |

### 9.2 Doc maintenance rules

- When a new MDX component is shipped: add it to `doc/authoring-components.md` before closing the feature
- When a frontmatter field is added or changed: update `doc/authoring-articles.md` or `doc/authoring-static-pages.md`
- When a new image CDN is added to `remotePatterns`: update `doc/authoring-media.md`
- The `doc/` folder is part of the NFR compliance gate — outdated authoring docs are a documentation bug

### 9.3 Component authored interface (summary)

| Component | Syntax | Available in |
|-----------|--------|-------------|
| `<Tip>` | `<Tip>Text</Tip>` | Articles + all pages |
| `<DidYouKnow>` | `<DidYouKnow>Text</DidYouKnow>` | Articles + all pages |
| `<Impact>` | `<Impact>Text</Impact>` | Articles + all pages |
| `<Callout>` | `<Callout icon="🔬" title="Title">Text</Callout>` | Static pages primarily |
| `<NewsletterForm />` | `<NewsletterForm />` | `newsletter.mdx` only |

Full examples with do's and don'ts: see `doc/authoring-components.md`.

### 9.4 Article frontmatter (summary)

| Field | Required | Type | Default |
|-------|----------|------|---------|
| `title` | ✅ | string | — |
| `description` | ✅ | string | — |
| `date` | ✅ | `YYYY-MM-DD` | — |
| `author` | ✗ | string | `"EarthPulse Editorial"` |
| `tags` | ✗ | string[] | `[]` |
| `featured` | ✗ | boolean | `false` |
| `coverImage` | ✗ | Unsplash URL | pillar image fallback |

Full field descriptions and cover image URL format: see `doc/authoring-articles.md` and `doc/authoring-media.md`.

---

## 11. Accessibility

The website targets **WCAG 2.1 AA** compliance:
- All images include descriptive alt text
- Colour contrast ratios meet AA requirements
- Navigation is operable via keyboard
- Semantic HTML5 elements used throughout (`<nav>`, `<main>`, `<article>`, `<header>`, `<footer>`)
- Focus states visible on all interactive elements