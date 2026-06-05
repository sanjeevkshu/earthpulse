# EarthPulse — Local setup and launch guide

**Current version:** v2.5.0  
**Last updated:** Jun 2026

Follow these steps exactly. After step 4 you will have a running site at `localhost:3000`. After step 6 it will be live on the internet.

---

## Step 1 — Create the project scaffold

Run `setup.sh` from the artifacts, or do it manually:

```bash
npx create-next-app@latest earthpulse \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-git

cd earthpulse
npm install next-mdx-remote gray-matter reading-time date-fns
npm install @tailwindcss/typography
npm install next-themes
npm install -D @types/node
```

---

## Step 2 — Copy every file from the artifacts

Create each file at the path shown. The complete file list:

```
earthpulse/
├── .gitignore
├── package.json
├── next.config.ts                                 ← Next.js config (TypeScript, not .mjs)
├── tsconfig.json
│                                                  NOTE: No tailwind.config.ts — Tailwind v4 is
│                                                  configured entirely in src/app/globals.css via
│                                                  @theme, @plugin, and @custom-variant blocks.
├── README.md
├── functional_spec.md
├── technical_design.md
├── launch_guide.md
│
├── content/
│   ├── our-planet/
│   │   └── oceans.mdx                            ← artifact: content/our-planet/oceans.mdx
│   ├── through-time/
│   │   └── life-on-earth-timeline.mdx            ← artifact: content/through-time/...
│   ├── human-footprint/
│   │   └── agriculture-impact.mdx                ← artifact: content/human-footprint/...
│   ├── in-action/
│   │   └── 30x30-initiative.mdx                  ← artifact: content/in-action/...
│   ├── voices/
│   │   └── biodiversity-crisis-explainer.mdx     ← artifact: content/voices/...
│   └── take-action/
│       └── individual-actions.mdx                ← artifact: content/take-action/...
│
├── src/
│   ├── app/
│   │   ├── globals.css                           ← includes @custom-variant dark for next-themes
│   │   ├── layout.tsx                            ← wraps body in ThemeProvider
│   │   ├── page.tsx                              ← homepage with video hero banner
│   │   └── [pillar]/
│   │       ├── page.tsx                          ← pillar index with contextual banner image
│   │       └── [slug]/
│   │           └── page.tsx                      ← article page with cover image + callout components
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                        ← responsive nav with ThemeToggle
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeProvider.tsx                 ← next-themes provider (v2.0.0)
│   │   ├── ui/
│   │   │   ├── ThemeToggle.tsx                   ← sun/moon toggle button (v2.0.0)
│   │   │   ├── HeroMedia.tsx                     ← session-rotating hero background (v2.3.0)
│   │   │   ├── BannerImage.tsx                   ← generic image+gradient fallback (v2.3.0)
│   │   │   ├── PageHero.tsx                      ← full-bleed hybrid hero (v2.4.0)
│   │   │   └── NewsletterForm.tsx                ← Brevo embed placeholder (v2.5.0)
│   │   └── article/
│   │       ├── ArticleCard.tsx
│   │       ├── Tip.tsx                           ← amber callout (v2.2.0)
│   │       ├── DidYouKnow.tsx                    ← teal callout (v2.2.0)
│   │       ├── Impact.tsx                        ← orange callout (v2.2.0)
│   │       └── Callout.tsx                       ← generic icon+title card (v2.5.0)
│   └── lib/
│       ├── content.ts                            ← pillar article loader
│       ├── pages.ts                              ← static page loader (v2.5.0)
│       └── mediaConfig.ts                        ← all image/video URLs (v2.3.0)
│
└── public/
    └── images/                                   ← empty for now; add images here
```

---

## Step 3 — Run locally

```bash
cd earthpulse
npm run dev
```

Open **http://localhost:3000**

You should see:
- The homepage with hero, stats bar, pillar grid, and 6 article cards
- All six pillar pages working at `/our-planet`, `/voices`, etc.
- Each article accessible at e.g. `/our-planet/oceans`

---

## Step 4 — Initialise Git

```bash
git init
git add .
git commit -m "Initial commit — EarthPulse v2.2.0"
```

---

## Step 5 — Push to GitHub

```bash
# Create a new repo at github.com (do not initialise with README)
# Then:
git remote add origin https://github.com/YOURUSERNAME/earthpulse.git
git branch -M main
git push -u origin main
```

---

## Step 6 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign in with GitHub**
2. Click **New Project** → import `earthpulse`
3. All settings are auto-detected — click **Deploy**
4. Your site is live at `https://earthpulse.vercel.app` in ~90 seconds

---

## Step 7 — Add a custom domain (optional)

1. Buy your domain at [porkbun.com](https://porkbun.com) (~$10/year for `.org`)
2. In Vercel → Settings → Domains → **Add** your domain
3. Copy the DNS records Vercel provides
4. In Porkbun → DNS settings → add those records
5. SSL certificate is provisioned automatically — takes ~5 minutes

---

## Features active in this release (v2.5.0)

All features below ship in a fresh install. Version tags show when each was introduced.

| Feature | Version | Where |
|---------|---------|-------|
| Dark mode toggle | v2.0.0 | Navbar — desktop right side and beside mobile hamburger |
| Tailwind v4 dark fix | v2.1.0 | `src/app/globals.css` — `@custom-variant dark` |
| Homepage video hero | v2.2.0 | `src/app/page.tsx` — Google GCS video, Unsplash fallback image |
| Callout components | v2.2.0 | `<Tip>`, `<DidYouKnow>`, `<Impact>` — usable in any `.mdx` file |
| Media reliability | v2.3.0 | Unsplash images via next/image proxy; Google GCS video for CORS compliance |
| Session-rotating hero | v2.4.0 | 5 nature scenes rotate per browser session via `sessionStorage` |
| PageHero — pillar & article | v2.4.0 | Full-bleed, hybrid video/image; title/breadcrumb overlaid |
| Dynamic article cover | v2.4.0 | Tag-based image resolution: `coverImage` → tag map → pillar image |
| Static pages as MDX | v2.5.0 | About, Contribute, Newsletter, Privacy in `content/pages/` |
| `<Callout>` component | v2.5.0 | Generic icon+title card for static pages |

### Using callout components in MDX articles

```mdx
<DidYouKnow>
  Write a surprising fact here — supports **bold** and _italic_ Markdown.
</DidYouKnow>

<Impact>
  Describe scale or consequence. Numbers and **bold** work here too.
</Impact>

<Tip>
  Practical suggestion for the reader. Link to external resources if relevant.
</Tip>
```

### Adding a cover image to an article

Set `coverImage` in the frontmatter — use Unsplash CDN URLs (CORS-safe via next/image proxy) or relative paths:

```yaml
---
title: "My article"
coverImage: "https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1920&q=80"
---
```

Or for local images placed in `public/images/articles/`:

```yaml
coverImage: "/images/articles/my-image.jpg"
```

---

## Adding new articles

Just create a new `.mdx` file in the relevant content folder and push:

```bash
# Example: new article in voices
touch content/voices/rewilding-europe.mdx
# Write the article with frontmatter...
git add content/voices/rewilding-europe.mdx
git commit -m "Add article: rewilding Europe"
git push
# Vercel auto-rebuilds — article is live in ~90 seconds
```

No code changes needed. No CMS login. Just Markdown and Git.
