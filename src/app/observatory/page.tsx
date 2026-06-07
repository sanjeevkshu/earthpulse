import type { Metadata } from 'next';
import { type MetricDataset, type MetricId } from '@/lib/observatory';
import DataWrapper from './DataWrapper';

import temperatureData   from '@/../public/data/temperature.json';
import co2Data           from '@/../public/data/co2.json';
import seaLevelData      from '@/../public/data/sea-level.json';
import seaIceData        from '@/../public/data/sea-ice.json';
import deforestationData from '@/../public/data/deforestation.json';
import glaciersData      from '@/../public/data/glaciers.json';

export const metadata: Metadata = {
  title: 'EarthPulse Observatory — Planetary Data Dashboard',
  description: 'Real-time planetary health indicators — temperature, CO₂, sea level, Arctic sea ice, deforestation, and glacier mass balance from NASA, NOAA, NSIDC, GFW, and WGMS.',
};

const datasets: Record<MetricId, MetricDataset> = {
  temperature:   temperatureData   as MetricDataset,
  co2:           co2Data           as MetricDataset,
  'sea-level':   seaLevelData      as MetricDataset,
  'sea-ice':     seaIceData        as MetricDataset,
  deforestation: deforestationData as MetricDataset,
  glaciers:      glaciersData      as MetricDataset,
};

const lastFetchedStr = Object.values(datasets)
  .map(d => d.source.lastFetched).filter(Boolean).sort().at(0)
  ? new Date(Object.values(datasets).map(d => d.source.lastFetched).filter(Boolean).sort().at(0)!)
      .toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
  : 'Unknown';

export default function ObservatoryPage() {
  return (
    <div>
      {/* Hero header — matches site page hero style */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-700 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                Live planetary data
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                🛰️ EarthPulse Observatory
              </h1>
              <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                Six planetary vital signs tracked in real time from NASA, NOAA, NSIDC,
                Global Forest Watch, and WGMS. All data is public domain.
              </p>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
              Data updated: {lastFetchedStr}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard — client island with year scrubber, metric grid, lifetime widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DataWrapper datasets={datasets} />
      </div>

      {/* Data attribution */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-5 mt-4">
        <p className="max-w-7xl mx-auto text-xs text-gray-400 dark:text-gray-500">
          Data sources: NASA GISS · NOAA Mauna Loa · NASA JPL · NSIDC ·
          Global Forest Watch · WGMS. All datasets are public domain.
        </p>
      </div>
    </div>
  );
}
