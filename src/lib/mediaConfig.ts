/**
 * EarthPulse — Centralised media configuration (v2.4.0)
 *
 * ALL external image and video URLs live here. One place to update if a
 * source changes or a higher-quality alternative becomes available.
 *
 * ── CORS strategy: images and videos are handled differently ─────────────────
 *
 * IMAGES — CORS is NOT a browser concern.
 *   next/image acts as a server-side proxy: the browser requests
 *   /_next/image?url=... from our own domain, and the Next.js server fetches
 *   the image from Unsplash server-to-server. The browser never makes a
 *   cross-origin request to the image CDN, so Unsplash's CORS/hotlink policy
 *   is irrelevant to the browser. Any image CDN accessible by the server works.
 *   We chose Unsplash because hotlinking is explicitly permitted, the CDN is
 *   reliable, and images are high quality and contextually appropriate.
 *   Source: Unsplash (images.unsplash.com)
 *   Format: https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1920&q=80
 *   Note: ?w=1920 caps the source resolution. Without it, Unsplash delivers the
 *   full original (up to 6000 px+); Next.js then re-encodes for each viewport.
 *
 * VIDEOS — CORS IS a browser concern.
 *   <video> elements make direct HTTP requests from the browser to the video CDN.
 *   next/image cannot proxy video files (streaming semantics, file size).
 *   The browser attaches Origin and Referer headers; if the CDN returns
 *   restrictive CORS headers the browser silently blocks playback.
 *   Therefore: every video URL used here MUST be served by a CDN that returns
 *   Access-Control-Allow-Origin: * (or at minimum our domain).
 *
 *   ✅ Google Cloud Storage public buckets — serves Access-Control-Allow-Origin: *
 *   ✅ Cloudinary (free tier) — configurable CORS, default permissive
 *   ✅ Bunny.net CDN — CORS-enabled by default
 *   ✅ Self-hosted on Vercel/Railway/Fly — same origin, no CORS
 *   ❌ Pexels video CDN (videos.pexels.com) — blocks cross-origin <video> requests
 *   ❌ Any CDN that returns Access-Control-Allow-Origin: <pexels.com> only
 *
 *   Current video source: Google Cloud Storage public sample bucket.
 *   Replace NATURE_VIDEO_SRC with your own CDN URL for production.
 *
 * Fallback gradient colours match each pillar's design token.
 *
 * ── Scope of this file ─────────────────────────────────────────────────────
 * This file manages STRUCTURAL media — images and video that are part of the
 * site's UI design (hero section, pillar index banners).
 *
 * CONTENT media (article cover images) live in MDX frontmatter as `coverImage`
 * fields. That is the correct location because:
 *   - Cover images are article-specific editorial choices, not UI design
 *   - Authors control them alongside the article text
 *   - They travel with the content in Git, not with the component code
 *
 * When a new article is authored, add a `coverImage` Unsplash URL to its
 * frontmatter following the pattern in existing seed articles. The
 * PageHero component in [slug]/page.tsx renders it automatically and
 * falls back through ARTICLE_MEDIA_TAGS → PILLAR_IMAGES → gradient.
 */

import type { Pillar } from '@/lib/content';

// ─── Hero media pool — session rotation ─────────────────────────────────────
//
// Each browser session picks one entry at random (stored in sessionStorage so
// the choice is stable within a session but fresh on the next visit).
// Add more entries here to increase variety.

export interface HeroMediaEntry {
  /** Direct MP4 URL. MUST be served by a CORS-enabled CDN (Access-Control-Allow-Origin: *).
   *  Videos cannot go through the next/image proxy — the browser fetches them directly.
   *  If the video fails (wrong URL, CDN outage), HeroMedia falls back to imageSrc automatically. */
  videoSrc?: string;
  /** Unsplash still photo — used as video poster and as the static fallback. */
  imageSrc: string;
  /** Human-readable label for debugging / analytics. */
  label: string;
}

// Shared MP4 source used across pool entries and pillar pages.
// Source: MDN Web Docs CC0 sample media library.
//   URL:    https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4
//   Size:   ~1.1 MB (fast to buffer)
//   CORS:   Access-Control-Allow-Origin: * (confirmed)
//   Licence: CC0 public domain
//   Content: close-up nature footage of a flower — appropriate for EarthPulse
//
// Replace with your own CDN URL (Cloudinary, Bunny.net, self-hosted) for production
// if you want a longer, higher-resolution nature clip.
//
// NOTE: videos.pexels.com and storage.googleapis.com/gtv-videos-bucket both
// return 403 for cross-origin requests — do not use them as video sources.
export const NATURE_VIDEO_SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export const HERO_MEDIA_POOL: HeroMediaEntry[] = [
  {
    videoSrc: NATURE_VIDEO_SRC,
    imageSrc: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    label: 'Forest canopy',
  },
  {
    videoSrc: NATURE_VIDEO_SRC,
    imageSrc: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=80',
    label: 'Open ocean',
  },
  {
    videoSrc: NATURE_VIDEO_SRC,
    imageSrc: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80',
    label: 'Mountain landscape at dawn',
  },
  {
    videoSrc: NATURE_VIDEO_SRC,
    imageSrc: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80',
    label: 'Arctic wilderness',
  },
  {
    videoSrc: NATURE_VIDEO_SRC,
    imageSrc: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=1920&q=80',
    label: 'Underwater world',
  },
];

