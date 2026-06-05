export default function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
      <span className="text-xl shrink-0 mt-0.5">💡</span>
      <div className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">{children}</div>
    </div>
  );
}
