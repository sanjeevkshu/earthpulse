import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Subscribe to the EarthPulse weekly digest — the most important environmental stories, research, and actions, delivered free to your inbox.',
};

const topics = [
  { icon: '🌊', label: 'Oceans & marine life' },
  { icon: '🌳', label: 'Forests & land' },
  { icon: '🌡️', label: 'Climate science' },
  { icon: '🦋', label: 'Biodiversity' },
  { icon: '⚡', label: 'Energy & policy' },
  { icon: '🤝', label: 'Action & solutions' },
];

const reasons = [
  { icon: '📖', text: 'One email per week — never more' },
  { icon: '🔬', text: 'Curated from peer-reviewed research and trusted institutions' },
  { icon: '🚫', text: 'No advertising, no sponsored content, no data selling' },
  { icon: '✂️', text: 'Unsubscribe in one click, any time' },
];

export default function NewsletterPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-5xl block mb-6">📬</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
          Stay close to the planet
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          The EarthPulse weekly digest brings you the most important environmental stories, new research, and meaningful actions — every week, free, no noise.
        </p>
      </div>

      {/* Why subscribe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {reasons.map(r => (
          <div key={r.text} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-xl">{r.icon}</span>
            <span>{r.text}</span>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-center">Choose your topics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {topics.map(t => (
            <div key={t.label} className="card flex items-center gap-3 py-3 px-4 cursor-pointer hover:border-brand-400 transition-colors">
              <span className="text-2xl">{t.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          Topic preferences coming soon — for now you will receive the full weekly digest.
        </p>
      </div>

      {/* Brevo embed placeholder */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">Subscribe</h2>

        {/* 
          BREVO EMBED INSTRUCTIONS:
          1. Create a free account at brevo.com
          2. Go to Contacts → Forms → Create a subscription form
          3. Copy the embed HTML Brevo provides
          4. Replace the placeholder div below with the Brevo embed code
          
          The form should collect: email address (required), first name (optional)
        */}

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Brevo subscription form</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Replace this block with your Brevo embed code.<br />
            See the inline comment above for setup instructions.
          </p>
        </div>
      </div>

      {/* Social proof / trust */}
      <div className="text-center text-sm text-gray-400 dark:text-gray-500">
        <p>By subscribing you agree to our <a href="/privacy" className="underline hover:text-brand-400 transition-colors">Privacy Policy</a>. We handle your data with care and never share it with third parties.</p>
      </div>

    </div>
  );
}
