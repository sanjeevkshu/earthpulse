import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { type MetricDataset, type MetricId, METRIC_META, METRIC_IDS, getThresholdStatus, getLatestValue } from '@/lib/observatory';
import { getAllArticles } from '@/lib/content';
import StatusBadge from '@/components/observatory/StatusBadge';
import DataProvenancePanel from '@/components/observatory/DataProvenancePanel';
import MetricChartClient from '@/components/observatory/MetricChartClient';
import ArticleCard from '@/components/article/ArticleCard';

// Import datasets
import temperatureData   from '@/../public/data/temperature.json';
import co2Data           from '@/../public/data/co2.json';
import seaLevelData      from '@/../public/data/sea-level.json';
import seaIceData        from '@/../public/data/sea-ice.json';
import deforestationData from '@/../public/data/deforestation.json';
import glaciersData      from '@/../public/data/glaciers.json';

const ALL_DATASETS: Record<MetricId, MetricDataset> = {
  temperature:   temperatureData   as MetricDataset,
  co2:           co2Data           as MetricDataset,
  'sea-level':   seaLevelData      as MetricDataset,
  'sea-ice':     seaIceData        as MetricDataset,
  deforestation: deforestationData as MetricDataset,
  glaciers:      glaciersData      as MetricDataset,
};

// Scientific context per metric (hardcoded — would move to MDX in a future iteration)
const CONTEXT: Record<MetricId, { paras: string[] }> = {
  temperature: { paras: [
    'Global average surface temperature is the single most watched indicator of planetary change. The 1951–1980 average is used as the baseline because that period has comprehensive coverage and precedes the acceleration of warming. An anomaly of +1.5°C is the threshold the Paris Agreement aimed to stay below.',
    'Each additional 0.1°C of warming represents a meaningful increase in extreme heat events, sea level contribution from ice melt, and ecosystem stress. At +2°C, IPCC models show coral reefs largely bleached, Arctic summers ice-free, and hundreds of millions more people exposed to severe drought.',
    'The rate of warming has accelerated since 1980. The five hottest years on record have all occurred since 2015. The 2023 anomaly of +1.17°C marks the closest approach to the Paris 1.5°C limit ever recorded.',
  ]},
  co2: { paras: [
    'The Mauna Loa CO₂ record, begun by Charles Keeling in 1958, is the most iconic dataset in climate science. It shows the unambiguous upward trend in atmospheric carbon dioxide driven by fossil fuel combustion and land use change.',
    'Pre-industrial CO₂ levels were approximately 280 ppm. The 350 ppm level, proposed by scientist James Hansen as the safe upper boundary, was crossed in 1988. The 400 ppm threshold was crossed in 2013. In 2023, annual mean CO₂ exceeded 420 ppm for the first time.',
    'CO₂ remains in the atmosphere for hundreds to thousands of years. Even if all emissions stopped today, the CO₂ already emitted would continue warming the planet for decades. This is why the cumulative total of emissions matters, not just the current rate.',
  ]},
  'sea-level': { paras: [
    'Global mean sea level has risen approximately 20 cm since 1900, with the rate accelerating sharply since satellite measurements began in 1993. The two main contributors are thermal expansion of warming ocean water, and the melting of land ice sheets in Greenland and Antarctica.',
    'Even 30 cm of additional sea level rise above today\'s level would put hundreds of millions of people at elevated flood risk. Low-lying island nations, river deltas, and coastal megacities are acutely exposed. Storm surges become more destructive as the baseline rises.',
    'IPCC projections for 2100 range from approximately 30 cm under deep decarbonisation scenarios to over 100 cm under high-emissions pathways. Recent research suggests the collapse of portions of the West Antarctic Ice Sheet may be unavoidable regardless of future emissions, adding multi-metre contributions on century timescales.',
  ]},
  'sea-ice': { paras: [
    'Arctic sea ice extent in September — the annual minimum after the summer melt season — is one of the most visible indicators of polar climate change. In 1979 it averaged around 7.2 million km². In 2012 it set a record low of 3.4 million km². The long-term trend is a loss of approximately 13% of sea ice per decade.',
    'Arctic sea ice plays a critical role in Earth\'s energy balance through the albedo effect: white ice reflects sunlight back into space, while the dark ocean absorbs it. Less ice means more heat absorbed, which warms the Arctic faster than the global average — a process called Arctic amplification.',
    'Scientists project the Arctic will experience its first ice-free September sometime between 2030 and 2050 under most emissions scenarios. This would have cascading effects on weather patterns in the Northern Hemisphere, marine ecosystems, and the livelihoods of Arctic communities.',
  ]},
  deforestation: { paras: [
    'Tropical forests are among Earth\'s most carbon-dense and biodiverse ecosystems. Deforestation — primarily driven by agricultural expansion, cattle ranching, and commercial logging — accounts for roughly 10–15% of annual global greenhouse gas emissions. The Amazon alone holds approximately 150–200 billion tonnes of carbon.',
    'The Global Forest Watch Hansen dataset, derived from Landsat satellite imagery, provides annual estimates of tropical tree cover loss globally. Rates peaked around 2016–2019 before some countries implemented stronger protections. However, enforcement remains uneven, and fire-driven deforestation has been increasing.',
    'When tropical forests are cleared, they release stored carbon and lose the capacity to absorb further CO₂. They also drive local climate change through reduced rainfall and increased temperatures. At roughly 20–25% deforestation, the Amazon may cross a tipping point to savannah conditions in portions of the biome.',
  ]},
  glaciers: { paras: [
    'The World Glacier Monitoring Service tracks mass balance — the net gain or loss of ice across the world\'s glaciers each year. The cumulative signal is unambiguous: glaciers have been losing mass every decade since the 1970s, and the rate of loss has accelerated since 2000.',
    'Glacial melt contributes directly to sea level rise. It also threatens fresh water supplies for hundreds of millions of people in South Asia, the Andes, and other glacier-fed river systems. Seasonal patterns that communities have depended on for agriculture and drinking water are shifting as glaciers retreat.',
    'The current cumulative glacier mass balance deficit represents roughly 31,000 mm water equivalent — meaning if all that meltwater had nowhere to go, it would cover the world\'s oceans with several additional millimetres. Much of it already has, contributing an estimated 27% of observed sea level rise since 1961.',
  ]},
};

