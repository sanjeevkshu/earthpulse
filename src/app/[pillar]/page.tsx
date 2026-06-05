import { notFound } from 'next/navigation';
import { getAllArticles, PILLAR_META, Pillar } from '@/lib/content';
import { PILLAR_IMAGES } from '@/lib/mediaConfig';
import ArticleCard from '@/components/article/ArticleCard';
import PageHero from '@/components/ui/PageHero';
import type { Metadata } from 'next';

const VALID_PILLARS = Object.keys(PILLAR_META) as Pillar[];

type Props = { params: Promise<{ pillar: string }> };

export function generateStaticParams() {
  return VALID_PILLARS.map(p => ({ pillar: p }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar } = await params;
  const meta = PILLAR_META[pillar as Pillar];
  if (!meta) return {};
  return { title: meta.label, description: meta.description };
}

export default async function PillarPage({ params }: Props) {
  const { pillar: pillarParam } = await params;
  const pillar = pillarParam as Pillar;
  if (!VALID_PILLARS.includes(pillar)) notFound();

  const meta    = PILLAR_META[pillar];
  const media   = PILLAR_IMAGES[pillar];
  const articles = getAllArticles(pillar);

  return (
    <>
      {/* Full-bleed hero — image by default, video on hover/touch when videoSrc is set.
          Title and description are overlaid on the banner so the page opens
          with full visual impact before the article grid below. */}
      <PageHero
        imageSrc={media.src}
        videoSrc={media.videoSrc}
        gradientFallback={media.gradient}
        badge={
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${meta.color}`}>
            {meta.icon} {meta.label}
          </span>
        }
        title={meta.label}
        subtitle={meta.description}
        height="min-h-[70vh]"
      />

      {/* Article grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {articles.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-2xl mb-2">Content coming soon</p>
            <p className="text-sm">We are working on articles for this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(a => <ArticleCard key={a.slug} article={a} />)}
          </div>
        )}
      </div>
    </>
  );
}
