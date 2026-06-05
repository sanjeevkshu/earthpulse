# Editing Static Site Pages

EarthPulse has four static site pages that are authored in MDX — just like articles. They live in `content/pages/` and use the same frontmatter and component system.

---

## The four pages

| Page | File | URL | Purpose |
|------|------|-----|---------|
| About | `content/pages/about.mdx` | `/about` | Mission, values, editorial standards, get involved |
| Contribute | `content/pages/contribute.mdx` | `/contribute` | Submission guidelines and article template |
| Newsletter | `content/pages/newsletter.mdx` | `/newsletter` | Subscriber value props and sign-up form |
| Privacy Policy | `content/pages/privacy.mdx` | `/privacy` | Data handling and legal notices |

---

## Frontmatter fields

```yaml
---
title: "Page title"
description: "One sentence shown as the hero subtitle and in <meta description>."
date: "2024-06-01"
icon: "🌿"
coverImage: "https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1920&q=80"
---
```

### Field reference

| Field | Required | Notes |
|-------|----------|-------|
| `title` | ✅ | Shown as the large `<h1>` overlaid on the hero banner |
| `description` | ✅ | Hero subtitle and SEO meta description |
| `date` | ✅ | Shown as "Last updated" on the Privacy page; kept for all pages for consistency |
| `icon` | ✗ Optional | Emoji shown as a badge above the title in the hero overlay |
| `coverImage` | ✗ Optional | Unsplash URL — falls back to the page's CSS gradient if omitted |

> **Note:** The gradient colour and video source for each page are controlled in `src/lib/pages.ts` (design config) — not in the frontmatter. If you want to change the visual theme of a page, ask the development team.

---

## Available MDX components

All components available in regular articles are also available in static pages:

| Component | Use it for |
|-----------|-----------|
| `<Tip>` | Practical tips or calls to action |
| `<DidYouKnow>` | Surprising facts |
| `<Impact>` | Scale or consequence statements |
| `<Callout icon="..." title="...">` | Information cards with icon and optional title |
| `<NewsletterForm />` | Newsletter page only — topic selector + sign-up form |

See [authoring-components.md](./authoring-components.md) for full usage of each.

---

## The `<Callout>` component in static pages

Static pages use `<Callout>` heavily — it replaces what would otherwise be hardcoded React JSX grids. It creates a clean card with an emoji icon and an optional title.

```mdx
<Callout icon="🔬" title="Science-led">
  Every factual claim traces to a peer-reviewed source, government dataset,
  or reputable institution. We cite our sources openly and update articles
  when the evidence evolves.
</Callout>
```

This is the pattern used throughout `about.mdx` for the six values cards. Use it whenever you want to present a list of items that each need an icon, title, and a short explanation.

---

## Example: Editing `about.mdx`

Current file structure:

```mdx
---
title: "About EarthPulse"
description: "An open-source, independent platform for environmental education..."
date: "2024-06-01"
icon: "🌿"
coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80"
---

## Our mission

[Prose paragraphs about EarthPulse's purpose]

## What we stand for

<Callout icon="🔬" title="Science-led">
  [Description of the value]
</Callout>

<Callout icon="🌍" title="Planet-first">
  [Description of the value]
</Callout>

[...more Callout blocks...]

## Editorial standards

### Sources
[Prose]

### Corrections
[Prose]
```

**To add a new value to the "What we stand for" section:**

```mdx
<Callout icon="🌐" title="Global perspective">
  Environmental challenges do not respect national borders. We cover stories
  and data from every region, prioritising voices from communities most
  affected by ecological change.
</Callout>
```

---

## Example: Editing `contribute.mdx`

The submission steps use numbered `<Callout>` blocks:

```mdx
<Callout icon="01" title="Pitch your idea">
  Open a GitHub issue titled "Article pitch: [your topic]" or email us at
  editorial@earthpulse.org. Include a one-paragraph summary, the pillar it
  fits, and the primary sources you plan to use.
</Callout>

<Callout icon="02" title="Write your draft">
  Once your pitch is accepted, write your article as a `.mdx` file following
  the content template below.
</Callout>
```

You can add, remove, or reorder these steps freely.

---

## Example: Editing `newsletter.mdx`

The newsletter page uses `<Callout>` for the value propositions and `<NewsletterForm />` for the actual subscription form:

```mdx
---
title: "Stay close to the planet"
description: "The EarthPulse weekly digest..."
---

## Why subscribe?

<Callout icon="📖" title="One email per week — never more">
  We respect your inbox.
</Callout>

<Callout icon="🔬" title="Curated from trusted sources">
  Every story links back to peer-reviewed research.
</Callout>

## Subscribe

<NewsletterForm />

By subscribing you agree to our [Privacy Policy](/privacy).
```

**To add a new value proposition:** add another `<Callout>` block in the "Why subscribe?" section.

**To replace the Brevo embed:** edit `src/components/ui/NewsletterForm.tsx` — the placeholder `div` is clearly marked with setup instructions.

---

## Example: Editing `privacy.mdx`

The privacy page is pure Markdown prose — no `<Callout>` components. Update it when:

- You integrate a new third-party service (add a section under "Third-party services")
- You change what data you collect
- Legal requirements in your jurisdiction change

Always update the `date` field when making material changes:

```yaml
date: "2025-01-15"   # update to today's date when editing
```

---

## Publishing changes

Static page changes are published the same way as articles:

```bash
git add content/pages/about.mdx
git commit -m "Update About: add global perspective value"
git push
# → Live in ~90 seconds
```

---

## What you cannot change in frontmatter alone

The following are controlled by the development team in `src/lib/pages.ts` and cannot be set via frontmatter:

| Design element | How to change it |
|---|---|
| Hero gradient colour | Edit `PAGE_CONFIG` in `src/lib/pages.ts` |
| Hero video source | Same — `PAGE_CONFIG.videoSrc` |
| Page route (URL) | Not changeable — the filename IS the URL |

If you need any of these changed, open a GitHub issue.
