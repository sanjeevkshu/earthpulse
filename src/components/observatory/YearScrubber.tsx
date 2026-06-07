'use client';
interface Props { year: number; min: number; max: number; onChange: (y: number) => void; }

export default function YearScrubber({ year, min, max, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 dark:text-gray-500 w-10 shrink-0">{min}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={year}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded cursor-pointer accent-brand-400"
        aria-label={`Baseline year: ${year}`}
      />
      <span className="text-xs text-gray-400 dark:text-gray-500 w-10 shrink-0 text-right">{max}</span>
      <span className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right tabular-nums">{year}</span>
    </div>
  );
}
