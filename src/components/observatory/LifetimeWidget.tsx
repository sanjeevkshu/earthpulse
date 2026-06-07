'use client';
import { useState } from 'react';
import {
  type MetricDataset, type MetricId,
  METRIC_META, METRIC_IDS,
  getDeltaFromYear, getLatestValue,
} from '@/lib/observatory';

interface Props { datasets: Record<MetricId, MetricDataset>; }

export default function LifetimeWidget({ datasets }: Props) {
  const [birthYear, setBirthYear] = useState<number | ''>('');
  const year    = typeof birthYear === 'number' ? birthYear : null;
  const isValid = year !== null && year >= 1924 && year <= 2010;

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">My Lifetime</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        See how the planet has changed since you were born. No data is stored or transmitted.
      </p>

      <div className="flex items-center gap-3 mb-6">
        <label htmlFor="birth-year" className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
          I was born in
        </label>
        <input
          id="birth-year"
          type="number"
          min={1924}
          max={2010}
          placeholder="e.g. 1985"
          value={birthYear}
          onChange={e => setBirthYear(e.target.value === '' ? '' : parseInt(e.target.value))}
          className="w-28 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-brand-400 tabular-nums"
        />
      </div>

      {isValid && (
        <ul className="space-y-3" aria-live="polite">
          {METRIC_IDS.map(id => {
            const meta    = METRIC_META[id];
            const dataset = datasets[id];
            const delta   = getDeltaFromYear(dataset.series, year!);
            const latest  = getLatestValue(dataset.series);
            if (delta === null || latest === null) return null;
            const sign    = delta > 0 ? '+' : '';
            const context = `Since you were born in ${year}, ${meta.label.toLowerCase()} has changed by ${sign}${delta.toFixed(id === 'glaciers' ? 0 : 2)} ${meta.unit} (now ${latest.value.toFixed(id === 'glaciers' ? 0 : 2)} ${meta.unit} in ${latest.year}).`;
            return (
              <li key={id} className="flex items-start gap-3 text-sm">
                <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{meta.icon}</span>
                <span className="text-gray-600 dark:text-gray-300">{context}</span>
              </li>
            );
          })}
        </ul>
      )}

      {!isValid && birthYear !== '' && (
        <p className="text-sm text-amber-600 dark:text-amber-400">Please enter a birth year between 1924 and 2010.</p>
      )}
    </section>
  );
}
