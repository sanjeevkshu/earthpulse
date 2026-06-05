import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How EarthPulse handles your data, cookies, and third-party services.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: June 2024</p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">

        <p>EarthPulse is committed to your privacy. This policy explains what data we collect, how we use it, and your rights. We have written it in plain language because you deserve to understand it.</p>

        <h2>What data we collect</h2>

        <h3>Data you give us</h3>
        <p>If you subscribe to our newsletter, we collect your email address and, optionally, your first name. This is used solely to send you the EarthPulse digest. We do not collect passwords, payment information, or any other personal details.</p>

        <h3>Data collected automatically</h3>
        <p>EarthPulse is a statically generated website with no server-side tracking. We do not run server-side analytics or logging. We do not use advertising networks.</p>
        <p>If we use a third-party analytics service in future (such as Plausible Analytics, which is privacy-preserving and GDPR-compliant by design), we will update this policy and notify newsletter subscribers before doing so.</p>

        <h3>Cookies and local storage</h3>
        <p>We use the browser's <code>localStorage</code> to remember your dark/light mode preference. This is a single key stored only on your device and is never transmitted to any server. It is not a tracking cookie and does not identify you.</p>
        <p>We do not use third-party tracking cookies.</p>

        <h2>How we use your data</h2>
        <ul>
          <li><strong>Email address:</strong> To send you the weekly EarthPulse newsletter if you have subscribed. Nothing else.</li>
          <li><strong>Theme preference:</strong> To remember your visual preference between visits. Never transmitted off your device.</li>
        </ul>

        <h2>Third-party services</h2>

        <h3>Brevo (newsletter delivery)</h3>
        <p>We use Brevo (formerly Sendinblue) to manage newsletter subscriptions and send emails. When you subscribe, your email address is stored on Brevo's servers in accordance with <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">Brevo's Privacy Policy</a>. Brevo is GDPR-compliant and processes data within the EU.</p>

        <h3>Vercel (hosting)</h3>
        <p>EarthPulse is hosted on Vercel. Vercel may log request metadata (IP address, browser type, pages visited) for security and performance purposes. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel's Privacy Policy</a> for details.</p>

        <h3>GitHub (open source repository)</h3>
        <p>Our code and content are hosted publicly on GitHub. If you contribute to the project via GitHub, your contributions are subject to <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub's Privacy Policy</a>.</p>

        <h2>Data sharing</h2>
        <p>We do not sell, rent, or share your personal data with any third party for commercial purposes. We do not use your data for advertising. We do not share data with data brokers.</p>
        <p>We may disclose data if legally required to do so by a court order or applicable law.</p>

        <h2>Your rights</h2>
        <p>If you are located in the European Union, United Kingdom, or another jurisdiction with privacy rights legislation, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent for newsletter communications at any time</li>
        </ul>
        <p>To exercise any of these rights, email us at <a href="mailto:privacy@earthpulse.org">privacy@earthpulse.org</a>. We will respond within 30 days.</p>

        <h2>Newsletter unsubscribe</h2>
        <p>Every newsletter email includes an unsubscribe link. Clicking it immediately removes your address from our mailing list. You can also email us at <a href="mailto:privacy@earthpulse.org">privacy@earthpulse.org</a> to request removal.</p>

        <h2>Children</h2>
        <p>EarthPulse is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.</p>

        <h2>Changes to this policy</h2>
        <p>If we make material changes to this policy, we will update the date at the top of this page and, where appropriate, notify newsletter subscribers. Continued use of EarthPulse after changes are posted constitutes acceptance of the updated policy.</p>

        <h2>Contact</h2>
        <p>Questions about this policy: <a href="mailto:privacy@earthpulse.org">privacy@earthpulse.org</a></p>

      </div>
    </div>
  );
}
