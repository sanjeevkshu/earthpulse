'use client';
import { useState } from 'react';
import { type MetricDataset, type MetricId, METRIC_IDS } from '@/lib/observatory';
import MetricCard from '@/components/observatory/MetricCard';
import YearScrubber from '@/components/observatory/YearScrubber';
import LifetimeWidget from '@/components/observatory/LifetimeWidget';

interface Props { datasets: Record<MetricId, MetricDataset>; }

export default function DataWrapper({ datasets }: Props) {
  const [baselineYear, setBaselineYear] = useState(1990);

  return (
    <div className="space-y-10">
      {/* Year scrubber */}
      <section className="card p-5 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            Baseline year
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Drag to compare any year from 1950 to present
          </span>
        </div>
        <YearScrubber
          year={baselineYear}
          min={1950}
          max={new Date().getFullYear() - 1}
          onChange={setBaselineYear}
        />
      </section>

      {/* Metric cards grid */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5">
          Planetary indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {METRIC_IDS.map(id => (
            <MetricCard
              key={id}
              metricId={id}
              dataset={datasets[id]}
              baselineYear={baselineYear}
            />
          ))}
        </div>
      </section>

      {/* Lifetime widget */}
      <LifetimeWidget datasets={datasets} />
    </div>
  );
}
