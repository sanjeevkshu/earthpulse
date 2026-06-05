import Link from 'next/link';
import { getAllArticles, getFeaturedArticles, PILLAR_META } from '@/lib/content';
import ArticleCard from '@/components/article/ArticleCard';
import HeroMedia from '@/components/ui/HeroMedia';

const stats = [
  { value: '1M+',   label: 'Species at risk of extinction' },
  { value: '17%',   label: 'Amazon lost since 1970' },
  { value: '3.2mm', label: 'Avg sea level rise per year' },
  { value: '415ppm',label: 'Atmospheric CO₂ today' },
];

export default function HomePage() {
  const featured = getFeaturedArticles(3);
  const latest   = getAllArticles().slice(0, 6);
  return (
    <>
      <section className="relative min-h-[85vh] overflow-hidden">
        {/* Media background — video → Unsplash image → CSS gradient (3-layer fallback) */}
        <HeroMedia />
        {/* Dark gradient scrim — always rendered; ensures text legibility regardless of media layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" aria-hidden="true" />
        {/* Content — absolute like all other layers so no flex recalculation can shift it.
            Section height is defined purely by min-h-[85vh]; overlay just fills it. */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 md:py-32">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-white/90 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
            Our planet needs informed citizens
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-white">
            The living Earth,<br/><span className="text-brand-300">explained.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            From the deep ocean to the atmosphere — explore ecosystems, understand human impact, and discover what governments, scientists, and communities are doing to protect life on Earth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/our-planet" className="btn-primary text-base py-3 px-6">Start exploring →</Link>
            <Link href="/newsletter" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/60 text-white font-medium text-base hover:bg-white/10 transition-colors">Get weekly updates</Link>
          </div>
        </div>
        </div>
      </section>

      <section className="bg-brand-400 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-green-100 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-title mb-3">Explore by topic</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">Six pillars covering the full story of our planet.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Object.entries(PILLAR_META) as [string, typeof PILLAR_META[keyof typeof PILLAR_META]][]).map(([slug, meta]) => (
            <Link key={slug} href={`/${slug}`} className="card group flex items-start gap-4">
              <span className="text-3xl">{meta.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{meta.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{meta.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="section-title">Featured stories</h2>
              <Link href="/voices" className="text-sm text-brand-600 dark:text-brand-300 font-medium hover:underline">All articles →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="section-title">Latest from EarthPulse</h2>
          <Link href="/voices" className="text-sm text-brand-600 dark:text-brand-300 font-medium hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map(a => <ArticleCard key={`${a.pillar}-${a.slug}`} article={a} />)}
        </div>
      </section>

      <section className="bg-brand-800 dark:bg-brand-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay informed, stay engaged</h2>
          <p className="text-brand-100 mb-8 text-lg">A weekly digest of the most important environmental stories, research, and actions.</p>
          <Link href="/newsletter" className="inline-flex items-center gap-2 bg-white text-brand-800 font-semibold px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors">Subscribe free →</Link>
        </div>
      </section>
    </>
  );
}
