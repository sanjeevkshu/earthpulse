import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getArticle, getSlugsForPillar, PILLAR_META, Pillar } from '@/lib/content';
import { PILLAR_IMAGES, resolveCoverImage, resolveCoverVideo } from '@/lib/mediaConfig';
import PageHero from '@/components/ui/PageHero';
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

  const article    = getArticle(pillar, slug);
  if (!article) notFound();

  const pillarMeta = PILLAR_META[pillar];
  const media      = PILLAR_IMAGES[pillar];

  // ── Dynamic cover media resolution (server-side, pure functions) ────────────
  // Image: frontmatter coverImage → tag-matched image → pillar image
  // Video: frontmatter coverVideo → pillar videoSrc → NATURE_VIDEO_SRC
  const coverSrc   = resolveCoverImage(article.coverImage, article.tags, pillar);
  const coverVideo = resolveCoverVideo(article.coverVideo, pillar);

  // ── Breadcrumb (white-on-dark, lives inside PageHero overlay) ─────────────
  const breadcrumb = (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/70">
      <Link href="/" className="hover:text-white transition-colors">Home</Link>
      <span aria-hidden="true">/</span>
      <Link href={`/${pillar}`} className="hover:text-white transition-colors">{pillarMeta.label}</Link>
      <span aria-hidden="true">/</span>
      <span className="text-white/50 truncate max-w-[18ch] sm:max-w-none">{article.title}</span>
    </nav>
  );

  // ── Pillar badge ───────────────────────────────────────────────────────────
  const badge = (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${pillarMeta.color}`}>
      {pillarMeta.icon} {pillarMeta.label}
    </span>
  );

  return (
    <>
      {/* ── Full-bleed PageHero ─────────────────────────────────────────────
          Image: frontmatter coverImage → tag map → pillar image
          Video: frontmatter coverVideo → pillar videoSrc → NATURE_VIDEO_SRC */}
      <PageHero
        imageSrc={coverSrc}
        videoSrc={coverVideo}
        gradientFallback={media.gradient}
        breadcrumb={breadcrumb}
        badge={badge}
        title={article.title}
        subtitle={article.description}
        height="min-h-[75vh]"
      />

      {/* ── Article body ────────────────────────────────────────────────────
          Metadata row + tags + MDX prose content below the hero. */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-5 mb-6 border-b border-gray-100 dark:border-gray-800">
          <span className="font-medium text-gray-700 dark:text-gray-300">{article.author}</span>
          {article.date && <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>}
          <span>{article.readingTime}</span>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map(t => (
              <Link
                key={t}
                href={`/tag/${t}`}
                className="tag hover:bg-brand-100 dark:hover:bg-brand-700 transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {/* MDX article body */}
        <article className="prose-custom">
          <MDXRemote source={article.content} components={{ Tip, DidYouKnow, Impact }} />
        </article>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
          <Link
            href={`/${pillar}`}
            className="text-sm text-brand-600 dark:text-brand-300 font-medium hover:underline"
          >
            ← Back to {pillarMeta.label}
          </Link>
        </div>
      </div>
    </>
  );
}
