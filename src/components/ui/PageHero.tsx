'use client';

/**
 * PageHero — full-bleed hybrid hero for pillar and article pages.
 *
 * ── Media behaviour ─────────────────────────────────────────────────────────
 * - Image always renders as the guaranteed background baseline (next/image proxy,
 *   no CORS issues). Video fades in over it when playing.
 * - Video is NOT downloaded until the user first hovers (desktop) or touches
 *   (mobile). The <video autoPlay> element is mounted WITH the autoPlay attribute
 *   during the user gesture (onMouseEnter / onTouchStart), so the browser counts
 *   the DOM insertion itself as user-initiated and plays immediately — no async
 *   .play() call needed, no autoplay policy rejection.
 * - When interaction ends: video pauses, image fades back in.
 * - IntersectionObserver: video pauses when >85% scrolled out of viewport.
 * - prefers-reduced-motion: video never mounts; image-only mode.
 *
 * ── Why autoPlay on the lazy element works ──────────────────────────────────
 * Browsers require .play() to be synchronous with a user gesture. The previous
 * handleCanPlay approach called .play() inside an async canplay event — the
 * browser's gesture window had already closed, so it rejected the call silently.
 * Mounting <video autoPlay> inside onMouseEnter is synchronous from the browser's
 * perspective, satisfying the user-activation requirement.
 *
 * ── Fallback chain ──────────────────────────────────────────────────────────
 * 1. imageSrc   — next/image via /_next/image proxy; always rendered as baseline.
 * 2. gradient   — CSS-only fallback when imageSrc fails (onError).
 * Video is opt-in (videoSrc prop); if absent, hero is image-only with no degradation.
 *
 * ── Accessibility ───────────────────────────────────────────────────────────
 * - All media layers are aria-hidden (decorative).
 * - <h1> inside the overlay is the page heading — correct semantic structure.
 * - prefers-reduced-motion respected: video never mounts, image shown always.
 * - Scrim ensures WCAG AA contrast for white text in all media states.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface PageHeroProps {
  imageSrc: string;
  videoSrc?: string;
  gradientFallback: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  height?: string;
}

export default function PageHero({
  imageSrc,
  videoSrc,
  gradientFallback,
  title,
  subtitle,
  badge,
  breadcrumb,
  height = 'min-h-[80vh]',
}: PageHeroProps) {
  const [imageFailed,  setImageFailed]  = useState(false);
  const [videoMounted, setVideoMounted] = useState(false);
  const [videoActive,  setVideoActive]  = useState(false);
  const [videoFailed,  setVideoFailed]  = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);

  const containerRef = useRef<HTMLElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);

  // ── prefers-reduced-motion ─────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // ── IntersectionObserver — pause when scrolled away ────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
          setVideoActive(false);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Interaction handlers ───────────────────────────────────────────────────
  const startVideo = useCallback(() => {
    if (!videoSrc || reducedMotion || videoFailed) return;
    if (!videoMounted) {
      // First interaction: mount the <video autoPlay> element.
      // Because this state update runs inside onMouseEnter / onTouchStart,
      // the browser considers the resulting DOM insertion user-initiated and
      // allows autoPlay without a separate .play() call.
      setVideoMounted(true);
    } else if (videoRef.current && inView) {
      // Subsequent interactions: video is already in DOM, resume playback.
      videoRef.current.play().catch(() => setVideoFailed(true));
    }
  }, [videoSrc, reducedMotion, videoFailed, videoMounted, inView]);

  const stopVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setVideoActive(false);
    }
  }, []);

  const canInteract = !!videoSrc && !videoFailed && !reducedMotion;

  return (
    <section
      ref={containerRef}
      className={`relative ${height} overflow-hidden`}
      onMouseEnter={startVideo}
      onMouseLeave={stopVideo}
      onTouchStart={startVideo}
      onTouchEnd={stopVideo}
    >
      {/* ── Layer 1: CSS gradient (deepest fallback) ───────────────────────── */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${gradientFallback} transition-opacity duration-500 ${
          imageFailed ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* ── Layer 2: Video (lazy — not in DOM until first interaction) ──────────
          Mounted with autoPlay so the browser plays immediately on DOM insertion
          (which is synchronous with the user gesture). onPlay / onPause track
          actual playback state to drive the image opacity transition. */}
      {videoMounted && videoSrc && !videoFailed && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          poster={imageSrc}
          onPlay={() => setVideoActive(true)}
          onPause={() => setVideoActive(false)}
          onError={() => { setVideoFailed(true); setVideoActive(false); }}
          // src on <video> (not <source> child): onError fires reliably when
          // the URL returns 4xx/5xx. With <source>, error fires on <source>
          // only and does NOT propagate to <video> onError.
        />
      )}

      {/* ── Layer 3: Still image — always rendered as the baseline background ──
          Fades to transparent when video is playing; instantly visible otherwise.
          Routing through /_next/image proxy removes CORS / referrer concerns.
          This guarantees a visual background even before the video loads. */}
      {!imageFailed && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            videoActive ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
            onError={() => setImageFailed(true)}
          />
        </div>
      )}

      {/* ── Dark scrim — always above media ───────────────────────────────────
          Top: darker for breadcrumb. Centre: light. Bottom: dark for title. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/75"
      />

      {/* ── Content overlay ───────────────────────────────────────────────────
          absolute inset-0: stable position independent of any state changes. */}
      <div className="absolute inset-0 z-10 flex flex-col">

        {/* Breadcrumb — top-left */}
        {breadcrumb && (
          <div className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
            {breadcrumb}
          </div>
        )}

        {/* Spacer — pushes title to bottom */}
        <div className="flex-1 min-h-[4rem]" />

        {/* Title block — bottom-left */}
        <div className="px-4 sm:px-6 lg:px-8 pb-10 md:pb-14 max-w-4xl">
          {badge && <div className="mb-3">{badge}</div>}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl leading-relaxed drop-shadow">
              {subtitle}
            </p>
          )}

          {/* Hint — always rendered when a videoSrc exists so its height never
              causes a layout shift. Visibility is controlled by opacity only,
              never by conditional mounting. */}
          {videoSrc && !reducedMotion && (
            <p
              className={`mt-4 inline-flex items-center gap-1.5 text-xs select-none
                transition-opacity duration-300 ${videoFailed ? 'opacity-0' : 'text-white/50'}`}
              aria-hidden="true"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Hover or touch to play
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
