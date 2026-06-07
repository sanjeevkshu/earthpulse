'use client';
/**
 * MetricChartClient — client wrapper that dynamically imports MetricChart.
 * `ssr: false` must live in a 'use client' file (Next.js 16 / Turbopack rule).
 */
import dynamic from 'next/dynamic';
import type { MetricDataset, MetricId } from '@/lib/observatory';

const MetricChart = dynamic(() => import('./MetricChart'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-800/50 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-slate-500 text-sm">Loading chart…</span>
    </div>
  ),
});

interface Props {
  metricId: MetricId;
  dataset: MetricDataset;
}

export default function MetricChartClient({ metricId, dataset }: Props) {
  return <MetricChart metricId={metricId} dataset={dataset} />;
}
