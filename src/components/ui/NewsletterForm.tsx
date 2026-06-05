'use client';

/**
 * NewsletterForm — topic selector and Brevo subscription form embed.
 *
 * Used as a custom MDX component in content/pages/newsletter.mdx.
 * The Brevo embed is a placeholder — replace the inner div with your
 * Brevo-generated embed HTML once you have created a subscription form
 * at brevo.com → Contacts → Forms.
 */

const TOPICS = [
  { icon: '🌊', label: 'Oceans & marine life' },
  { icon: '🌳', label: 'Forests & land' },
  { icon: '🌡️', label: 'Climate science' },
  { icon: '🦋', label: 'Biodiversity' },
  { icon: '⚡', label: 'Energy & policy' },
  { icon: '🤝', label: 'Action & solutions' },
];

export default function NewsletterForm() {
  return (
    <div className="space-y-8 my-8 not-prose">
      {/* Topic preference grid */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Choose your topics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOPICS.map(t => (
            <div
              key={t.label}
              className="card flex items-center gap-3 py-3 px-4 cursor-default"
            >
              <span className="text-xl" aria-hidden="true">{t.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          Topic preferences coming soon — for now you will receive the full weekly digest.
        </p>
      </div>

      {/* Brevo subscription form */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Subscribe</h3>

        {/*
          BREVO SETUP INSTRUCTIONS:
          1. Create a free account at brevo.com
          2. Go to Contacts → Forms → Create a subscription form
          3. Collect: email address (required), first name (optional)
          4. Copy the embed HTML Brevo generates
          5. Replace the placeholder <div> below with that embed code
        */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
            Brevo subscription form
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Replace this block with your Brevo embed code.
          </p>
        </div>
      </div>
    </div>
  );
}
