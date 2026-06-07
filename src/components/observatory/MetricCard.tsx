'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  type MetricDataset, type MetricId, METRIC_META,
  getThresholdStatus, getDeltaFromYear, getLatestValue, getSparklineData, STATUS_COLOURS,
} from '@/lib/observatory';
import StatusBadge from './StatusBadge';

const SparkLine = dynamic(() => import('./SparkLine'), {
  ssr: false,
  loading: () => <div className="h-12" />,
});

interface LivePoint { year: number; value: number; unit: string; agency: string; fallback?: boolean; }
interface Props { metricId: MetricId; dataset: MetricDataset; baselineYear: number; }

export default function MetricCard({ metricId, dataset, baselineYear }: Props) {
  const meta      = METRIC_META[metricId];
  const staticVal = getLatestValue(dataset.series);
  const [live, setLive]       = useState<LivePoint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/observatory/${metricId}`)
      .then(r => r.json())
      .then((d: LivePoint) => { if (!cancelled) { setLive(d); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [metricId]);

  const current = live ?? (staticVal ? { ...staticVal, unit: meta.unit, agency: meta.agency } : null);
  if (!current) return null;

  const status    = getThresholdStatus(metricId, current.value);
  const lineColor = STATUS_COLOURS[status];
  const sparkData = getSparklineData(dataset.series, 30);
  const delta     = getDeltaFromYear(dataset.series, baselineYear);

  const sign      = delta !== null ? (delta > 0 ? '+' : '') : null;
  const deltaStr  = delta !== null
    ? `${sign}${delta.toFixed(metricId === 'glaciers' ? 0 : 2)} ${meta.unit}`
    : 'N/A';
  const deltaIsGood = delta !== null && (meta.higherIsBetter ? delta > 0 : delta < 0);

  return (
    <article className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-brand-200 dark:hover:border-brand-600 transition-colors shadow-sm">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{meta.icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{meta.label}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              {meta.agency}
              {live?.fallback && (
                <span className="text-gray-300 dark:text-gray-600" title="Serving cached data — live feed temporarily unavailable">
                  · cached
                </span>
              )}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Current value — skeleton while loading */}
      <div className={`transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
          {current.value.toFixed(metricId === 'glaciers' ? 0 : 2)}
        </span>
        <span className="text-sm text-gray-400 dark:text-gray-500 ml-1">{meta.unit}</span>
        <span className="text-xs text-gray-300 dark:text-gray-600 ml-2">({current.year})</span>
      </div>

      {/* Sparkline — no negative margins; SparkLine uses fixed height to prevent Recharts -1 loop */}
      <div className="h-12 w-full overflow-hidden" aria-hidden="true">
        <SparkLine data={sparkData} color={lineColor} />
      </div>

      {/* Delta + Explore */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Since {baselineYear}:{' '}
          <span className={`font-semibold ${deltaIsGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {deltaStr}
          </span>
        </p>
        <Link
          href={`/observatory/${metricId}`}
          className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
        >
          Explore →
        </Link>
      </div>

      <span className="sr-only">
        {meta.label}: {current.value} {meta.unit} in {current.year}. Status: {status}.
        Change since {baselineYear}: {deltaStr}.
        {live?.fallback ? ' Note: showing cached data.' : ''}
      </span>
    </article>
  );
}