type Props = { params: Promise<{ metric: string }> };

export function generateStaticParams() {
  return METRIC_IDS.map(id => ({ metric: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metric } = await params;
  const meta = METRIC_META[metric as MetricId];
  if (!meta) return {};
  return {
    title: `${meta.label} — EarthPulse Observatory`,
    description: meta.description,
  };
}

export default async function MetricDeepDivePage({ params }: Props) {
  const { metric } = await params;
  const metricId = metric as MetricId;
  if (!METRIC_IDS.includes(metricId)) notFound();

  const dataset = ALL_DATASETS[metricId];
  const meta    = METRIC_META[metricId];
  const latest  = getLatestValue(dataset.series);
  const status  = latest ? getThresholdStatus(metricId, latest.value) : 'safe';
  const context = CONTEXT[metricId];

  // Related articles — tag-matched
  const tagMap: Record<MetricId, string[]> = {
    temperature:   ['climate', 'science'],
    co2:           ['climate', 'ecosystems'],
    'sea-level':   ['oceans', 'climate'],
    'sea-ice':     ['oceans', 'biodiversity'],
    deforestation: ['deforestation', 'forests', 'biodiversity'],
    glaciers:      ['climate', 'biodiversity'],
  };
  const relatedTags = tagMap[metricId];
  const relatedArticles = getAllArticles()
    .filter(a => a.tags.some(t => relatedTags.includes(t)))
    .slice(0, 3);

  const sectionHeading = 'text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4';

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/observatory" className="text-sm text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-400 transition-colors">
          ← Observatory
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-4xl" aria-hidden="true">{meta.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{meta.label}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">{meta.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {latest && (
              <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                {latest.value.toFixed(metricId === 'glaciers' ? 0 : 2)}
                <span className="text-base font-normal text-gray-400 dark:text-gray-500 ml-1">{meta.unit}</span>
                <span className="text-sm font-normal text-gray-300 dark:text-gray-600 ml-2">({latest.year})</span>
              </span>
            )}
            <StatusBadge status={status} />
            <span className="text-xs text-gray-400 dark:text-gray-500">Source: {meta.agency}</span>
          </div>
        </header>

        {/* Full interactive chart */}
        <section>
          <h2 className={sectionHeading}>Historical record</h2>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
            <MetricChartClient metricId={metricId} dataset={dataset} />
          </div>
        </section>

        {/* Scientific context */}
        <section>
          <h2 className={sectionHeading}>What this means</h2>
          <div className="space-y-4">
            {context.paras.map((p, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed">{p}</p>
            ))}
          </div>
        </section>

        {/* Data provenance */}
        <section>
          <h2 className={sectionHeading}>Data source</h2>
          <DataProvenancePanel dataset={dataset} />
        </section>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className={sectionHeading}>Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedArticles.map(a => (
                <ArticleCard key={`${a.pillar}-${a.slug}`} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
