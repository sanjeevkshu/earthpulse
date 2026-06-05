import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getArticle, getSlugsForPillar, PILLAR_META, Pillar } from '@/lib/content';
import { PILLAR_IMAGES } from '@/lib/mediaConfig';
import BannerImage from '@/components/ui/BannerImage';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import Tip from '@/components/article/Tip';
import DidYouKnow from '@/components/article/DidYouKnow';
import Impact from '@/components/article/Impact';

const VALID_PILLARS = Object.keys(PILLAR_META) as Pillar[];

type Props = { params: Promise<{ pillar: string; slug: string }> };

export function generateStaticParams() {
  const params: { pillar: string; slug: string }[] = [];
  for (const pillar of VALID_PILLARS) {
    getSlugsForPillar(pillar).forEach(slug => params.push({ pillar, slug }));
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar, slug } = await params;
  const article = getArticle(pillar as Pillar, slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: { title: article.title, description: article.description },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { pillar: pillarParam, slug } = await params;
  const pillar = pillarParam as Pillar;
  if (!VALID_PILLARS.includes(pillar)) notFound();
  const article = getArticle(pillar, slug);
  if (!article) notFound();
  const pillarMeta = PILLAR_META[pillar];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${pillar}`} className="hover:text-brand-400 transition-colors">{pillarMeta.label}</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300 truncate">{article.title}</span>
      </nav>

      {/* Cover image — 3-layer fallback chain:
          1. article.coverImage  — author's specific image from frontmatter
          2. PILLAR_IMAGES[pillar].src — pillar contextual image when coverImage is absent
          3. PILLAR_IMAGES[pillar].gradient — CSS fallback inside BannerImage onError
          Authors can always override by setting coverImage in frontmatter.
          priority={false}: sits below the breadcrumb nav, not the LCP element.
          showScrim={false}: rounded-xl card style; no page-blend scrim needed. */}
      <BannerImage
        src={article.coverImage || PILLAR_IMAGES[pillar].src}
        gradientFallback={PILLAR_IMAGES[pillar].gradient}
        className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl mb-8"
        priority={false}
        showScrim={false}
      />

      {/* Article header */}
      <header className="mb-10">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mb-4 ${pillarMeta.color}`}>
          {pillarMeta.icon} {pillarMeta.label}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{article.title}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{article.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 border-y border-gray-100 dark:border-gray-800 py-4">
          <span className="font-medium text-gray-700 dark:text-gray-300">{article.author}</span>
          {article.date && <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>}
          <span>{article.readingTime}</span>
        </div>
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map(t => (
              <Link key={t} href={`/tag/${t}`} className="tag hover:bg-brand-100 dark:hover:bg-brand-700 transition-colors">#{t}</Link>
            ))}
          </div>
        )}
      </header>

      {/* MDX body — callout components registered here */}
      <article className="prose-custom">
        <MDXRemote source={article.content} components={{ Tip, DidYouKnow, Impact }} />
      </article>

      <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
        <Link href={`/${pillar}`} className="text-sm text-brand-600 dark:text-brand-300 font-medium hover:underline">
          ← Back to {pillarMeta.label}
        </Link>
      </div>
    </div>
  );
}
