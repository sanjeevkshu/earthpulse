import type { MetricDataset } from '@/lib/observatory';

export default function DataProvenancePanel({ dataset }: { dataset: MetricDataset }) {
  const { source } = dataset;
  const fetchedDate = source.lastFetched
    ? new Date(source.lastFetched).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 text-sm">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        Data provenance
      </h3>
      <dl className="space-y-2.5">
        {[
          { label: 'Agency',       value: source.agency },
          { label: 'Dataset',      value: source.dataset },
          { label: 'Last fetched', value: fetchedDate },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-2">
            <dt className="text-gray-400 dark:text-gray-500 w-28 shrink-0">{label}</dt>
            <dd className="text-gray-700 dark:text-gray-300">{value}</dd>
          </div>
        ))}
        <div className="flex gap-2">
          <dt className="text-gray-400 dark:text-gray-500 w-28 shrink-0">Source</dt>
          <dd>
            <a href={source.url} target="_blank" rel="noopener noreferrer"
               className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors underline underline-offset-2">
              View original data ↗
            </a>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-gray-400 dark:text-gray-500 w-28 shrink-0">Methodology</dt>
          <dd>
            <a href={source.methodology} target="_blank" rel="noopener noreferrer"
               className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors underline underline-offset-2">
              Read methodology ↗
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
