import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getStaticPage } from '@/lib/pages';
import PageHero from '@/components/ui/PageHero';
import Tip from '@/components/article/Tip';
import DidYouKnow from '@/components/article/DidYouKnow';
import Impact from '@/components/article/Impact';
import Callout from '@/components/article/Callout';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  const page = getStaticPage('privacy');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    // Privacy pages should not be indexed by search engines by default
    robots: { index: false },
  };
}

export default function PrivacyPage() {
  const page = getStaticPage('privacy');
  if (!page) notFound();
  return (
    <>
      <PageHero
        imageSrc={page.coverImage ?? page.gradientFallback}
        videoSrc={page.videoSrc}
        gradientFallback={page.gradientFallback}
        badge={page.icon ? <span className="text-4xl" aria-hidden="true">{page.icon}</span> : undefined}
        title={page.title}
        subtitle={page.description}
        height="min-h-[50vh]"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {page.date && (
          <p className="text-sm text-gray-400 mb-8">Last updated: {new Date(page.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        )}
        <article className="prose-custom">
          <MDXRemote source={page.content} components={{ Tip, DidYouKnow, Impact, Callout }} />
        </article>
      </div>
    </>
  );
}
