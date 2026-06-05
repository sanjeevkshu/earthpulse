# Media Guide — Images and Cover Photos

This guide explains how to find, format, and use images in EarthPulse articles and pages.

---

## Overview: how images work

EarthPulse uses **Unsplash** as its image CDN for all content images. Unsplash images are:

- Free to use (Unsplash Licence — no attribution required, though appreciated)
- Hotlinking permitted — you can reference them directly by URL
- High quality and contextually appropriate for environmental content
- Served through Next.js's `/_next/image` proxy, which means CORS is not a concern

> **Why not upload images directly?** EarthPulse is a Git-based static site. Large binary files in Git make the repository slow and expensive to clone. Unsplash URLs are small strings that produce the same result.

---

## Step 1 — Find a photo on Unsplash

1. Go to [unsplash.com](https://unsplash.com)
2. Search for your topic (e.g. `mangrove forest`, `coral reef`, `wind turbines`, `soil`)
3. Choose a horizontal landscape photo — these work best as hero banners
4. Click the photo to open it

---

## Step 2 — Copy the photo ID

Look at the URL of the photo page:

```
https://unsplash.com/photos/FpNB4N1ENqM
                                  ^^^^^^^^^
                              This is the photo ID
```

Copy that ID — in this example: `FpNB4N1ENqM`

---

## Step 3 — Build the URL

Replace `{PHOTO_ID}` with the ID you copied:

```
https://images.unsplash.com/photo-{PHOTO_ID}?auto=format&fit=crop&w=1920&q=80
```

**Full example:**

```
https://images.unsplash.com/photo-FpNB4N1ENqM?auto=format&fit=crop&w=1920&q=80
```

The query parameters mean:
- `auto=format` — Unsplash serves WebP to browsers that support it (smaller file, better quality)
- `fit=crop` — crop to fill the exact dimensions without distortion
- `w=1920` — cap the source width at 1920px (prevents Next.js from fetching a 6000px original)
- `q=80` — 80% quality compression (good quality, smaller file)

**Always include all four parameters.** Do not change them.

---

## Step 4 — Add to your article's frontmatter

```yaml
---
title: "My article"
coverImage: "https://images.unsplash.com/photo-FpNB4N1ENqM?auto=format&fit=crop&w=1920&q=80"
---
```

That's it. The image will appear as the full-bleed hero at the top of your article page.

---

## What if you don't set a coverImage?

The article still looks correct. EarthPulse has a three-layer fallback:

1. Your `coverImage` (if set) — best: specific to your article
2. The pillar's contextual banner image — contextually relevant, always works
3. The pillar's CSS gradient — zero external dependencies, always renders

You never need to worry about a broken or missing image.

---

## Choosing the right photo

| ✅ Good choices | ❌ Avoid |
|----------------|---------|
| Horizontal landscape orientation | Portrait (tall) photos — they crop badly |
| High contrast between subject and background | Low contrast — text overlaid will be unreadable |
| Natural, outdoors subjects | Office / studio shots (unless for a research/voices article) |
| Well-lit, clear subject | Dark, blurry, or grainy photos |
| Subject different from your pillar banner | The same photo as the pillar index — aim for variety |

### Suggested search terms by pillar

| Pillar | Good search terms |
|--------|------------------|
| Our Planet | `rainforest aerial`, `coral reef underwater`, `biodiversity wildlife`, `wetland landscape` |
| Through Time | `geological formation`, `fossil rock`, `canyon layers`, `ancient earth` |
| Human Footprint | `factory pollution`, `deforestation aerial`, `industrial landscape`, `wheat field` |
| In Action | `solar panels field`, `wind turbines landscape`, `community planting`, `protected forest` |
| Voices & Research | `scientist fieldwork`, `research laboratory nature`, `open books nature`, `wildlife survey` |
| Take Action | `cycling urban`, `farmer market`, `community garden`, `sustainable living` |

---

## Using local images

If you have your own photograph or a Creative Commons image you want to use:

1. Place the file in `public/images/articles/` — use a descriptive filename:
   ```
   public/images/articles/mangrove-roots-borneo.jpg
   ```

2. Reference it with a root-relative path in frontmatter:
   ```yaml
   coverImage: "/images/articles/mangrove-roots-borneo.jpg"
   ```

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`

**Size guidance:** keep files under 500KB. Images over 2MB will slow page loads significantly.

---

## Attribution

Unsplash photographers appreciate attribution even though it is not legally required. A good practice in your Sources section:

```mdx
## Sources

- Cover photo: [Lukasz Szmigiel](https://unsplash.com/@szmigieldesign) on Unsplash
- ...
```

---

## Images inside article body

For diagrams, charts, or images that are part of the article content (not the hero):

```mdx
![Alt text describing what is in the image for screen readers](/images/articles/diagram.png)
```

Rules:
- Always write descriptive `alt` text — describe what is in the image, not the filename
- Place images where they are relevant in the text, not in clusters
- Keep captions in the paragraph below the image if needed (MDX does not have native figure captions)

---

## What about video?

Video backgrounds for the hero sections are managed by the development team in `src/lib/mediaConfig.ts` — they are **not** set by individual article authors. The same looping nature video plays on all pillar and article heroes. If you want a different video for a specific page, open a GitHub issue or contact the development team.

---

## Quick reference

```yaml
# ✅ Correct — Unsplash with full parameter string
coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"

# ✅ Correct — local file in public/images/articles/
coverImage: "/images/articles/my-photo.jpg"

# ❌ Wrong — missing query parameters
coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b"

# ❌ Wrong — Pexels image (may have hotlink restrictions)
coverImage: "https://images.pexels.com/photos/12345/photo.jpeg"

# ❌ Wrong — arbitrary external URL with unknown CORS policy
coverImage: "https://some-other-site.com/photo.jpg"
```
