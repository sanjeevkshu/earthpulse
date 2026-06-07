'use client';
import Link from 'next/link';

/** Mobile floating action button — fixed bottom-right, hidden on lg+ screens. */
export default function ObservatoryFAB() {
  return (
    <Link
      href="/observatory"
      aria-label="Open Observatory"
      className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 rounded-full bg-brand-400 shadow-lg shadow-brand-400/30 flex items-center justify-center text-2xl hover:bg-brand-600 transition-colors"
    >
      🛰️
    </Link>
  );
}
