export default function Impact({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40 p-4">
      <span className="text-xl shrink-0 mt-0.5">⚡</span>
      <div className="text-sm leading-relaxed text-orange-900 dark:text-orange-200">
        <span className="font-semibold block mb-1">Impact</span>
        {children}
      </div>
    </div>
  );
}
