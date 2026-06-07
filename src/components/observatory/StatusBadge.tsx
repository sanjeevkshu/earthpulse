'use client';
import type { ThresholdStatus } from '@/lib/observatory';

const CONFIG: Record<ThresholdStatus, { label: string; classes: string }> = {
  safe:     { label: 'Within range', classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  caution:  { label: 'Caution',      classes: 'bg-amber-500/20  text-amber-400  border-amber-500/30'  },
  critical: { label: 'Critical',     classes: 'bg-red-500/20    text-red-400    border-red-500/30'    },
};

export default function StatusBadge({ status }: { status: ThresholdStatus }) {
  const c = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${c.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}
