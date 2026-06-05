'use client';

/**
 * HeroMedia — full-bleed video/image background for the homepage hero.
 *
 * ── Dynamic session rotation ────────────────────────────────────────────────
 * On each new browser session a random entry is chosen from HERO_MEDIA_POOL.
 * The chosen index is stored in sessionStorage under 'ep-hero-idx' so the
 * same media plays consistently throughout the session, but changes when the
 * user opens a new tab or returns on a new day.
 *
 * ── Fallback chain ─────────────────────────────────────────────────────────
 * Layer 1 — <video>   Autoplay MP4 from the selected pool entry.
 *                     Skipped entirely on prefers-reduced-motion.
 * Layer 2 — <Image>   Still photo from the pool entry, via Next.js proxy.
 *                     Only mounted when needed (video failed / reduced-motion).
 * Layer 3 — gradient  Pure CSS; always in DOM; visible only when image fails.
 *
 * ── Accessibility ──────────────────────────────────────────────────────────
 * All three layers are aria-hidden — decorative backgrounds.
 * Meaningful hero content (heading, subtitle, CTAs) is in the parent page.tsx
 * with relative z-10, always readable through the dark scrim.
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HERO_MEDIA_POOL, HERO_GRADIENT_FALLBACK } from '@/lib/mediaConfig';

const SESSION_KEY = 'ep-hero-idx';

export default function HeroMedia() {
  // Pool index — starts at 0 for SSR, updated in useEffect from sessionStorage.
  // This avoids hydration mismatch: server and first client render both use 0,
  // then the correct session index loads after hydration with no visible flash
  // (all entries are nature images of similar brightness — the swap is seamless).
  const [poolIndex, setPoolIndex] = useState(0);
  const [videoFailed, setVideoFailed]   = useState(false);
  const [imageFailed, setImageFailed]   = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Resolve session pool index
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored !== null) {
      setPoolIndex(parseInt(stored, 10) % HERO_MEDIA_POOL.length);
    } else {
      const idx = Math.floor(Math.random() * HERO_MEDIA_POOL.length);
      sessionStorage.setItem(SESSION_KEY, String(idx));
      setPoolIndex(idx);
    }

    // Resolve prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const media = HERO_MEDIA_POOL[poolIndex];

  // Show the image layer when there is no video to show:
  //   - this pool entry has no videoSrc (entries 1-4), OR
  //   - user prefers reduced-motion, OR
  //   - the video failed to load (CORS / network error)
  // Without this, entries 1-4 render nothing — all three layers invisible.
  const hasVideo = !reducedMotion && !!media.videoSrc;
  const showImageLayer = !hasVideo || videoFailed;

  return (
    <>
      {/* ── Layer 1: Video ──────────────────────────────────────────────────
          Not mounted when reduced-motion is active.
          motion-reduce:hidden suppresses it visually before JS fires.
          poster= provides the still image while the video file downloads. */}
      {!reducedMotion && media.videoSrc && (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          onError={() => setVideoFailed(true)}
          poster={media.imageSrc}
        >
          <source src={media.videoSrc} type="video/mp4" />
        </video>
      )}

      {/* ── Layer 2: Still image ────────────────────────────────────────────
          Mounted only when needed — avoids forcing a priority fetch while the
          video is playing successfully. */}
      {showImageLayer && !imageFailed && (
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={media.imageSrc}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
            onError={() => setImageFailed(true)}
          />
        </div>
      )}

      {/* ── Layer 3: CSS gradient ───────────────────────────────────────────
          No external dependencies; always renders; visible only when image fails. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${HERO_GRADIENT_FALLBACK} transition-opacity duration-500 ${
          imageFailed ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}
