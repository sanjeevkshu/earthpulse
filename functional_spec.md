# EarthPulse — Functional Specification

**Current version:** 2.3.0  
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
| Reading progress bar | v2.3.0 | 🔲 Planned | Scroll-driven bar on long-form article pages |
| Site search | v2.4.0 | 🔲 Planned | Pagefind-powered static search with tag/pillar filtering |
| Newsletter page | v2.4.0 | 🔲 Planned | Brevo embed with topic preference checkboxes |
| Sitemap | v2.4.0 | 🔲 Planned | `src/app/sitemap.ts` using `getAllArticles()` |
| robots.txt | v2.4.0 | 🔲 Planned | `src/app/robots.ts` |
| About page | v2.5.0 | 🔲 Planned | Mission, team, editorial standards |
| Contribute page | v2.5.0 | 🔲 Planned | How to submit articles or corrections |
| Interactive timeline | v2.6.0 | 🔲 Planned | Visual, filterable timeline for Through Time section |
| Data visualisations | v2.6.0 | 🔲 Planned | Embedded charts (CO₂ trends, deforestation rates) |
| Mega-menu | v2.7.0 | 🔲 Planned | Rich pillar navigation with sub-topic links |

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

**Media sources (Pexels, free licence):**
- Video: `https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4`
- Fallback image: `https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg`

**Technical approach:**
- Static `<img>` (fallback) + `<video>` layered absolutely inside a `relative overflow-hidden` section
- Tailwind `motion-reduce:hidden` / `motion-safe:hidden` control which element is visible
- `next.config.ts` updated with `images.pexels.com` and `videos.pexels.com` remote patterns

---

### 6.3 Pillar page contextual banner images — v2.2.0 (released Jun 2026)

**Behaviour:**
- Each pillar index page (`/our-planet`, `/through-time`, etc.) opens with a full-width banner image relevant to that pillar's theme
- Banner height: `h-64` on mobile, `h-80` on `md+`
- A bottom-to-transparent gradient scrim blends the banner into the page background in both light and dark mode
- The pillar title, icon, and description appear below the banner as before

**Image map (Pexels):**

| Pillar | Image |
|--------|-------|
| Our Planet | `pexels-photo-3244513.jpeg` — lush green forest |
| Through Time | `pexels-photo-1162251.jpeg` — geological layers |
| Human Footprint | `pexels-photo-929385.jpeg` — industrial landscape |
| In Action | `pexels-photo-1072824.jpeg` — community action |
| Voices & Research | `pexels-photo-256541.jpeg` — books / research |
| Take Action | `pexels-photo-1072179.jpeg` — hands together |

**Technical approach:**
- `PILLAR_IMAGES` map defined locally in `src/app/[pillar]/page.tsx`
- `next/image` with `fill` and `objectFit: 'cover'`, `priority` for LCP
- Scrim: `bg-gradient-to-t from-white dark:from-gray-950 to-transparent`

---

### 6.4 Article page cover image — v2.2.0 (released Jun 2026)

**Behaviour:**
- When an article's MDX frontmatter includes a `coverImage` field, a full-width hero image is rendered between the breadcrumb and the article header
- When `coverImage` is absent, the layout is unchanged — no empty space, no placeholder
- Supports both relative paths (`/images/articles/my-image.jpg`) and absolute URLs (Pexels, etc.)

**Technical approach:**
- `next/image` with `fill`, `objectFit: 'cover'`, `priority`, inside `relative h-64 md:h-96 rounded-xl` container

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

## 7. Feature specification — v3.0.0+ (future roadmap)

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