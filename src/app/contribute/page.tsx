import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contribute',
  description: 'Write for EarthPulse — submission guidelines, editorial standards, and how to get your article published.',
};

const steps = [
  {
    num: '01',
    title: 'Pitch your idea',
    description: 'Open a GitHub issue titled "Article pitch: [your topic]" or email us at editorial@earthpulse.org. Include a one-paragraph summary, the pillar it fits, and the primary sources you plan to use. We respond within 5 working days.',
  },
  {
    num: '02',
    title: 'Write your draft',
    description: 'Once your pitch is accepted, write your article as a .mdx file following the content template. Aim for 600–1,500 words. Include a sources section at the end with links to all primary references.',
  },
  {
    num: '03',
    title: 'Submit a pull request',
    description: 'Fork the EarthPulse GitHub repository, add your .mdx file to the correct content folder, and open a pull request. Our editorial team will review for accuracy, tone, and style.',
  },
  {
    num: '04',
    title: 'Review and publish',
    description: 'We may suggest edits for clarity or accuracy. Once agreed, we merge the PR and your article goes live on the next Vercel deploy — usually within minutes.',
  },
];

const guidelines = [
  { title: 'Lead with evidence', body: 'Every factual claim must be traceable to a primary source. Cite sources inline using footnotes or a Sources section at the end. Do not rely on secondary aggregator sites as your primary reference.' },
  { title: 'Write for a curious non-specialist', body: 'Our readers are intelligent and engaged, but they may not have a science background. Avoid jargon without explanation, and use concrete examples and analogies to make abstract ideas tangible.' },
  { title: 'Be honest about uncertainty', body: 'Science is not always settled. If a claim is contested, say so. If the data shows a range of estimates, give the range. Intellectual honesty builds reader trust more than false certainty.' },
  { title: 'Distinguish science from policy', body: 'The science of climate change is consensus. What to do about it is a matter of ongoing debate. Keep these two domains clearly separated in your writing.' },
  { title: 'Include something actionable', body: 'Wherever possible, give readers something concrete to do with what they have just learned — a question to ask their representative, an organisation to support, a behaviour to consider.' },
  { title: 'Avoid doom and false hope equally', body: 'The environmental situation is serious. It is also not hopeless. We do not publish catastrophist content that leaves readers paralysed, nor green-washing that understates the challenge. Aim for accurate, motivating honesty.' },
];

export default function ContributePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="mb-16">
        <span className="text-5xl block mb-6">✍️</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Write for EarthPulse
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
          We welcome contributions from researchers, journalists, educators, practitioners, and knowledgeable citizens. If you have expertise and a story worth telling, we want to hear from you.
        </p>
      </div>

      {/* What we publish */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">What we publish</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { type: 'Explainers', desc: 'Clear, well-sourced breakdowns of complex scientific topics' },
            { type: 'Research summaries', desc: 'Accessible summaries of recent peer-reviewed papers' },
            { type: 'Initiative profiles', desc: 'Case studies of conservation, policy, or community projects in action' },
            { type: 'Opinion and analysis', desc: 'Evidence-based perspectives on environmental policy and practice — clearly labelled as opinion' },
            { type: 'Practical guides', desc: 'Actionable, researched guidance for individuals, educators, or organisations' },
            { type: 'Interviews', desc: 'Conversations with scientists, practitioners, and policymakers working on the front lines' },
          ].map(i => (
            <div key={i.type} className="card">
              <div className="font-semibold text-gray-900 dark:text-white mb-1">{i.type}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{i.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Submission process */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">How to submit</h2>
        <div className="space-y-6">
          {steps.map(s => (
            <div key={s.num} className="flex gap-5">
              <div className="shrink-0 w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900 border border-brand-200 dark:border-brand-700 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-300">
                {s.num}
              </div>
              <div className="pt-1.5">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{s.title}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial guidelines */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Editorial guidelines</h2>
        <div className="space-y-5">
          {guidelines.map(g => (
            <div key={g.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{g.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Article template */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Article template</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create your file as <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-brand-600 dark:text-brand-300">content/[pillar]/your-article-slug.mdx</code> using this frontmatter:</p>
        <div className="bg-gray-950 dark:bg-gray-900 rounded-xl p-5 overflow-x-auto">
          <pre className="text-sm text-gray-200 font-mono leading-relaxed">{`---
title: "Your article title"
description: "One sentence summary for SEO and article cards."
date: "2024-06-01"
author: "Your Name"
tags: ["climate", "forests"]
featured: false
coverImage: "/images/articles/your-image.jpg"  # optional
---

## Introduction

Your article content in Markdown...

<DidYouKnow>
  A surprising fact related to your topic.
</DidYouKnow>

## Sources

- [Source name](https://link-to-source.org)
- [Source name](https://link-to-source.org)`}</pre>
        </div>
      </section>

      {/* CTA */}
      <section className="card text-center py-10">
        <h2 className="text-xl font-bold mb-3">Ready to pitch?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Open a GitHub issue or send us an email with your topic idea. We look forward to reading it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://github.com/yourusername/earthpulse/issues/new" target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open a GitHub issue →
          </a>
          <a href="mailto:editorial@earthpulse.org" className="btn-outline">
            Email us
          </a>
        </div>
      </section>

    </div>
  );
}
