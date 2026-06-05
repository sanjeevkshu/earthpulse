# EarthPulse — Technical Design Document

**Version:** 1.0  
**Status:** Active  
**Last updated:** June 2024

---

## 1. Architecture overview

EarthPulse is a statically generated website with a decoupled content layer. Content is authored as MDX files in a Git repository and rendered at build time into static HTML. There is no server, no database, and no runtime content fetching.

```
┌─────────────────────┐
│   GitHub repository  │  ← Source of truth for code + content
└────────┬────────────┘
         │ git push
         ▼
┌─────────────────────┐
│   Vercel CI/CD       │  ← Detects push, runs next build
└────────┬────────────┘
         │ builds static HTML/CSS/JS
         ▼
┌─────────────────────┐
│   Vercel CDN         │  ← Serves globally, SSL automatic
└─────────────────────┘
         │
         ▼ browser request
┌─────────────────────┐
│   User browser       │  ← No server-side runtime needed
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

Tailwind CSS utility classes are used throughout. Custom design tokens are defined in `tailwind.config.ts`:

- **Brand colour:** A green teal ramp (`brand-50` to `brand-900`) based on `#1D9E75`
- **Dark mode:** `class` strategy — controlled by the `dark` class on `<html>`. Currently set by system preference. A manual toggle is planned for v2.
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

## 10. Deployment

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
