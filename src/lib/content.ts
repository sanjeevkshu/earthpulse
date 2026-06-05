import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDir = path.join(process.cwd(), 'content');

export type Pillar =
  | 'our-planet'
  | 'through-time'
  | 'human-footprint'
  | 'in-action'
  | 'voices'
  | 'take-action';

export interface ArticleMeta {
  slug: string;
  pillar: Pillar;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  coverImage?: string;
  featured?: boolean;
  readingTime: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

export function getSlugsForPillar(pillar: Pillar): string[] {
  const dir = path.join(contentDir, pillar);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.mdx')).map(f => f.replace(/\.mdx$/, ''));
}

export function getArticle(pillar: Pillar, slug: string): Article | null {
  const filePath = path.join(contentDir, pillar, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug, pillar,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    tags: data.tags ?? [],
    author: data.author ?? 'EarthPulse Editorial',
    coverImage: data.coverImage,
    featured: data.featured ?? false,
    readingTime: rt.text,
    content,
  };
}

export function getAllArticles(pillar?: Pillar): ArticleMeta[] {
  const pillars: Pillar[] = pillar
    ? [pillar]
    : ['our-planet','through-time','human-footprint','in-action','voices','take-action'];
  const articles: ArticleMeta[] = [];
  for (const p of pillars) {
    for (const slug of getSlugsForPillar(p)) {
      const a = getArticle(p, slug);
      if (a) { const { content: _, ...meta } = a; articles.push(meta); }
    }
  }
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedArticles(n = 3): ArticleMeta[] {
  return getAllArticles().filter(a => a.featured).slice(0, n);
}

export function getArticlesByTag(tag: string): ArticleMeta[] {
  return getAllArticles().filter(a => a.tags.includes(tag));
}

export const PILLAR_META: Record<Pillar, { label: string; description: string; icon: string; color: string }> = {
  'our-planet':      { label: 'Our Planet',        description: "Ecosystems, biodiversity, and the living world",     icon: '🌍', color: 'text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300' },
  'through-time':    { label: 'Through Time',       description: "Earth's history and the evolution of life",          icon: '⏳', color: 'text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300' },
  'human-footprint': { label: 'Human Footprint',    description: 'Our impact on the planet today',                    icon: '👣', color: 'text-orange-700 bg-orange-50 dark:bg-orange-950 dark:text-orange-300' },
  'in-action':       { label: 'In Action',           description: 'Initiatives driving positive change',               icon: '⚡', color: 'text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300' },
  'voices':          { label: 'Voices & Research',  description: 'Articles, opinion, and deep dives',                 icon: '✍️', color: 'text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-300' },
  'take-action':     { label: 'Take Action',         description: 'What you can do today',                            icon: '🤝', color: 'text-teal-700 bg-teal-50 dark:bg-teal-950 dark:text-teal-300' },
};
