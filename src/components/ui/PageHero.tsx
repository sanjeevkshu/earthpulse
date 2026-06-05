'use client';

/**
 * PageHero — full-bleed hybrid hero for pillar and article pages.
 *
 * ── Media behaviour ─────────────────────────────────────────────────────────
 * - Static image on load (image is always present and is the default state).
 * - Video is NOT downloaded until the user first hovers (desktop) or touches
 *   (mobile). This lazy approach saves bandwidth for users who never interact.
 * - When interaction starts: video is mounted, plays, and the image cross-fades
 *   out smoothly via opacity transition.
 * - When interaction ends: video pauses and the image cross-fades back in.
 * - IntersectionObserver: when the hero is >85% scrolled out of view the video
 *   pauses and the image resumes. Resuming interaction replays the video.
 * - prefers-reduced-motion: video is never mounted; image-only mode.
 *
 * ── Fallback chain ──────────────────────────────────────────────────────────
 * 1. imageSrc   — next/image via /_next/image proxy (no CORS / referrer).
 * 2. gradient   — CSS-only, shown via onError if the image fails.
 * Video is opt-in (videoSrc prop); absence = image-only, no degradation.
 *
 * ── Overlay layout ──────────────────────────────────────────────────────────
 * ┌───────────────────────────────────────────────────┐
 * │ [breadcrumb]                                      │  ← top-left
 * │                                                   │
 * │             (image / video)                       │
 * │                                                   │
 * │ [badge]                                           │  ← bottom-left
 * │ [title]                                           │
 * │ [subtitle]                                        │
 * │ [video hint — only when videoSrc is set]          │
 * └───────────────────────────────────────────────────┘
 *
 * ── Accessibility ───────────────────────────────────────────────────────────
 * - Background media layers are all aria-hidden (decorative).
 * - <h1> inside the overlay is the page heading — semantically correct.
 * - Video and image alt="" marks them as decorative per WCAG.
 * - prefers-reduced-motion respected at CSS + JS levels.
 * - Scrim guarantees WCAG AA contrast for white text in all media states.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface PageHeroProps {
  /** Primary still image — always loaded; shown by default and as video fallback. */
  imageSrc: string;
  /** Optional MP4 — enables hover/touch video. If absent the hero is image-only. */
  videoSrc?: string;
  /** Tailwind gradient classes shown when imageSrc fails (CSS-only fallback). */
  gradientFallback: string;
  /** Page h1 — overlaid bottom-left on the banner. */
  title: string;
  /** Subtitle — overlaid below the title. */
  subtitle?: string;
  /** Optional badge (e.g. pillar chip) — overlaid above the title. */
  badge?: React.ReactNode;
  /** Optional breadcrumb — overlaid top-left. Expects white-friendly styling. */
  breadcrumb?: React.ReactNode;
  /** Tailwind height class. Default: min-h-[80vh]. */
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
  const [videoMounted, setVideoMounted] = useState(false); // lazy — mount on 1st interaction
  const [videoActive,  setVideoActive]  = useState(false); // true while video is playing
  const [videoFailed,  setVideoFailed]  = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);

  const containerRef = useRef<HTMLElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const didAutoPlay  = useRef(false); // guard — only auto-play once after mount

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
      setVideoMounted(true); // triggers video element mount; onCanPlay fires play
    } else if (videoRef.current && inView) {
      videoRef.current.play()
        .then(() => setVideoActive(true))
        .catch(() => { setVideoFailed(true); setVideoActive(false); });
    }
  }, [videoSrc, reducedMotion, videoFailed, videoMounted, inView]);

  const stopVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setVideoActive(false);
    }
  }, []);

  // ── Auto-play on first canPlay event after lazy mount ─────────────────────
  const handleCanPlay = useCallback(() => {
    if (didAutoPlay.current || !inView || reducedMotion) return;
    didAutoPlay.current = true;
    videoRef.current?.play()
      .then(() => setVideoActive(true))
      .catch(() => { setVideoFailed(true); setVideoActive(false); });
  }, [inView, reducedMotion]);

  const canInteract = !!videoSrc && !videoFailed && !reducedMotion;

  return (
    <section
      ref={containerRef}
      className={`relative ${height} flex flex-col overflow-hidden`}
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

      {/* ── Layer 2: Video (lazy — not in DOM until first interaction) ──────── */}
      {videoMounted && videoSrc && !videoFailed && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          poster={imageSrc}
          onCanPlay={handleCanPlay}
          onError={() => { setVideoFailed(true); setVideoActive(false); }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* ── Layer 3: Still image (above video — fades to reveal video beneath) ─
          The image is ABOVE the video in DOM order so opacity-0 reveals the
          video layer beneath — no z-index needed. */}
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

      {/* ── Dark scrim — always above media, ensures text legibility ──────────
          Top: darker for breadcrumb. Centre: light to show the image. Bottom: dark for title. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/75"
      />

      {/* ── Content overlay ───────────────────────────────────────────────────
          min-h-[inherit] passes the parent's min-height so flex layout fills the section. */}
      <div className="relative z-10 flex flex-col w-full" style={{ minHeight: 'inherit' }}>

        {/* Breadcrumb — top-left ─────────────────────────────────────────── */}
        {breadcrumb && (
          <div className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
            {breadcrumb}
          </div>
        )}

        {/* Spacer — pushes title block to bottom */}
        <div className="flex-1 min-h-[4rem]" />

        {/* Title block — bottom-left ─────────────────────────────────────── */}
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

          {/* Video interaction hint — only shown when a video source is available */}
          {canInteract && (
            <p
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/50 select-none"
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
