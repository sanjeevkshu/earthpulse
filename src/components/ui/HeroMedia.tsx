'use client';

/**
 * HeroMedia — full-bleed video/image background for the homepage hero.
 *
 * ── Dynamic session rotation ────────────────────────────────────────────────
 * On each new browser session a random entry is chosen from HERO_MEDIA_POOL.
 * The chosen index is stored in sessionStorage under 'ep-hero-idx' so the
 * same media plays consistently throughout the session.
 *
 * ── Media layers (bottom to top in DOM — later = visually in front) ─────────
 * Layer 1 — gradient   Pure CSS; always visible; shown when image fails.
 * Layer 2 — <video>    autoPlay MP4. Mounts when not reduced-motion.
 * Layer 3 — <Image>    Unsplash still photo via Next.js proxy.
 *                      ALWAYS rendered as the guaranteed visual baseline.
 *                      Fades to transparent when the video is confirmed playing
 *                      (onPlay event); instantly reappears on video error/pause.
 *
 * ── Why image is always rendered (changed from conditional mount) ────────────
 * The previous design only mounted the image when the video was absent or failed.
 * The video's `poster` attribute was the only background while the video loaded.
 * Problem: `poster` is a direct browser→CDN fetch with no guarantee of timing;
 * some browsers skip it entirely before the first frame loads. If the video took
 * even 200ms to buffer, the hero was visually empty.
 * Solution: always mount the next/image layer. It loads via the /_next/image
 * server proxy (guaranteed fast, no CORS issues) and acts as an instant
 * background. The video fades in over it via opacity transition.
 *
 * ── Accessibility ──────────────────────────────────────────────────────────
 * All three layers are aria-hidden — decorative backgrounds.
 * Meaningful hero content is in page.tsx with z-10 above the scrim.
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HERO_MEDIA_POOL, HERO_GRADIENT_FALLBACK } from '@/lib/mediaConfig';

const SESSION_KEY = 'ep-hero-idx';

export default function HeroMedia() {
  const [poolIndex, setPoolIndex]         = useState(0);
  const [videoPlaying, setVideoPlaying]   = useState(false);
  const [imageFailed, setImageFailed]     = useState(false);
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
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const media = HERO_MEDIA_POOL[poolIndex];

  return (
    <>
      {/* ── Layer 1: CSS gradient ───────────────────────────────────────────
          Always present; opacity-0 until image fails. Zero external dependencies. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${HERO_GRADIENT_FALLBACK} transition-opacity duration-500 ${
          imageFailed ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* ── Layer 2: Video ──────────────────────────────────────────────────
          autoPlay + muted + playsInline for cross-browser autoplay compliance.
          Not mounted when reduced-motion is active.
          onPlay confirms actual playback → fades the image layer out.
          onPause / onError → restore image layer immediately. */}
      {!reducedMotion && media.videoSrc && (
        <video
          src={media.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          onPlay={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
          onError={() => setVideoPlaying(false)}
          // src on <video> (not <source> child): onError fires reliably when
          // the URL returns 4xx/5xx. With <source>, error fires on <source>
          // element only and does NOT bubble to <video> onError.
        />
      )}

      {/* ── Layer 3: Still image — guaranteed visual baseline ───────────────
          Always rendered (not conditional). Provides instant background while
          the video is loading or when no videoSrc exists. Fades to transparent
          once the video confirms it is playing (onPlay event). */}
      {!imageFailed && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ${
            videoPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        >
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
    </>
  );
}
