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
  const page = getStaticPage('contribute');
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default function ContributePage() {
  const page = getStaticPage('contribute');
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
        height="min-h-[65vh]"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose-custom">
          <MDXRemote source={page.content} components={{ Tip, DidYouKnow, Impact, Callout }} />
        </article>
      </div>
    </>
  );
}
