'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Brush, ResponsiveContainer,
} from 'recharts';
import { type MetricDataset, type MetricId, METRIC_META, getThresholdStatus, STATUS_COLOURS } from '@/lib/observatory';

// ── Theme-aware colour tokens ────────────────────────────────────────────────
// Recharts uses inline colour props — CSS classes don't apply to SVG elements.
// We detect the resolved theme and pass appropriate colour values.
function useChartColors(isDark: boolean) {
  return {
    grid:      isDark ? '#1F2937' : '#F3F4F6',
    axis:      isDark ? '#9CA3AF' : '#6B7280',
    axisLine:  isDark ? '#374151' : '#E5E7EB',
    tooltip:   isDark ? '#1F2937' : '#FFFFFF',
    tooltipBorder: isDark ? '#374151' : '#E5E7EB',
    tooltipText: isDark ? '#F9FAFB' : '#111827',
    tooltipMuted: isDark ? '#9CA3AF' : '#6B7280',
    brush:     isDark ? '#374151' : '#F9FAFB',
    brushText: isDark ? '#374151' : '#E5E7EB',
  };
}

// ── Custom Tooltip ───────────────────────────────────────────────────────────
interface TooltipPayload { value: number; }
interface CustomTooltipProps {
  active?: boolean; payload?: TooltipPayload[]; label?: string | number;
  metricId: MetricId; isDark: boolean;
}

function CustomTooltip({ active, payload, label, metricId, isDark }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const value     = payload[0].value;
  const meta      = METRIC_META[metricId];
  const status    = getThresholdStatus(metricId, value);
  const statusCol = STATUS_COLOURS[status];
  const c = useChartColors(isDark);
  return (
    <div style={{ background: c.tooltip, border: `1px solid ${c.tooltipBorder}` }}
         className="rounded-lg px-3 py-2 text-xs shadow-xl">
      <p style={{ color: c.tooltipMuted }} className="mb-1">{label}</p>
      <p style={{ color: c.tooltipText }} className="font-bold">
        {value.toFixed(metricId === 'glaciers' ? 0 : 2)}{' '}
        <span style={{ color: c.tooltipMuted }} className="font-normal">{meta.unit}</span>
      </p>
      <p style={{ color: statusCol }} className="font-medium capitalize mt-0.5">{status}</p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
interface Props { metricId: MetricId; dataset: MetricDataset; }

export default function MetricChart({ metricId, dataset }: Props) {
  const { resolvedTheme } = useTheme();
  // Default to false (light) to avoid hydration mismatch
  const [isDark, setIsDark] = useState(false);
  useEffect(() => { setIsDark(resolvedTheme === 'dark'); }, [resolvedTheme]);

  const meta  = METRIC_META[metricId];
  const data  = dataset.series.filter(d => d.value !== null);
  const c     = useChartColors(isDark);

  const lastVal  = data.at(-1)?.value ?? 0;
  const areaCol  = STATUS_COLOURS[getThresholdStatus(metricId, lastVal as number)];

  const thresholds = [
    { value: dataset.thresholds.safe,     label: 'Safe',     color: '#10B981' },
    { value: dataset.thresholds.caution,  label: 'Caution',  color: '#F59E0B' },
    { value: dataset.thresholds.critical, label: 'Critical', color: '#EF4444' },
  ];

  return (
    <div className="w-full" aria-label={`${meta.label} historical chart`}>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
          <defs>
            <linearGradient id={`fill-${metricId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={areaCol} stopOpacity={0.2} />
              <stop offset="95%" stopColor={areaCol} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />

          <XAxis
            dataKey="year"
            tick={{ fill: c.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: c.axisLine }}
            tickCount={8}
          />
          <YAxis
            tick={{ fill: c.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            unit={` ${meta.unit}`}
            width={80}
          />

          <Tooltip content={<CustomTooltip metricId={metricId} isDark={isDark} />} />

          {thresholds.map(t => (
            <ReferenceLine
              key={t.label}
              y={t.value}
              stroke={t.color}
              strokeDasharray="6 3"
              strokeWidth={1}
              strokeOpacity={0.7}
              label={{ value: t.label, fill: t.color, fontSize: 10, position: 'insideTopRight' }}
            />
          ))}

          <Area
            type="monotone"
            dataKey="value"
            stroke={areaCol}
            strokeWidth={2}
            fill={`url(#fill-${metricId})`}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />

          <Brush
            dataKey="year"
            height={24}
            stroke={c.brushText}
            fill={c.brush}
            travellerWidth={8}
            startIndex={Math.max(0, data.length - 40)}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Accessible data table */}
      <table className="sr-only">
        <caption>{meta.label} data</caption>
        <thead><tr><th>Year</th><th>{meta.unit}</th></tr></thead>
        <tbody>{data.map(d => <tr key={d.year}><td>{d.year}</td><td>{d.value}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
