'use client';

/**
 * BannerImage — full-width contextual banner for pillar and article pages.
 *
 * Accessibility: the container is aria-hidden="true" and alt="" because these
 * banners are purely decorative — the page heading and body text carry all
 * meaningful content. Marking them decorative prevents screen readers from
 * announcing background imagery before the actual page heading.
 *
 * Fallback chain:
 *   1. next/image (server-proxied — no CORS, no referrer leakage to CDN)
 *   2. CSS gradient matching the pillar's design token (if image fails)
 *
 * Props:
 *   priority  — pass true (default) for above-the-fold banners (pillar pages).
 *               pass false for banners that may be below the fold (future use).
 *   showScrim — renders a bottom-to-transparent gradient that blends the banner
 *               into the page background. Default true for pillar pages.
 *               Pass false for article cover images (rounded, self-contained).
 */

import { useState } from 'react';
import Image from 'next/image';

interface BannerImageProps {
  src: string;
  /** Tailwind gradient classes shown when the image fails to load */
  gradientFallback: string;
  /** Applied to the wrapping container */
  className?: string;
  /** true = above-the-fold LCP image; false = defer loading (default: true) */
  priority?: boolean;
  /** Render the bottom scrim that blends banner into page background (default: true) */
  showScrim?: boolean;
}

export default function BannerImage({
  src,
  gradientFallback,
  className = 'relative w-full h-64 md:h-80 overflow-hidden',
  priority = true,
  showScrim = true,
}: BannerImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    // aria-hidden: banner is decorative; page heading provides meaningful context.
    <div className={className} aria-hidden="true">

      {/* Layer 1 — next/image routed through /_next/image proxy.
          alt="" marks the image as decorative (parent is already aria-hidden). */}
      {!failed && (
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority={priority}
          onError={() => setFailed(true)}
        />
      )}

      {/* Layer 2 — CSS gradient fallback when image fails */}
      {failed && (
        <div className={`absolute inset-0 ${gradientFallback}`} />
      )}

      {/* Bottom scrim — blends banner into page background (light + dark mode).
          Only rendered for pillar-style banners; omit for self-contained covers. */}
      {showScrim && (
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
      )}
    </div>
  );
}
