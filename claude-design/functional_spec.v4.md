# EarthPulse — Functional Specification

**Version:** 1.0  
**Status:** Active  
**Last updated:** June 2024

---

## 1. Purpose and scope

EarthPulse is a public-facing informational website focused on environmental education, ecosystem science, human impact, and sustainability. This document defines what the website does — its functional behaviour, content model, user journeys, and feature set for the initial launch (v1.0) and planned subsequent phases.

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

## 5. Feature specification — v1.0

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

## 6. Feature specification — v2 (planned)

| Feature | Status | Description |
|---------|--------|-------------|
| Site search | Planned | Pagefind-powered static search with tag/pillar filtering |
| Newsletter integration | **Done** | Brevo embed with topic preferences — standalone page |
| Interactive timeline | Planned | Visual, filterable timeline for Through Time section |
| Data visualisations | Planned | Embedded charts (CO₂ trends, deforestation rates) |
| Mega-menu | Planned | Rich pillar navigation with sub-topic links |
| Dark mode toggle | **Done** | Manual override via toggle in Navbar; defaults to system preference; persisted in localStorage via next-themes |
| Reading progress bar | Planned | On long-form articles |
| Hero media (homepage) | **Done** | Full-width video/image hero with text overlay; free open-licensed media via Pexels |
| Hero media (pillar pages) | **Done** | Contextual banner image per pillar; sourced from Unsplash/Pexels free tier |
| Hero media (article pages) | **Done** | Optional `coverImage` frontmatter field renders full-width article hero |
| Article callout components | **Done** | MDX-compatible `<Tip>`, `<DidYouKnow>`, `<Impact>` components with iconography |
| About page | **Done** | Mission, values, editorial standards, team |
| Newsletter page | **Done** | Brevo embed, topic preferences, value proposition |
| Contribute page | **Done** | How to write, submit, and get published on EarthPulse |
| Privacy policy page | **Done** | Data handling, cookies, third-party services |

---

### 6.9 Hero media — homepage

**Behaviour:**
- Full-bleed hero section with an autoplaying, muted, looping background video
- Fallback to a high-quality still image if video fails to load or on slow connections
- Text overlay (headline, subtitle, CTAs) rendered above the media with a dark gradient scrim for legibility
- Media sourced from Pexels free licence — no attribution required for editorial use

**Media source:** Pexels free video — aerial ocean/forest/earth footage
**Fallback image:** Unsplash free — earth from above

**Accessibility:**
- Video has `aria-hidden="true"` — decorative only
- `prefers-reduced-motion` media query: video paused, still image shown instead

---

### 6.10 Hero media — pillar and article pages

**Behaviour:**
- Each pillar index page displays a contextual full-width banner image matching its topic
- Article pages render a hero image if `coverImage` is set in frontmatter; graceful no-image layout if not set
- Images use `next/image` for automatic WebP conversion, lazy loading, and responsive sizing

**Pillar image mapping** (Unsplash/Pexels free):

| Pillar | Visual theme |
|--------|-------------|
| Our Planet | Aerial forest canopy |
| Through Time | Geological strata / fossil |
| Human Footprint | Industrial landscape from above |
| In Action | Community planting / solar field |
| Voices & Research | Person writing / research lab |
| Take Action | Hands in soil / volunteer group |

---

### 6.11 Article callout components

Three reusable MDX components available in all articles:

| Component | Icon | Purpose | Colour |
|-----------|------|---------|--------|
| `<Tip>` | 💡 | Practical advice or actionable suggestion | Amber |
| `<DidYouKnow>` | 🌍 | Surprising or counterintuitive fact | Teal/brand |
| `<Impact>` | ⚡ | Quantified impact stat or consequence | Orange/red |

**Usage in MDX:**
```mdx
<DidYouKnow>
  The ocean produces around 50% of Earth's oxygen — more than all the world's forests combined.
</DidYouKnow>

<Impact>
  A single transatlantic flight generates approximately **1 tonne of CO₂** per passenger — equivalent to months of daily driving.
</Impact>

<Tip>
  Switching to a plant-rich diet is one of the highest-impact personal actions available, reducing food-related emissions by up to 50%.
</Tip>
```

**Technical approach:**
- Three client-agnostic React components in `src/components/article/`
- Passed into `MDXRemote` via the `components` prop in the article page
- Fully dark-mode compatible

---

### 6.12 About, Newsletter, Contribute, Privacy pages

Static informational pages. Content generated as `.tsx` files in `src/app/`.

| Page | Path | Key content |
|------|------|-------------|
| About | `/about` | Mission, editorial principles, values, team structure |
| Newsletter | `/newsletter` | Value proposition, Brevo embed placeholder, topic options |
| Contribute | `/contribute` | Writing guidelines, submission process, editorial standards |
| Privacy | `/privacy` | Data collected, cookies, third-party services, contact |

---

## 7. EarthPulse Observatory — v2 feature specification

### 7.1 Overview

The EarthPulse Observatory is a data-driven dashboard and tool suite that surfaces real planetary change metrics from authoritative global research agencies. It is designed to give users — from curious members of the public to students, researchers, and policymakers — an immediate, visceral, and scientifically grounded sense of how the planet is changing across key indicators.

**Design metaphor:** Earth's vital signs. Each metric is framed as a health indicator of a living system — with safe zones, warning bands, and critical thresholds aligned to IPCC and scientific consensus values.

---

### 7.2 Observatory entry point

