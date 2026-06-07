/**
 * Observatory data library — types, metadata, and helper functions.
 *
 * All chart components import from here. The JSON datasets in /public/data/
 * are typed against MetricDataset. METRIC_META holds the display config and
 * IPCC-aligned thresholds for each of the six planetary indicators.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface MetricDataset {
  id: string;
  label: string;
  unit: string;
  source: {
    agency: string;
    dataset: string;
    url: string;
    methodology: string;
    lastFetched: string;          // ISO timestamp of last successful fetch
  };
  thresholds: {
    safe: number;
    caution: number;
    critical: number;
  };
  series: Array<{
    year: number;
    value: number | null;         // null for gap / missing years
  }>;
}

export type MetricId =
  | 'temperature'
  | 'co2'
  | 'sea-level'
  | 'sea-ice'
  | 'deforestation'
  | 'glaciers';

export type ThresholdStatus = 'safe' | 'caution' | 'critical';

// ── Metric metadata ──────────────────────────────────────────────────────────

export const METRIC_META: Record<
  MetricId,
  {
    label: string;
    unit: string;
    icon: string;
    description: string;
    agency: string;
    thresholds: { safe: number; caution: number; critical: number };
    /** When true, higher values are better (sea ice extent, glacier balance) */
    higherIsBetter: boolean;
  }
> = {
  temperature: {
    label: 'Temperature Anomaly',
    unit: '°C',
    icon: '🌡️',
    description: 'Global average surface temperature rise above the 1951–1980 baseline',
    agency: 'NASA GISS',
    thresholds: { safe: 1.0, caution: 1.5, critical: 2.0 },
    higherIsBetter: false,
  },
  co2: {
    label: 'Atmospheric CO₂',
    unit: 'ppm',
    icon: '💨',
    description: 'Concentration of CO₂ at Mauna Loa Observatory — the longest continuous record',
    agency: 'NOAA',
    thresholds: { safe: 350, caution: 400, critical: 450 },
    higherIsBetter: false,
  },
  'sea-level': {
    label: 'Sea Level Rise',
    unit: 'mm',
    icon: '🌊',
    description: 'Rise in global mean sea level since 1993 satellite altimetry baseline',
    agency: 'NASA JPL',
    thresholds: { safe: 50, caution: 100, critical: 150 },
    higherIsBetter: false,
  },
  'sea-ice': {
    label: 'Arctic Sea Ice',
    unit: 'M km²',
    icon: '🧊',
    description: 'September minimum Arctic sea ice extent — the most sensitive seasonal indicator',
    agency: 'NSIDC',
    thresholds: { safe: 6.0, caution: 4.5, critical: 3.5 },
    higherIsBetter: true,
  },
  deforestation: {
    label: 'Deforestation Rate',
    unit: 'Mha/yr',
    icon: '🌳',
    description: 'Annual loss of tropical tree cover globally',
    agency: 'Global Forest Watch',
    thresholds: { safe: 8, caution: 12, critical: 15 },
    higherIsBetter: false,
  },
  glaciers: {
    label: 'Glacier Mass Balance',
    unit: 'mm w.e.',
    icon: '⛰️',
    description: 'Cumulative global glacier mass loss since 1950 in millimetres water equivalent',
    agency: 'WGMS',
    thresholds: { safe: -10000, caution: -20000, critical: -28000 },
    higherIsBetter: true,
  },
};

// ── Ordered list of metric IDs for consistent rendering ──────────────────────

export const METRIC_IDS: MetricId[] = [
  'temperature',
  'co2',
  'sea-level',
  'sea-ice',
  'deforestation',
  'glaciers',
];

// ── Threshold logic ──────────────────────────────────────────────────────────

/**
 * Returns the threshold status for a given metric value.
 * Accounts for whether higher or lower values are better.
 */
export function getThresholdStatus(
  metricId: MetricId,
  value: number,
): ThresholdStatus {
  const meta = METRIC_META[metricId];
  const { safe, caution, critical } = meta.thresholds;

  if (meta.higherIsBetter) {
    if (value >= safe)   return 'safe';
    if (value >= caution) return 'caution';
    return 'critical';
  } else {
    if (value <= safe)   return 'safe';
    if (value <= caution) return 'caution';
    return 'critical';
  }
}

// ── Series helpers ────────────────────────────────────────────────────────────

/**
 * Returns the delta between the most recent non-null value and the value
 * at `fromYear`. Returns null if either endpoint is missing.
 */
export function getDeltaFromYear(
  series: MetricDataset['series'],
  fromYear: number,
): number | null {
  const baseline = series.find(d => d.year === fromYear);
  const latest   = [...series].reverse().find(d => d.value !== null);
  if (!baseline?.value || !latest?.value) return null;
  return latest.value - baseline.value;
}

/**
 * Returns the most recent non-null data point in a series.
 */
export function getLatestValue(
  series: MetricDataset['series'],
): { value: number; year: number } | null {
  const latest = [...series].reverse().find(d => d.value !== null);
  return latest ? { value: latest.value as number, year: latest.year } : null;
}

/**
 * Returns the last `n` data points from a series (for sparklines).
 */
export function getSparklineData(
  series: MetricDataset['series'],
  n = 30,
): MetricDataset['series'] {
  return series.filter(d => d.value !== null).slice(-n);
}

// ── Status colour helpers ────────────────────────────────────────────────────

export const STATUS_COLOURS: Record<ThresholdStatus, string> = {
  safe:     '#10B981', // emerald-500
  caution:  '#F59E0B', // amber-500
  critical: '#EF4444', // red-500
};
