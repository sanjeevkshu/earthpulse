'use client';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import type { MetricDataset } from '@/lib/observatory';

interface Props {
  data: MetricDataset['series'];
  color: string;
}

/** Minimal sparkline — no axes, no grid, thin coloured line only. */
export default function SparkLine({ data, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
