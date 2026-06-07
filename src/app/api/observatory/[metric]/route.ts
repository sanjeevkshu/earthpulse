/**
 * Layer 2 — Observatory Route Handler
 * GET /api/observatory/[metric]
 *
 * Fetches only the most recent data point from the upstream public API for
 * the given metric. This keeps the MetricCard "current value" badge within
 * 24 hours of the real NASA/NOAA figure, while the full historical series
 * (Layer 1 JSON) is served statically from the CDN.
 *
 * Edge cache: s-maxage=86400 (24h), stale-while-revalidate=3600.
 * On upstream failure: falls back to the last non-null entry in the static
 * /public/data/[metric].json file and includes fallback: true in the response.
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { MetricId, MetricDataset } from '@/lib/observatory';
import { METRIC_IDS, METRIC_META } from '@/lib/observatory';

/** Response shape — MetricCard reads this on mount */
interface LivePoint {
  year: number;
  value: number;
  unit: string;
  agency: string;
  fallback?: true;
}

const CACHE_HEADER = 's-maxage=86400, stale-while-revalidate=3600';

// ── Per-metric fetch + parse (latest row only) ───────────────────────────────

async function fetchLatestTemperature(): Promise<{ year: number; value: number }> {
  const url = 'https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv';
  const text = await fetchText(url);
  const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  // Find header row, locate J-D column
  const headerIdx = lines.findIndex(l => l.trim().startsWith('Year'));
  if (headerIdx < 0) throw new Error('Header not found');
  const headers = lines[headerIdx].split(',').map(h => h.trim());
  const yrCol  = headers.indexOf('Year');
  const annCol = headers.indexOf('J-D');
  if (yrCol < 0 || annCol < 0) throw new Error('Columns not found');
  // Walk from end to find last non-**** row
  for (let i = lines.length - 1; i > headerIdx; i--) {
    const cols = lines[i].split(',');
    const yr  = parseInt(cols[yrCol]);
    const val = cols[annCol]?.trim();
    if (!isNaN(yr) && val && val !== '****') return { year: yr, value: parseFloat(val) };
  }
  throw new Error('No valid row found');
}

async function fetchLatestCO2(): Promise<{ year: number; value: number }> {
  const url = 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv';
  const text = await fetchText(url);
  const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  for (let i = lines.length - 1; i >= 0; i--) {
    const cols = lines[i].split(',');
    const yr = parseInt(cols[0]);
    const val = parseFloat(cols[1]);
    if (!isNaN(yr) && !isNaN(val)) return { year: yr, value: val };
  }
  throw new Error('No valid row found');
}

async function fetchLatestSeaLevel(): Promise<{ year: number; value: number }> {
  const url = 'https://sealevel.nasa.gov/ftp/txt/MSL_Seasonal_v3.1.txt';
  const text = await fetchText(url);
  const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('HDR'));
  const yearMap = new Map<number, number[]>();
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 6) continue;
    const yr = Math.floor(parseFloat(parts[0]));
    const val = parseFloat(parts[5]);
    if (!isNaN(yr) && !isNaN(val)) {
      if (!yearMap.has(yr)) yearMap.set(yr, []);
      yearMap.get(yr)!.push(val);
    }
  }
  const sorted = [...yearMap.entries()].sort((a, b) => a[0] - b[0]);
  if (!sorted.length) throw new Error('No data');
  const [year, vals] = sorted.at(-1)!;
  return { year, value: vals.reduce((a, b) => a + b, 0) / vals.length };
}

async function fetchLatestSeaIce(): Promise<{ year: number; value: number }> {
  const url = 'https://noaadata.apps.nsidc.org/NOAA/G02135/north/monthly/data/N_09_extent_v3.0.csv';
  const text = await fetchText(url);
  const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const yrCol  = header.indexOf('year');
  const moCol  = header.indexOf('mo');
  const extCol = header.findIndex(h => h.includes('extent'));
  if (yrCol < 0 || moCol < 0 || extCol < 0) throw new Error('Columns not found');
  for (let i = lines.length - 1; i >= 1; i--) {
    const cols = lines[i].split(',');
    if (parseInt(cols[moCol]) !== 9) continue;
    const yr  = parseInt(cols[yrCol]);
    const val = parseFloat(cols[extCol]);
    if (!isNaN(yr) && !isNaN(val)) return { year: yr, value: val };
  }
  throw new Error('No September row found');
}

// Deforestation and glaciers use hardcoded series — latest known values
function latestDeforestation(): { year: number; value: number } {
  return { year: 2022, value: 13.9 };
}
function latestGlaciers(): { year: number; value: number } {
  return { year: 2022, value: -31200 };
}

// ── Fetch helper ─────────────────────────────────────────────────────────────

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'EarthPulse/1.0 (earthpulse.org)' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ── Static JSON fallback ─────────────────────────────────────────────────────

function staticFallback(metric: MetricId): LivePoint {
  const filePath = path.join(process.cwd(), 'public', 'data', `${metric}.json`);
  const data: MetricDataset = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const meta = METRIC_META[metric];
  const latest = [...data.series].reverse().find(d => d.value !== null);
  if (!latest) throw new Error('Empty series in static JSON');
  return {
    year:     latest.year,
    value:    latest.value as number,
    unit:     meta.unit,
    agency:   meta.agency,
    fallback: true,
  };
}

// ── Per-metric dispatch ───────────────────────────────────────────────────────

async function getLatest(metric: MetricId): Promise<{ year: number; value: number }> {
  switch (metric) {
    case 'temperature':   return fetchLatestTemperature();
    case 'co2':           return fetchLatestCO2();
    case 'sea-level':     return fetchLatestSeaLevel();
    case 'sea-ice':       return fetchLatestSeaIce();
    case 'deforestation': return latestDeforestation();
    case 'glaciers':      return latestGlaciers();
  }
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ metric: string }> },
) {
  const { metric } = await params;

  if (!METRIC_IDS.includes(metric as MetricId)) {
    return NextResponse.json({ error: `Unknown metric: ${metric}` }, { status: 400 });
  }

  const id   = metric as MetricId;
  const meta = METRIC_META[id];

  try {
    const { year, value } = await getLatest(id);
    const body: LivePoint = { year, value, unit: meta.unit, agency: meta.agency };
    return NextResponse.json(body, {
      headers: { 'Cache-Control': CACHE_HEADER },
    });
  } catch (err) {
    console.warn(`[Observatory] Layer 2 upstream failed for ${id}: ${err}. Serving Layer 1 fallback.`);
    try {
      const fallback = staticFallback(id);
      return NextResponse.json(fallback, {
        headers: { 'Cache-Control': CACHE_HEADER },
      });
    } catch (fallbackErr) {
      return NextResponse.json(
        { error: 'Data unavailable', detail: String(fallbackErr) },
        { status: 503 },
      );
    }
  }
}
