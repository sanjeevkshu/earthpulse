# EarthPulse — Local setup and launch guide

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
npm install -D @types/node
```

---

## Step 2 — Copy every file from the artifacts

Create each file at the path shown. The complete file list:

```
earthpulse/
├── .gitignore                                     ← artifact: .gitignore
├── package.json                                   ← artifact: package.json
├── next.config.mjs                                ← artifact: next.config.mjs
├── tailwind.config.ts                             ← artifact: tailwind.config.ts
├── tsconfig.json                                  ← artifact: tsconfig.json
│
├── README.md                                      ← artifact: README.md
├── FUNCTIONAL_SPEC.md                             ← artifact: FUNCTIONAL_SPEC.md
├── TECHNICAL_DESIGN.md                            ← artifact: TECHNICAL_DESIGN.md
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
│   │   ├── globals.css                           ← artifact: src/app/globals.css
│   │   ├── layout.tsx                            ← artifact: src/app/layout.tsx
│   │   ├── page.tsx                              ← artifact: src/app/page.tsx
│   │   └── [pillar]/
│   │       ├── page.tsx                          ← artifact: src/app/[pillar]/page.tsx
│   │       └── [slug]/
│   │           └── page.tsx                      ← artifact: src/app/[pillar]/[slug]/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                        ← artifact: Navbar.tsx
│   │   │   └── Footer.tsx                        ← artifact: Footer.tsx
│   │   └── article/
│   │       └── ArticleCard.tsx                   ← artifact: ArticleCard.tsx
│   └── lib/
│       └── content.ts                            ← artifact: src/lib/content.ts
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
git commit -m "Initial commit — EarthPulse v1.0"
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
