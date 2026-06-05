import { notFound } from 'next/navigation';
import { getArticlesByTag, getAllArticles } from '@/lib/content';
import ArticleCard from '@/components/article/ArticleCard';
import type { Metadata } from 'next';

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  const all = getAllArticles();
  const tags = [...new Set(all.flatMap(a => a.tags))];
  return tags.map(tag => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}`, description: `All articles tagged with ${tag}` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const articles = getArticlesByTag(tag);
  if (articles.length === 0) notFound();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <span className="tag text-base px-4 py-1.5 mb-4 inline-block">#{tag}</span>
        <h1 className="text-3xl font-bold mt-3">{articles.length} article{articles.length !== 1 ? 's' : ''}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(a => <ArticleCard key={`${a.pillar}-${a.slug}`} article={a} />)}
      </div>
    </div>
  );
}
