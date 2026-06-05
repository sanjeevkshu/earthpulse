import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'EarthPulse — Environment, Ecosystems & Sustainability', template: '%s | EarthPulse' },
  description: 'Explore the science of our planet — ecosystems, biodiversity, human impact, and the initiatives shaping a sustainable future.',
  metadataBase: new URL('https://earthpulse.org'),
  openGraph: { type: 'website', siteName: 'EarthPulse' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
