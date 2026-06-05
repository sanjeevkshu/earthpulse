# 🌿 EarthPulse

**EarthPulse** is an open-source, content-first website about environment, ecosystems, biodiversity, and sustainability. It is built to inform the general public, support students and educators, and provide a research-grade reference for anyone who cares about the planet's future.

**Live site:** [earthpulse.org](https://earthpulse.org) *(once deployed)*
**Stack:** Next.js 14 · Tailwind CSS · MDX · Vercel · 100% free and open source

---

## Getting started

### Prerequisites

- Node.js v20 or later
- npm v9 or later
- A GitHub account (for deployment)

### Local development

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/earthpulse.git
cd earthpulse

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm run start
```

---

## Content structure

All content lives in the `/content` directory as `.mdx` files. Each file is a self-contained article with a YAML frontmatter block.

```
/content
  /our-planet          ← Ecosystems, biodiversity
  /through-time        ← Earth history, evolution
  /human-footprint     ← Human impact on the planet
  /in-action           ← Initiatives and solutions
  /voices              ← Blog, opinion, research
  /take-action         ← Practical guides
```

### Writing a new article

Create a new `.mdx` file in the appropriate pillar folder:

```markdown
---
title: "Your article title"
description: "A one-sentence summary used in cards and SEO."
date: "2024-06-01"
author: "Your Name"
tags: ["climate", "forests"]
featured: false
---

Your article content in Markdown...
```

**Frontmatter fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Article headline |
| `description` | Yes | Short summary (used in cards and meta tags) |
| `date` | Yes | ISO format: `YYYY-MM-DD` |
| `author` | No | Defaults to "EarthPulse Editorial" |
| `tags` | No | Array of lowercase tags |
| `featured` | No | `true` to show on homepage featured section |
| `coverImage` | No | Path relative to `/public/images/articles/` |

---

## Deployment

### Vercel (recommended — free)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **New Project** → select this repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Your site is live at a `.vercel.app` URL within ~90 seconds

### Adding a custom domain

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g. `earthpulse.org`)
3. Update your domain's DNS: add the CNAME or A records Vercel provides
4. SSL certificate is provisioned automatically via Let's Encrypt

---

## Tech stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | Static generation, SEO, routing |
| Styling | Tailwind CSS v4 | Utility-first, dark mode built-in |
| Content | MDX + gray-matter | Articles as versioned Markdown files |
| Search | Pagefind (phase 2) | Static, zero-server search |
| Newsletter | Brevo (free tier) | GDPR-ready, 300 emails/day free |
| Hosting | Vercel (free Hobby) | Auto-deploy, CDN, SSL, preview URLs |

---

## Contributing

Contributions are welcome — both content and code.

- **New articles:** Open a PR with your `.mdx` file in the correct pillar folder
- **Bug fixes / features:** Open an issue first to discuss, then submit a PR
- **Content corrections:** Even small fixes (typos, outdated statistics) matter

Please read `CONTRIBUTING.md` before submitting a pull request.

---

## Licence

MIT licence — see `LICENCE` file. Content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
