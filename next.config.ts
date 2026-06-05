import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image remotePatterns: only image CDNs (not video CDNs — MP4 cannot
    // be processed by Next.js Image optimisation).
    remotePatterns: [
      // Unsplash CDN — primary source for all banner / hero images.
      // Hotlinking explicitly permitted by Unsplash licence.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Pexels images — allowed for article coverImage frontmatter fields.
      { protocol: 'https', hostname: 'images.pexels.com' },
      // NOTE: videos.pexels.com is intentionally NOT listed here.
      // MP4 video files cannot be processed by Next.js Image optimisation.
      // The Pexels video URL in HERO_MEDIA.videoSrc is fetched directly by
      // the browser <video> element, not through the /_next/image proxy.
    ],
  },
};

export default nextConfig;