- A floating **Observatory button** is added to the global Navbar — visually distinct from primary navigation (satellite/globe icon, teal pill, persists across all pages)
- Clicking opens the **Observatory Landing Dashboard** — a full-screen immersive view
- On mobile, the Observatory button appears in the bottom navigation bar as a floating action button (FAB)

---

### 7.3 Observatory landing dashboard

A single-page command centre showing all active metrics simultaneously.

**Layout:**
- Dark-mode-first design (space/earth aesthetic) — independent of site-wide theme toggle
- Hero: animated Earth globe or world map with data overlay (SVG-based, no heavy 3D lib required)
- Metric cards grid — 6 primary indicators in a responsive 2×3 (desktop) / 1-col (mobile) layout
- Global year scrubber at the bottom — drag to explore any year from 1950 to present; all metrics update simultaneously
- "My Lifetime" widget — user enters birth year, all deltas recalculate from that year

**Each metric card shows:**
- Current value + unit
- Delta from baseline year (1990 default, or user's birth year)
- Sparkline trend chart (last 50 years)
- Status indicator: Safe / Caution / Critical (colour-coded against scientific thresholds)
- Source agency badge (NASA, NOAA, ESA, NSIDC etc.)
- "Explore" CTA → opens deep-dive modal/page

---

### 7.4 Primary metrics (v2 launch set)

| Metric | Source agency | Data availability | Update frequency |
|--------|--------------|-------------------|-----------------|
| Global average temperature anomaly | NASA GISS / NOAA | 1880–present | Monthly |
| Sea level rise | NASA Satellite Altimetry / CSIRO | 1993–present | Monthly |
| Arctic sea ice extent | NSIDC | 1979–present | Daily/Monthly |
| Atmospheric CO₂ concentration | NOAA Mauna Loa / Scripps | 1958–present | Monthly |
| Tropical deforestation rate | Global Forest Watch / Hansen/UMD | 2000–present | Annual |
| Glacier mass balance | WGMS (World Glacier Monitoring Service) | 1950–present | Annual |

All data sources are **publicly available APIs or downloadable datasets** in the public domain. No API keys required for most; rate limits are generous for read-only access.

---

### 7.5 Data source architecture

**Approach:** Hybrid static + live fetch

- At **build time**: fetch latest full historical datasets from each API and store as static JSON in `/public/data/` — guarantees fast load, zero API dependency at runtime
- At **runtime**: optionally re-fetch the most recent data point(s) via Next.js Route Handlers for near-live values — gracefully falls back to build-time data if API is unavailable
- All data cached in Vercel CDN — no server costs

**Public data endpoints:**

```
NASA GISS Surface Temperature: https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv
NOAA CO₂ (Mauna Loa):          https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv
NASA Sea Level (GSFC):         https://sealevel.nasa.gov/ftp/txt/MSL_Seasonal_v3.1.txt (via PODAAC)
NSIDC Sea Ice:                 https://nsidc.org/data/seaice_index/ (CSV download)
Global Forest Watch:           https://www.globalforestwatch.org/open-data/ (GFW API)
WGMS Glacier:                  https://wgms.ch/data/wgms_fog_2022-11.zip (annual release)
```

---

### 7.6 Deep-dive metric pages

Each metric has a dedicated page at `/observatory/[metric]` providing:

- Full historical chart (interactive, zoomable, Recharts)
- Threshold bands visualised on the chart (safe / caution / critical)
- Scientific context: what this metric means, why it matters, what the trend implies
- Projected trend overlay (IPCC scenario lines: SSP1-2.6, SSP2-4.5, SSP5-8.5)
- Data provenance panel: source, methodology, update cadence, link to original dataset
- Share card generator — exports a branded PNG snapshot for social media
- Related EarthPulse articles (tag-matched)

---

### 7.7 "My Lifetime" feature

- Text input: "I was born in [year]"
- No account, no data stored — purely client-side calculation
- All metric deltas recalculate from the entered year to present
- Framing: "Since you were born in 1985, global average temperature has risen by 0.6°C, sea levels have risen by 9cm, and the Arctic has lost 40% of its summer sea ice."
- Shareable as a personalised summary card

---

### 7.8 Accessibility and performance

- All charts include accessible data tables as screen-reader fallbacks (visually hidden, `sr-only`)
- Colour palette designed to be distinguishable for colour-blind users (tested against Deuteranopia and Protanopia)
- Charts load progressively — skeleton loaders shown while data fetches
- `prefers-reduced-motion`: animated transitions disabled, static chart renders shown instead
- Mobile: full feature parity via individual metric pages replacing desktop modals

---

### 7.9 Future elevation (v3)

- **Live satellite imagery overlay** — NASA Worldview tiles showing current cloud cover, fire, flood, ice
- **Community observation pins** — users can pin local environmental observations to a world map
- **Alert subscriptions** — email or push notification when a metric crosses a new threshold
- **Educator mode** — simplified view with curriculum-aligned explanations for classroom use
- **Comparison tool** — overlay any two metrics on a shared timeline to explore correlations

---

## 8. Feature specification — v3 (future)

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
See README.md for full field specification.

---

## 9. Accessibility

The website targets **WCAG 2.1 AA** compliance:
- All images include descriptive alt text
- Colour contrast ratios meet AA requirements
- Navigation is operable via keyboard
- Semantic HTML5 elements used throughout (`<nav>`, `<main>`, `<article>`, `<header>`, `<footer>`)
- Focus states visible on all interactive elements
