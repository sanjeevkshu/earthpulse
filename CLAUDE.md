@AGENTS.md

# EarthPulse — Claude Code context

This file is read automatically by Claude Code at the start of every session.
It provides full project context so Claude Code can continue development without re-explanation.

---

## Project summary

**EarthPulse** is an open-source, content-first environmental education website.
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · MDX · Vercel
**Repo:** https://github.com/sanjeevkshu/earthpulse *(update this)*
**Live site:** https://earthpulse.org *(once deployed)*

---

## Architecture

- Fully statically generated (SSG) — no server, no database
- Content lives as `.mdx` files in `/content`, parsed at build time
- Deployed to Vercel free Hobby tier — auto-deploys on every push to `main`
- No CMS — content is authored directly as Markdown in Git

```
content/           ← all articles as .mdx files
  our-planet/
  through-time/
  human-footprint/
  in-action/
  voices/
  take-action/
src/
  app/             ← Next.js App Router pages
  components/
    layout/        ← Navbar, Footer
    article/       ← ArticleCard
    ui/            ← shared primitives (growing)
  lib/
    content.ts     ← MDX loader, getAllArticles, getArticle, PILLAR_META
public/
  images/
CLAUDE.md          ← this file
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
date: "2024-06-01"          # ISO format
author: "Author Name"        # defaults to "EarthPulse Editorial"
tags: ["tag1", "tag2"]
featured: false              # true = shown in homepage featured section
coverImage: "/images/articles/my-image.jpg"   # optional
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

- **Brand colour:** teal-green (`brand-400 = #1D9E75`)
- **Dark mode:** `class` strategy via `next-themes` — toggle in Navbar, defaults to system preference, persists in localStorage. Tailwind v4 requires `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` to make `dark:` utilities respond to the class instead of the OS media query.
- **Typography plugin:** `@tailwindcss/typography` — use `prose-custom` class on article bodies
- **Shared CSS classes:** `.btn-primary`, `.btn-outline`, `.card`, `.tag`, `.nav-link`, `.section-title`

---

## Completed features (v1.0)

- [x] Homepage with hero, stats bar, pillar grid, featured articles, latest articles, newsletter CTA
- [x] Pillar index pages (`/[pillar]`)
- [x] Article pages (`/[pillar]/[slug]`) with MDX rendering, breadcrumbs, tags, reading time
- [x] Tag pages (`/tag/[tag]`)
- [x] Navbar (responsive, mobile hamburger)
- [x] Footer with navigation columns
- [x] ArticleCard component
- [x] Content library (`src/lib/content.ts`)
- [x] 6 seed articles (one per pillar)
- [x] README, FUNCTIONAL_SPEC, TECHNICAL_DESIGN

---

## Planned features — v2 (build these next)

| Feature | Notes |
|---------|-------|
| Site search | Pagefind — runs at build time, zero server needed |
| Newsletter page | Brevo embed, topic preference checkboxes |
| Sitemap | `src/app/sitemap.ts` using `getAllArticles()` |
| robots.txt | `src/app/robots.ts` |
| ~~Dark mode toggle~~ | ✅ Done — `next-themes`, `ThemeProvider`, `ThemeToggle` in Navbar (desktop + mobile) |
| Reading progress bar | Client component, scroll event listener, on article pages |
| About page | Mission, team, editorial standards |
| Contribute page | How to submit articles or corrections |

---

## Planned features — v3 (future)

- User accounts (Clerk or NextAuth — free tiers)
- Comments (Giscus — GitHub Discussions backed)
- Live data dashboards (public environmental APIs)
- Multilingual support (Next.js i18n routing)
- Community article submissions with editorial review workflow
- Personal carbon footprint calculator widget

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
npm run dev      # local dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```
