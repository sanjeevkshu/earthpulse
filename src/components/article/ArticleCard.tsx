import Link from 'next/link';
import { ArticleMeta, PILLAR_META } from '@/lib/content';
import { format } from 'date-fns';

interface Props { article: ArticleMeta }

export default function ArticleCard({ article }: Props) {
  const { slug, pillar, title, description, date, tags, author, readingTime, featured } = article;
  const pillarMeta = PILLAR_META[pillar];
  return (
    <Link href={`/${pillar}/${slug}`} className="card flex flex-col gap-4 group">
      {featured && <span className="self-start text-xs font-semibold bg-brand-400 text-white px-2.5 py-0.5 rounded-full">Featured</span>}
      <div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${pillarMeta.color}`}>
          {pillarMeta.icon} {pillarMeta.label}
        </span>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors leading-snug">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
        <span>{author}</span>
        <span className="flex items-center gap-2">
          {date && <span>{format(new Date(date), 'MMM d, yyyy')}</span>}
          <span>·</span>
          <span>{readingTime}</span>
        </span>
      </div>
    </Link>
  );
}
