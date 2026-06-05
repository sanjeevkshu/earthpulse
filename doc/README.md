# EarthPulse — Authoring Documentation

This folder contains practical guides for content authors. You do not need any technical knowledge beyond basic Markdown to write and publish on EarthPulse. Everything here is about the **content layer** — what you write in `.mdx` files.

---

## Guides in this folder

| File | What it covers |
|------|---------------|
| [authoring-articles.md](./authoring-articles.md) | Writing a new article — frontmatter, structure, publishing workflow |
| [authoring-components.md](./authoring-components.md) | MDX callout components — Tip, DidYouKnow, Impact, Callout |
| [authoring-media.md](./authoring-media.md) | Finding and using cover images (Unsplash), image URL format |
| [authoring-static-pages.md](./authoring-static-pages.md) | Editing the About, Contribute, Newsletter, and Privacy pages |

---

## Quick orientation

```
content/
  our-planet/          ← articles about ecosystems, biodiversity, oceans
  through-time/        ← articles about Earth history and evolution
  human-footprint/     ← articles about human impact
  in-action/           ← articles about conservation initiatives
  voices/              ← long-form opinion, research summaries
  take-action/         ← practical guides for individuals
  pages/               ← site pages: about, contribute, newsletter, privacy
```

Each file in `content/` is a `.mdx` file — Markdown with the ability to embed special components.

---

## The one-minute publishing workflow

```bash
# 1. Create your file
touch content/voices/my-article-slug.mdx

# 2. Write frontmatter + content (see authoring-articles.md)

# 3. Commit and push
git add content/voices/my-article-slug.mdx
git commit -m "Add article: My article title"
git push
# → Vercel auto-deploys in ~90 seconds
```

No build step, no CMS login, no special tools — just a text editor and Git.
