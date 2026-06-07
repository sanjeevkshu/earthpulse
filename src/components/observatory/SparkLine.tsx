'use client';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import type { MetricDataset } from '@/lib/observatory';

interface Props {
  data: MetricDataset['series'];
  color: string;
}

/**
 * Minimal sparkline — no axes, no grid, thin coloured line only.
 *
 * height={48} fixed px (not "100%") — Recharts enters an infinite retry loop
 * when ResponsiveContainer measures a zero/negative-dimension parent, logging
 * hundreds of warnings and locking the browser. Fixed height avoids the issue.
 * minWidth={0} prevents the same problem on the width axis.
 */
export default function SparkLine({ data, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height={48} minWidth={0}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
