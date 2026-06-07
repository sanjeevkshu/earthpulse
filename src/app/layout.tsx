import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/components/layout/ThemeProvider';
import ObservatoryFAB from '@/components/observatory/ObservatoryFAB';

// next/font downloads Inter at build time, self-hosts it, and provides
// size-adjust fallback metrics that match the font exactly.
// This eliminates font-loading CLS (the overlay shift caused by the browser
// repainting when Inter replaces the system-ui fallback).
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: { default: 'EarthPulse — Environment, Ecosystems & Sustainability', template: '%s | EarthPulse' },
  description: 'Explore the science of our planet — ecosystems, biodiversity, human impact, and the initiatives shaping a sustainable future.',
  metadataBase: new URL('https://earthpulse.org'),
  openGraph: { type: 'website', siteName: 'EarthPulse' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* Mobile floating action button — lg:hidden, fixed bottom-right */}
          <ObservatoryFAB />
        </ThemeProvider>
      </body>
    </html>
  );
}
