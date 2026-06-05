/**
 * src/lib/pages.ts — MDX loader for static site pages.
 *
 * Mirrors the pattern of src/lib/content.ts but targets content/pages/ instead
 * of content/[pillar]/. These are single-file "about-style" pages that are
 * authored in MDX and rendered with PageHero + MDXRemote, exactly like pillar
 * article pages — hence "load them as Pillar pages."
 *
 * Design config (gradient, videoSrc) lives here rather than in MDX frontmatter.
 * Content authors should only manage title, description, icon, coverImage, date.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NATURE_VIDEO_SRC } from '@/lib/mediaConfig';

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

// ── Per-page design tokens ─────────────────────────────────────────────────
// Gradient and video source are design decisions, not content decisions.
// Authors set title/description/coverImage in frontmatter; the rest lives here.

const PAGE_CONFIG: Record<string, { gradient: string; videoSrc: string }> = {
  about: {
    gradient: 'bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-950',
    videoSrc: NATURE_VIDEO_SRC,
  },
  contribute: {
    gradient: 'bg-gradient-to-br from-purple-900 to-violet-800',
    videoSrc: NATURE_VIDEO_SRC,
  },
  newsletter: {
    gradient: 'bg-gradient-to-br from-teal-900 to-cyan-800',
    videoSrc: NATURE_VIDEO_SRC,
  },
  privacy: {
    gradient: 'bg-gradient-to-br from-slate-900 to-gray-800',
    videoSrc: NATURE_VIDEO_SRC,
  },
};

// ── Types ──────────────────────────────────────────────────────────────────

export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  /** ISO date string — used for "last updated" on legal/policy pages */
  date?: string;
  /** Emoji icon shown as a badge above the hero title */
  icon?: string;
  /** Unsplash cover image URL — auto-resolved to the gradient if absent */
  coverImage?: string;
  /** Tailwind gradient fallback when coverImage fails — from PAGE_CONFIG */
  gradientFallback: string;
  /** MP4 video source for hover/touch video on PageHero — from PAGE_CONFIG */
  videoSrc: string;
  /** Raw MDX string — passed directly to MDXRemote */
  content: string;
}

// ── Loader ─────────────────────────────────────────────────────────────────

export function getStaticPage(slug: string): StaticPage | null {
  const filePath = path.join(PAGES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const config = PAGE_CONFIG[slug] ?? {
    gradient: 'bg-gradient-to-br from-brand-900 to-emerald-950',
    videoSrc: NATURE_VIDEO_SRC,
  };

  return {
    slug,
    title:       data.title       ?? '',
    description: data.description ?? '',
    date:        data.date,
    icon:        data.icon,
    coverImage:  data.coverImage,
    gradientFallback: config.gradient,
    videoSrc:    config.videoSrc,
    content,
  };
}

/** List all slugs in content/pages/ — used by any future sitemap generation. */
export function getAllPageSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''));
}
