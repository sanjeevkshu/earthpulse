import { notFound } from 'next/navigation';
import { getAllArticles, PILLAR_META, Pillar } from '@/lib/content';
import { PILLAR_IMAGES } from '@/lib/mediaConfig';
import ArticleCard from '@/components/article/ArticleCard';
import BannerImage from '@/components/ui/BannerImage';
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
  const meta = PILLAR_META[pillar];
  const media = PILLAR_IMAGES[pillar];
  const articles = getAllArticles(pillar);

  return (
    <div>
      {/* Contextual banner — Unsplash image via Next.js proxy; CSS gradient fallback */}
      <BannerImage
        src={media.src}
        gradientFallback={media.gradient}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-14">
          <span className="text-5xl mb-4 block">{meta.icon}</span>
          <h1 className="text-4xl font-bold mb-3">{meta.label}</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl">{meta.description}</p>
        </div>
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
    </div>
  );
}
