import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image remotePatterns: only image CDNs (not video CDNs — MP4 cannot
    // be processed by Next.js Image optimisation).
    remotePatterns: [
      // Unsplash CDN — primary source for all banner / hero images.
      // Hotlinking explicitly permitted by Unsplash licence.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Pexels images — reserved safety net; no current content uses Pexels images
      // but kept so any author who supplies a Pexels coverImage URL is not blocked.
      { protocol: 'https', hostname: 'images.pexels.com' },
      // NOTE: videos.pexels.com is intentionally NOT listed here.
      // MP4 files cannot be processed by Next.js Image optimisation.
      // Videos are fetched directly by the browser <video> element from the
      // video CDN (currently storage.googleapis.com) — not proxied through /_next/image.
      // The video CDN must serve Access-Control-Allow-Origin: * independently.
    ],
  },
};

export default nextConfig;
