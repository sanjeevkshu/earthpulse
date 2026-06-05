'use client';

/**
 * HeroMedia — full-bleed video/image background for the homepage hero.
 *
 * ── Fallback chain ─────────────────────────────────────────────────────────
 * Layer 1 — <video>   Autoplay MP4. Skipped entirely on prefers-reduced-motion.
 * Layer 2 — <Image>   Unsplash still photo via Next.js proxy (no CORS/referrer).
 *                     Only mounted when video is not active, so it is never
 *                     fetched unnecessarily while the video plays.
 * Layer 3 — gradient  Pure CSS; zero external dependencies; always in the DOM.
 *
 * ── Accessibility ──────────────────────────────────────────────────────────
 * All three layers are aria-hidden="true" — they are decorative backgrounds.
 * The meaningful hero content (heading, subtitle, CTAs) is rendered by the
 * parent page component above the media layers with relative z-10.
 *
 * The video element carries aria-hidden plus muted+playsInline for browser
 * autoplay compliance. prefers-reduced-motion is handled at two levels:
 *   1. CSS  motion-reduce:hidden — immediate, before JavaScript runs.
 *   2. JS   reducedMotion state  — prevents mounting the element entirely
 *           once the preference is confirmed, freeing resources.
 *
 * ── Performance ────────────────────────────────────────────────────────────
 * The Image layer is only mounted (and therefore only fetched) when needed
 * (video failed or reduced-motion active). While the video plays, no image
 * request is made. The video's poster attribute (direct Unsplash URL) covers
 * the visual gap before the video starts, so there is no blank-frame flash.
 * sizes="100vw" tells Next.js Image the display width so it can generate and
 * serve the correct responsive srcset entry for each viewport.
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HERO_MEDIA } from '@/lib/mediaConfig';

export default function HeroMedia() {
  const [videoFailed, setVideoFailed]   = useState(false);
  const [imageFailed, setImageFailed]   = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion on the client.
  // Initialises to false (SSR-safe; avoids hydration mismatch).
  // CSS motion-reduce:hidden on the <video> element handles the visual
  // state before this effect fires, so reduced-motion users never see the
  // video even during the brief JS initialisation window.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // The image layer is needed when video is bypassed (reduced-motion) or failed.
  // It is NOT rendered while the video plays successfully — this prevents
  // a wasted high-priority image fetch during normal video playback.
  const showImageLayer = reducedMotion || videoFailed;

  return (
    <>
      {/* ── Layer 1: Video ──────────────────────────────────────────────────
          Not mounted at all after reducedMotion is confirmed by JS.
          motion-reduce:hidden handles the CSS-level suppression before JS runs.
          poster= shows the still image while the video file loads, preventing
          a blank-frame flash on slow connections. */}
      {!reducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          onError={() => setVideoFailed(true)}
          poster={HERO_MEDIA.imageSrc}
        >
          <source src={HERO_MEDIA.videoSrc} type="video/mp4" />
        </video>
      )}

      {/* ── Layer 2: Still image ────────────────────────────────────────────
          Mounted only when showImageLayer is true (reduced-motion or video failed).
          Routes through /_next/image proxy — no browser CORS / referrer issues.
          aria-hidden: decorative background; alt="" per WCAG decorative image rule.
          sizes="100vw": informs Next.js of display width for correct srcset entry. */}
      {showImageLayer && !imageFailed && (
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={HERO_MEDIA.imageSrc}
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
          Always in the DOM. Visible only when the image also fails.
          No external dependencies — guaranteed to render in all conditions. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${HERO_MEDIA.gradientFallback} transition-opacity duration-500 ${
          imageFailed ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}
