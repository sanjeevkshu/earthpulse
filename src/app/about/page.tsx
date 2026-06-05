import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About EarthPulse',
  description: 'EarthPulse is an open-source environmental education platform — our mission, editorial principles, and the values behind the work.',
};

const values = [
  {
    icon: '🔬',
    title: 'Science-led',
    description: 'Every factual claim traces to a peer-reviewed source, government dataset, or reputable institution. We cite our sources openly and update articles when the evidence evolves.',
  },
  {
    icon: '🌍',
    title: 'Planet-first',
    description: 'We exist to inform and motivate action on behalf of the living world. We do not accept sponsorship from fossil fuel companies, industrial agriculture, or interests that profit from environmental harm.',
  },
  {
    icon: '🤝',
    title: 'Accessible to all',
    description: 'Complex science should not require a PhD to understand. We write for curious, intelligent people regardless of background — and we never talk down to our readers.',
  },
  {
    icon: '📖',
    title: 'Transparent',
    description: 'Our code is open source. Our content is open licence. When we get something wrong, we correct it visibly and explain what changed.',
  },
  {
    icon: '⚖️',
    title: 'Balanced on evidence',
    description: 'We follow the scientific consensus without exaggeration. We distinguish between settled science, active research, and policy debate — and are honest about uncertainty.',
  },
  {
    icon: '🌱',
    title: 'Hopeful by design',
    description: 'The environmental story is not only a story of loss. Recovery, innovation, and human ingenuity are as real as the challenges. We report both.',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="mb-16">
        <span className="text-5xl block mb-6">🌿</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          About EarthPulse
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
          EarthPulse is an open-source, independent platform for environmental education. We cover ecosystems, biodiversity, climate, human impact, and the people and policies working to protect life on Earth.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Our mission</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            We believe that informed people make better decisions — as individuals, as voters, and as communities. The environmental challenges facing our planet are large and urgent, but they are not beyond human capacity to understand or address.
          </p>
          <p>
            EarthPulse exists to close the gap between what science knows and what the public understands. We translate research from journals and institutions into accessible, honest, well-sourced articles that give readers the knowledge to engage meaningfully with the most important issues of our time.
          </p>
          <p>
            We are not neutral on the science — the evidence for climate change, biodiversity loss, and ecosystem degradation is overwhelming and we say so. But we are rigorous about distinguishing scientific consensus from policy debate, and we give our readers the tools to form their own considered views on what to do about it.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">What we stand for</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map(v => (
            <div key={v.title} className="card flex gap-4 items-start">
              <span className="text-3xl shrink-0">{v.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial standards */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Editorial standards</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3>Sources</h3>
          <p>
            We cite primary sources wherever possible — peer-reviewed research, government datasets, and reports from established scientific institutions such as the IPCC, IPBES, NOAA, FAO, and IUCN. Aggregator sites and news articles are used only to point readers toward original sources, never as the primary basis for factual claims.
          </p>
          <h3>Corrections</h3>
          <p>
            When we get something wrong — a statistic, a date, a causal claim — we correct it. Corrections are noted at the top of the affected article with the original text, the corrected text, and the date of the change. We do not silently edit articles.
          </p>
          <h3>Updates</h3>
          <p>
            Environmental data changes. When significant new evidence is published that affects an article's conclusions, we update the article and note the update date alongside the original publication date.
          </p>
          <h3>Independence</h3>
          <p>
            EarthPulse does not accept advertising or sponsored content. We do not take money from organisations with a financial interest in the topics we cover. Our editorial decisions are made independently of any external funder or partner.
          </p>
        </div>
      </section>

      {/* Open source */}
      <section className="mb-16 card">
        <h2 className="text-xl font-bold mb-3">Open source & open content</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
          EarthPulse is built entirely on free and open-source technology. The code is published under the MIT licence. Article content is published under Creative Commons Attribution 4.0 (CC BY 4.0) — you may share and adapt it freely with attribution.
        </p>
        <a
          href="https://github.com/yourusername/earthpulse"
          className="btn-outline text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub →
        </a>
      </section>

      {/* Get involved */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Get involved</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/contribute" className="card text-center group">
            <span className="text-3xl block mb-3">✍️</span>
            <div className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">Write for us</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit an article or research summary</p>
          </Link>
          <Link href="/newsletter" className="card text-center group">
            <span className="text-3xl block mb-3">📬</span>
            <div className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">Newsletter</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Weekly digest, free, no spam</p>
          </Link>
          <a href="https://github.com/yourusername/earthpulse" className="card text-center group" target="_blank" rel="noopener noreferrer">
            <span className="text-3xl block mb-3">💻</span>
            <div className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">Contribute code</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Open issues and pull requests welcome</p>
          </a>
        </div>
      </section>

    </div>
  );
}
