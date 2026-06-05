import Link from 'next/link';

const sections = [
  { title: 'Explore', links: [
    { href: '/our-planet', label: 'Our Planet' },
    { href: '/through-time', label: 'Through Time' },
    { href: '/human-footprint', label: 'Human Footprint' },
    { href: '/in-action', label: 'In Action' },
    { href: '/voices', label: 'Voices & Research' },
    { href: '/take-action', label: 'Take Action' },
  ]},
  { title: 'Topics', links: [
    { href: '/tag/biodiversity', label: 'Biodiversity' },
    { href: '/tag/climate', label: 'Climate' },
    { href: '/tag/oceans', label: 'Oceans' },
    { href: '/tag/forests', label: 'Forests' },
    { href: '/tag/policy', label: 'Policy' },
    { href: '/tag/sustainability', label: 'Sustainability' },
  ]},
  { title: 'About', links: [
    { href: '/about', label: 'About EarthPulse' },
    { href: '/newsletter', label: 'Newsletter' },
    { href: '/contribute', label: 'Contribute' },
    { href: '/privacy', label: 'Privacy policy' },
  ]},
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-600 dark:text-brand-200 mb-3">
              <span>🌿</span> EarthPulse
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Understanding our planet — its past, present, and the future we can still shape together.
            </p>
          </div>
          {sections.map(s => (
            <div key={s.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">{s.title}</h3>
              <ul className="space-y-2">
                {s.links.map(l => (
                  <li key={l.href}><Link href={l.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} EarthPulse. Open-source. Built with care for the planet.</p>
          <p className="text-xs text-gray-400"><a href="https://github.com/yourusername/earthpulse" className="hover:text-brand-400 transition-colors">View on GitHub</a></p>
        </div>
      </div>
    </footer>
  );
}
