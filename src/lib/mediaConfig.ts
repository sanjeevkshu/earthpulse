/**
 * EarthPulse — Centralised media configuration (v2.3.0)
 *
 * ALL external image and video URLs live here. One place to update if a
 * source changes or a higher-quality alternative becomes available.
 *
 * Image source: Unsplash (images.unsplash.com)
 *   - Explicitly designed for web embedding; hotlinking is permitted and
 *     encouraged. Requests go server-side through Next.js image optimisation
 *     so no browser CORS / referrer issues.
 *   - URL format: https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1920&q=80
 *   - The ?w=1920 parameter caps the source resolution Unsplash delivers to the
 *     Next.js server. Without it, Unsplash sends the original (up to 6000 px+),
 *     wasting server memory. Next.js then re-encodes and serves the appropriate
 *     responsive size per the sizes="100vw" hint in each component.
 *
 * Video source: Pexels (videos.pexels.com) — primary attempt only.
 *   - Pexels video CDN blocks third-party <video> hotlinking via CORS.
 *   - The HeroMedia component catches the load failure and falls back to the
 *     hero still image automatically — the page always looks correct.
 *   - To use a self-hosted or CDN-hosted video instead, replace HERO.videoSrc
 *     with your own MP4 URL (Cloudinary free tier, Bunny.net, etc.).
 *
 * Fallback gradient colours match each pillar's design token.
 */

import type { Pillar } from '@/lib/content';

// ─── Hero (homepage) ────────────────────────────────────────────────────────

export const HERO_MEDIA = {
  /** Primary: looping nature forest video. Falls back to heroImage on error. */
  videoSrc: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',

  /** Shown when video fails or prefers-reduced-motion is active.
   *  Forest canopy — Unsplash photo by Lukasz Szmigiel (ID: jFCViYFYcus) */
  imageSrc: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',

  // Hero image is purely decorative — HeroMedia wraps it with aria-hidden="true".
  // Empty string satisfies next/image alt requirement while correctly marking
  // the image as presentational for assistive technologies.
  imageAlt: '',

  /** Final CSS fallback if image also fails to load */
  gradientFallback: 'bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-950',
} as const;

// ─── Pillar banner images ────────────────────────────────────────────────────
//
// Each image is contextually chosen to represent the pillar topic.
// Unsplash CDN — hotlinking permitted, routed via Next.js image proxy.

export const PILLAR_IMAGES: Record<Pillar, { src: string; alt: string; gradient: string }> = {
  'our-planet': {
    /** Aerial view of Amazon rainforest — Unsplash (ID: nPL6N_2oMaA) */
    src: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=1920&q=80',
    alt: 'Aerial view of a dense tropical rainforest stretching to the horizon',
    gradient: 'bg-gradient-to-br from-green-900 to-emerald-800',
  },
  'through-time': {
    /** Dramatic geological rock strata — Unsplash (ID: 7GX5aICb5i4) */
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    alt: 'Ancient layered rock formations revealing millions of years of geological history',
    gradient: 'bg-gradient-to-br from-amber-900 to-stone-800',
  },
  'human-footprint': {
    /** Industrial smokestacks at dusk — Unsplash (ID: Tl8mDaue_II) */
    src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
    alt: 'Industrial factory smokestacks emitting pollution against a twilight sky',
    gradient: 'bg-gradient-to-br from-orange-900 to-red-950',
  },
  'in-action': {
    /** Wind turbines in a green field — Unsplash (ID: -pO4GuN0Nr4) */
    src: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1920&q=80',
    alt: 'Row of white wind turbines generating clean energy across open green hills',
    gradient: 'bg-gradient-to-br from-blue-900 to-sky-800',
  },
  'voices': {
    /** Open books and research papers in a library — Unsplash (ID: s9CC2SKySJM) */
    src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5898?auto=format&fit=crop&w=1920&q=80',
    alt: 'Open books and research journals spread across a library table',
    gradient: 'bg-gradient-to-br from-purple-900 to-violet-800',
  },
  'take-action': {
    /** Community volunteers planting trees — Unsplash (ID: Of_m3hMsoAA) */
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80',
    alt: 'Group of community volunteers working together outdoors on an environmental project',
    gradient: 'bg-gradient-to-br from-teal-900 to-cyan-800',
  },
};