/** CSS gradient shown when ALL media entries in the pool fail. */
export const HERO_GRADIENT_FALLBACK =
  'bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-950';

// ─── Pillar banner images ────────────────────────────────────────────────────
//
// Each image is contextually chosen to represent the pillar topic.
// videoSrc is optional — set to a reliable MP4 URL to enable the hybrid
// hover/touch video feature on the pillar PageHero.

export interface PillarMedia {
  src: string;
  alt: string;
  gradient: string;
  /** Optional MP4 — enables hover/touch video on the pillar PageHero. */
  videoSrc?: string;
}

export const PILLAR_IMAGES: Record<Pillar, PillarMedia> = {
  'our-planet': {
    src: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=1920&q=80',
    alt: 'Aerial view of a dense tropical rainforest stretching to the horizon',
    gradient: 'bg-gradient-to-br from-green-900 to-emerald-800',
    videoSrc: NATURE_VIDEO_SRC,
  },
  'through-time': {
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    alt: 'Ancient layered rock formations revealing millions of years of geological history',
    gradient: 'bg-gradient-to-br from-amber-900 to-stone-800',
    videoSrc: NATURE_VIDEO_SRC,
  },
  'human-footprint': {
    src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
    alt: 'Industrial factory smokestacks emitting pollution against a twilight sky',
    gradient: 'bg-gradient-to-br from-orange-900 to-red-950',
    videoSrc: NATURE_VIDEO_SRC,
  },
  'in-action': {
    src: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1920&q=80',
    alt: 'Row of white wind turbines generating clean energy across open green hills',
    gradient: 'bg-gradient-to-br from-blue-900 to-sky-800',
    videoSrc: NATURE_VIDEO_SRC,
  },
  'voices': {
    src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5898?auto=format&fit=crop&w=1920&q=80',
    alt: 'Open books and research journals spread across a library table',
    gradient: 'bg-gradient-to-br from-purple-900 to-violet-800',
    videoSrc: NATURE_VIDEO_SRC,
  },
  'take-action': {
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80',
    alt: 'Group of community volunteers working together outdoors on an environmental project',
    gradient: 'bg-gradient-to-br from-teal-900 to-cyan-800',
    videoSrc: NATURE_VIDEO_SRC,
  },
};

// ─── Article cover image — tag-based resolution ──────────────────────────────
//
// Maps common EarthPulse topic tags to contextually appropriate Unsplash images.
// Used by resolveCoverImage() to automatically assign a meaningful cover to any
// article that does not have an explicit `coverImage` in its frontmatter.
// Authors can always override by setting coverImage in frontmatter.

export const ARTICLE_MEDIA_TAGS: Record<string, string> = {
  'oceans':        'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=80',
  'biodiversity':  'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1920&q=80',
  'climate':       'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1920&q=80',
  'ecosystems':    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=1920&q=80',
  'forests':       'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
  'agriculture':   'https://images.unsplash.com/photo-1500651066252-4cf5069d4be1?auto=format&fit=crop&w=1920&q=80',
  'food systems':  'https://images.unsplash.com/photo-1500651066252-4cf5069d4be1?auto=format&fit=crop&w=1920&q=80',
  'deforestation': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
  'policy':        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1920&q=80',
  'government':    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1920&q=80',
  'conservation':  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80',
  'sustainability':'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1920&q=80',
  'evolution':     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
  'geology':       'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
  'history':       'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
  'extinction':    'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1920&q=80',
  'science':       'https://images.unsplash.com/photo-1481627834876-b7833e8f5898?auto=format&fit=crop&w=1920&q=80',
  'action':        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80',
  'lifestyle':     'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1920&q=80',
};

/**
 * Resolve the best available cover image for an article.
 *
 * Priority chain (server-side, pure function):
 *   1. article.coverImage  — explicit author choice in frontmatter
 *   2. ARTICLE_MEDIA_TAGS  — first matching tag produces a contextual image
 *   3. PILLAR_IMAGES       — pillar-level fallback, always resolves
 *
 * Called from the article page server component so no client JS is needed.
 */
export function resolveCoverImage(
  coverImage: string | undefined,
  tags: string[],
  pillar: Pillar,
): string {
  if (coverImage) return coverImage;
  for (const tag of tags) {
    if (ARTICLE_MEDIA_TAGS[tag]) return ARTICLE_MEDIA_TAGS[tag];
  }
  return PILLAR_IMAGES[pillar].src;
}
