# Media Guide — Cover Images and Videos

This guide explains how to find, format, and use both images and videos in EarthPulse articles and pages. Both are set via frontmatter fields in your `.mdx` file.

---

## At a glance

| Field | What it controls | Required? | Fallback if absent |
|-------|-----------------|-----------|-------------------|
| `coverImage` | Full-bleed hero image | Recommended | Tag-matched image → pillar image → CSS gradient |
| `coverVideo` | Hover/touch video overlay on the hero | Optional | Pillar video → site default video |

Both fields are independent. You can set one, both, or neither — the page always looks correct.

---

# Cover Images (`coverImage`)

---

## How images work

EarthPulse uses **Unsplash** as its image CDN. Unsplash images are:

- Free (Unsplash Licence — attribution appreciated but not required)
- Hotlinking permitted — reference them directly by URL
- High quality and contextually appropriate for environmental content
- Served through Next.js's `/_next/image` proxy — CORS is **not** a concern for images

> **Why not upload images directly?** EarthPulse is a Git-based static site. Binary files bloat the repository. Unsplash URLs are small strings that produce the same result.

---

## Step 1 — Find a photo on Unsplash

1. Go to [unsplash.com](https://unsplash.com)
2. Search for your topic (e.g. `mangrove forest`, `coral reef`, `wind turbines`)
3. Choose a **horizontal landscape** photo — portrait crops badly in the hero banner
4. Click the photo to open it

---

## Step 2 — Copy the photo ID

Look at the URL of the photo page:

```
https://unsplash.com/photos/FpNB4N1ENqM
                                  ^^^^^^^^^
                              This is the photo ID
```

---

## Step 3 — Build the URL

Replace `{PHOTO_ID}` with your ID:

```
https://images.unsplash.com/photo-{PHOTO_ID}?auto=format&fit=crop&w=1920&q=80
```

The query parameters:
- `auto=format` — serves WebP to browsers that support it
- `fit=crop` — fills the exact dimensions without distortion
- `w=1920` — caps the source at 1920px (prevents the server fetching a 6000px original)
- `q=80` — good quality at a smaller file size

**Always include all four parameters.**

---

## Step 4 — Add to frontmatter

```yaml
---
title: "My article"
coverImage: "https://images.unsplash.com/photo-FpNB4N1ENqM?auto=format&fit=crop&w=1920&q=80"
---
```

---

## What if you don't set a `coverImage`?

EarthPulse has a three-layer fallback — the page always has a visual header:

1. `coverImage` frontmatter — your specific choice
2. Tag-matched image — automatic, based on your article's tags
3. Pillar banner image — always available
4. CSS gradient — zero external dependencies, always renders

---

## Choosing the right photo

| ✅ Good | ❌ Avoid |
|--------|---------|
| Horizontal landscape | Portrait/tall — crops badly |
| High contrast | Low contrast — text overlay unreadable |
| Outdoors / nature | Office / studio shots (unless editorial content) |
| Well-lit and clear | Dark, blurry, or grainy |
| Different from your pillar banner | Same photo as the pillar index |

### Suggested search terms by pillar

| Pillar | Search terms |
|--------|-------------|
| Our Planet | `rainforest aerial`, `coral reef underwater`, `biodiversity wildlife` |
| Through Time | `geological formation`, `fossil rock`, `canyon layers` |
| Human Footprint | `factory pollution`, `deforestation aerial`, `industrial landscape` |
| In Action | `solar panels field`, `wind turbines`, `community planting` |
| Voices & Research | `scientist fieldwork`, `open books nature`, `wildlife survey` |
| Take Action | `cycling urban`, `community garden`, `sustainable living` |

---

## Using local images

1. Place the file in `public/images/articles/`:
   ```
   public/images/articles/mangrove-roots-borneo.jpg
   ```
2. Reference it with a root-relative path:
   ```yaml
   coverImage: "/images/articles/mangrove-roots-borneo.jpg"
   ```

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`  
**Size limit:** keep files under 500 KB.

---

## Image attribution

Unsplash attribution is not legally required but appreciated. Add it in your Sources section:

```mdx
## Sources

- Cover photo: [Lukasz Szmigiel](https://unsplash.com/@szmigieldesign) on Unsplash
```

---

## Images inside the article body

```mdx
![Alt text describing what is in the image](/images/articles/diagram.png)
```

- Always write descriptive `alt` text (what is IN the image, not its filename)
- Place images at relevant points in the text
- Captions go in the paragraph below the image

---

# Cover Videos (`coverVideo`)

---

## How cover videos work

When a `coverVideo` is set, the article or page hero becomes **interactive**: hovering (desktop) or touching (mobile) plays the video, which fades in over the cover image. When the user stops interacting, it fades back to the still image.

The `coverVideo` URL points directly to an MP4 file. The browser fetches and plays it with no server proxy — unlike images, which go through Next.js. This means **the video CDN must explicitly allow cross-origin embedding**.

---

## The critical rule for video CDNs

> **Every `coverVideo` URL must be served by a CDN that returns `Access-Control-Allow-Origin: *`.**

The browser's `<video>` element fetches the MP4 directly. If the CDN blocks cross-origin requests, the video silently fails to play — the still image remains visible (graceful degradation) but no video plays.

| CDN | Cross-origin video | Notes |
|-----|-------------------|-------|
| **MDN CC0 samples** | ✅ `Access-Control-Allow-Origin: *` | Free, CC0 licence, confirmed working |
| **Cloudinary (free tier)** | ✅ Configurable, default permissive | Upload your own video |
| **Bunny.net CDN** | ✅ CORS-enabled by default | Paid, good for production |
| **Self-hosted (Vercel)** | ✅ Same origin — no CORS needed | Add MP4 to `public/videos/` |
| Pexels video CDN | ❌ Blocks cross-origin `<video>` | Do not use |
| Google Cloud Storage (`gtv-videos-bucket`) | ❌ Returns HTTP 403 | Do not use |
| Arbitrary external URL | ⚠️ Unknown — test before using | Verify CORS headers first |

---

## The confirmed working free video source

The **MDN CC0 video library** hosts small, high-quality CC0 nature videos designed for web embedding:

```
https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4
```

Properties:
- Licence: **CC0 public domain** — free to use, no attribution required
- Size: ~1.1 MB — loads quickly on most connections
- CORS: `Access-Control-Allow-Origin: *` — confirmed
- Content: close-up nature macro footage of a flower

This is the video currently used by all seed articles as the default. **It works reliably as a demo.** For production, replace it with a video that better matches your article's topic.

---

## Step 1 — Find or prepare your MP4

**Option A — Use the MDN CC0 default (quick start):**

```yaml
coverVideo: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
```

**Option B — Upload your own to Cloudinary (free tier):**

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Upload your MP4 via the Media Library
3. Copy the delivery URL — it will look like:
   ```
   https://res.cloudinary.com/YOUR-CLOUD-NAME/video/upload/your-video.mp4
   ```
4. Cloudinary free tier allows cross-origin embedding by default.

**Option C — Self-host in the repository:**

Place the MP4 in `public/videos/articles/`:
```
public/videos/articles/coral-reef-timelapse.mp4
```

Reference with a root-relative path:
```yaml
coverVideo: "/videos/articles/coral-reef-timelapse.mp4"
```

**Size limit for self-hosted:** keep files under 5 MB. Large videos increase repository clone time and Vercel build upload size.

---

## Step 2 — Add to frontmatter

```yaml
---
title: "My article"
coverImage: "https://images.unsplash.com/photo-FpNB4N1ENqM?auto=format&fit=crop&w=1920&q=80"
coverVideo: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
---
```

Both fields are independent — you can set only one or both.

---

## What if you don't set a `coverVideo`?

The hero works perfectly without a video — it displays the cover image as a static full-bleed banner. No hover/touch interaction is offered, which is completely fine.

If `coverVideo` is absent, the site uses a three-layer fallback:

1. `coverVideo` frontmatter — your specific choice
2. Pillar's default video (`videoSrc` in `mediaConfig.ts`)
3. Site-wide default (`NATURE_VIDEO_SRC` in `mediaConfig.ts`)

In practice, a fallback video is always available so every page has interactive video capability even without an explicit `coverVideo`.

---

## Choosing a good cover video

| ✅ Good | ❌ Avoid |
|--------|---------|
| Short loop (5–30 seconds) | Very long files — slow to buffer |
| Nature, environment, relevant to topic | Unrelated content that distracts |
| Calm, ambient motion | Fast cuts or strobing — distracting behind text |
| Under 5 MB | Over 10 MB — poor experience on mobile |
| CORS-enabled CDN | Pexels video, GCS — blocked cross-origin |
| MP4 (H.264) | Unusual formats — not universally supported |

---

## How to verify a video URL works cross-origin

Before adding any non-MDN video URL, verify CORS headers:

1. Open [reqbin.com](https://reqbin.com) or similar HTTP tester
2. Make a `HEAD` request to your video URL
3. Check the response for `Access-Control-Allow-Origin: *`

If this header is absent or restricted to a specific domain, the video will fail to play.

---

## Video attribution

For CC0 videos, no attribution is required. For other licences, add a note in your Sources section:

```mdx
## Sources

- Cover video: [Title](https://source-url.com) — CC BY licence
```

---

# Quick reference

```yaml
# ── IMAGES ─────────────────────────────────────────────────────────────────

# ✅ Correct — Unsplash with full parameter string
coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"

# ✅ Correct — local file
coverImage: "/images/articles/my-photo.jpg"

# ❌ Wrong — missing query parameters (server fetches 6000px original)
coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b"

# ❌ Wrong — Pexels (may block hotlinking)
coverImage: "https://images.pexels.com/photos/12345/photo.jpeg"


# ── VIDEOS ─────────────────────────────────────────────────────────────────

# ✅ Correct — MDN CC0 (confirmed CORS *, CC0 licence, ~1.1 MB)
coverVideo: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"

# ✅ Correct — Cloudinary free tier (upload your own MP4)
coverVideo: "https://res.cloudinary.com/YOUR-CLOUD-NAME/video/upload/your-video.mp4"

# ✅ Correct — self-hosted in repository
coverVideo: "/videos/articles/my-video.mp4"

# ❌ Wrong — Pexels video (blocks cross-origin <video> requests)
coverVideo: "https://videos.pexels.com/video-files/12345/12345.mp4"

# ❌ Wrong — Google Cloud Storage gtv-videos-bucket (returns HTTP 403)
coverVideo: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"

# ❌ Wrong — unknown CDN with no CORS headers (video will silently fail)
coverVideo: "https://some-random-site.com/nature.mp4"
```
