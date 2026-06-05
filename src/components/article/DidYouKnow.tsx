export default function DidYouKnow({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-950/40 p-4">
      <span className="text-xl shrink-0 mt-0.5">🌍</span>
      <div className="text-sm leading-relaxed text-brand-900 dark:text-brand-200">
        <span className="font-semibold block mb-1">Did you know?</span>
        {children}
      </div>
    </div>
  );
}
