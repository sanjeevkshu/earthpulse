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
| Newsletter integration | Planned | Brevo embed with topic preferences |
| Interactive timeline | Planned | Visual, filterable timeline for Through Time section |
| Data visualisations | Planned | Embedded charts (CO₂ trends, deforestation rates) |
| Mega-menu | Planned | Rich pillar navigation with sub-topic links |
| Dark mode toggle | **Done** | Manual override via toggle in Navbar; defaults to system preference; persisted in localStorage via next-themes |
| Reading progress bar | Planned | On long-form articles |

### 6.8 Dark mode toggle (implemented)

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

## 7. Feature specification — v3 (future)

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