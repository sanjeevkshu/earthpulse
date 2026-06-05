'use client';
import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';

const links = [
  { href: '/our-planet',       label: 'Our Planet' },
  { href: '/through-time',     label: 'Through Time' },
  { href: '/human-footprint',  label: 'Human Footprint' },
  { href: '/in-action',        label: 'In Action' },
  { href: '/voices',           label: 'Voices & Research' },
  { href: '/take-action',      label: 'Take Action' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-600 dark:text-brand-200">
            <span className="text-xl">🌿</span>EarthPulse
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {links.map(l => <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>)}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/newsletter" className="btn-primary text-xs py-2 px-4">Subscribe</Link>
          </div>
          <div className="flex lg:hidden items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-md text-gray-600 dark:text-gray-300"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-3">
          {links.map(l => <Link key={l.href} href={l.href} className="block nav-link py-1" onClick={() => setOpen(false)}>{l.label}</Link>)}
          <Link href="/newsletter" className="btn-primary mt-2 w-full justify-center text-sm">Subscribe to newsletter</Link>
        </div>
      )}
    </header>
  );
}
