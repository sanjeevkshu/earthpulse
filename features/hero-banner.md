# Feature batch: Hero media + Article callout components

Build these three features in one pass. Read CLAUDE.md first for full project context.

---

## Feature 1 — Homepage hero video/image banner

### What to build
Replace the current gradient hero section in `src/app/page.tsx` with a full-bleed video/image hero. The video autoplays, is muted and looped. A dark gradient scrim overlays the media so the text remains legible. Respect `prefers-reduced-motion` by pausing the video and showing the fallback image instead.

### Media
- **Video:** `https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4`
- **Fallback image:** `https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1920`

### Implementation notes
- The hero section must be `relative` with `overflow-hidden`
- Video element: `autoPlay muted loop playsInline aria-hidden="true"` — `object-cover w-full h-full absolute inset-0`
- Scrim: `absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60`
- All existing text content and CTAs remain, positioned `relative z-10`
- Text colours: switch from dark to white since the background is now dark media — `text-white` for headline, `text-gray-200` for subtitle
- The animated pulse badge and CTAs remain unchanged in structure
- Use a `<picture>` or `<img>` fallback inside a `<noscript>` block and also as the poster attribute on the video element
- Add a CSS class or inline style that checks `prefers-reduced-motion: reduce` — if matched, set `video { display: none }` and show the fallback `<img>` instead
- The stats bar below the hero remains unchanged

### Approximate structure
```tsx
<section className="relative min-h-[85vh] flex items-center overflow-hidden">
  {/* video background */}
  {/* scrim overlay */}
  {/* existing hero text content — z-10, text-white */}
</section>
```

---

## Feature 2 — Pillar page contextual banner images

### What to build
Add a full-width banner image at the top of each pillar index page in `src/app/[pillar]/page.tsx`, above the existing pillar title/description block. Use `next/image` with `fill` layout inside a fixed-height container.

### Image map (add to PILLAR_META in src/lib/content.ts or define locally in the pillar page)

```ts
const PILLAR_IMAGES: Record<Pillar, string> = {
  'our-planet':      'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'through-time':    'https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'human-footprint': 'https://images.pexels.com/photos/929385/pexels-photo-929385.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'in-action':       'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'voices':          'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'take-action':     'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1920',
};
```

### Implementation notes
- Container: `relative w-full h-64 md:h-80 overflow-hidden` placed before the existing pillar header `<div>`
- Use `next/image` with `fill`, `objectFit="cover"`, `priority`
- Add a light bottom scrim `absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 to-transparent` so the page content below blends naturally
- Update `next.config.mjs` to allow `images.pexels.com` as a remote pattern:
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.pexels.com' },
    { protocol: 'https', hostname: 'videos.pexels.com' },
  ],
},
```

---

## Feature 3 — Article page cover image

### What to build
In `src/app/[pillar]/[slug]/page.tsx`, render a full-width hero image when `article.coverImage` is set in frontmatter. Show gracefully with no image when it is not set.

### Implementation notes
- Render between breadcrumb and article header — `relative w-full h-64 md:h-96 overflow-hidden rounded-xl mb-8`
- Use `next/image` with `fill`, `objectFit="cover"`, `priority`
- Only render when `article.coverImage` is truthy
- `coverImage` can be either a relative path (`/images/articles/my-image.jpg`) or an absolute Pexels URL

---

## Feature 4 — Article callout components

### What to build
Three new MDX-compatible React components. Create each in `src/components/article/`:

#### Tip.tsx
```tsx
export default function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
      <span className="text-xl shrink-0 mt-0.5">💡</span>
      <div className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">{children}</div>
    </div>
  );
}
```

#### DidYouKnow.tsx
```tsx
export default function DidYouKnow({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-950/40 p-4">
      <span className="text-xl shrink-0 mt-0.5">🌍</span>
      <div className="text-sm leading-relaxed text-brand-900 dark:text-brand-200">
        <span className="font-semibold block mb-1">Did you know?</span>
        {children}
      </div>
    </div>
  );
}
```

#### Impact.tsx
```tsx
export default function Impact({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40 p-4">
      <span className="text-xl shrink-0 mt-0.5">⚡</span>
      <div className="text-sm leading-relaxed text-orange-900 dark:text-orange-200">
        <span className="font-semibold block mb-1">Impact</span>
        {children}
      </div>
    </div>
  );
}
```

### Register components in article page
In `src/app/[pillar]/[slug]/page.tsx`, import all three and pass them to `MDXRemote`:

```tsx
import Tip from '@/components/article/Tip';
import DidYouKnow from '@/components/article/DidYouKnow';
import Impact from '@/components/article/Impact';

// in the JSX:
<MDXRemote source={article.content} components={{ Tip, DidYouKnow, Impact }} />
```

### Add callouts to an existing article as a smoke test
Add 2–3 callout examples to `content/our-planet/oceans.mdx` to verify they render correctly. For example after the "Coral reefs" section:

```mdx
<DidYouKnow>
  The ocean produces around **50% of Earth's oxygen** — more than all the world's forests combined.
</DidYouKnow>

<Impact>
  Back-to-back bleaching events in 2016–2017 killed approximately **50% of the Great Barrier Reef's** shallow-water corals.
</Impact>

<Tip>
  Supporting Marine Protected Areas (MPAs) through advocacy or donation is one of the highest-impact ocean conservation actions available to individuals.
</Tip>
```

---

## Verification checklist

```bash
npm run dev
```

- [ ] Homepage hero shows video background with text overlay on desktop and mobile
- [ ] Video pauses and still image shows when `prefers-reduced-motion` is enabled in OS settings
- [ ] Each pillar index page shows a contextual banner image
- [ ] Article page shows cover image when `coverImage` is set; clean layout when not set
- [ ] Callout boxes render correctly in oceans.mdx article — amber Tip, teal DidYouKnow, orange Impact
- [ ] All three callouts work in dark mode
- [ ] No TypeScript errors, no console errors

```bash
npm run build
```

- [ ] Build completes with no errors
- [ ] No `next/image` hostname warnings