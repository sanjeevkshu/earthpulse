# Authoring Articles

This guide covers everything you need to write and publish a new article on EarthPulse — from choosing the right pillar to the final Git push.

---

## 1. Where articles live

Each article is a single `.mdx` file inside one of six pillar folders:

```
content/
  our-planet/          → Ecosystems, biodiversity, oceans, forests, soil
  through-time/        → Earth history, geological epochs, evolution, mass extinctions
  human-footprint/     → Climate impact, agriculture, deforestation, pollution
  in-action/           → Policy, conservation initiatives, rewilding, MPAs
  voices/              → Opinion, research summaries, expert interviews
  take-action/         → Practical guides for individuals and organisations
```

**Choose the pillar that best matches the primary focus of your article.** When in doubt, `voices/` is the general editorial space.

---

## 2. File naming

Use a lowercase slug with hyphens. No spaces, no special characters.

```
content/our-planet/deep-ocean-biodiversity.mdx
content/voices/rewilding-europe-success-stories.mdx
content/take-action/reducing-food-waste.mdx
```

The slug becomes the URL: `/our-planet/deep-ocean-biodiversity`

---

## 3. Frontmatter — complete reference

Every article starts with a YAML frontmatter block between `---` delimiters.

```yaml
---
title: "Your article title in plain language"
description: "One sentence that summarises the article for cards and search engines. Aim for 130–160 characters."
date: "2024-07-15"
author: "Your Name"
tags: ["climate", "forests", "policy"]
featured: false
coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"
---
```

### Field reference

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `title` | ✅ Yes | string | Shown as the page `<h1>` and in article cards. Keep under 80 characters. |
| `description` | ✅ Yes | string | Used for SEO `<meta description>` and the card subtitle. 130–160 chars ideal. |
| `date` | ✅ Yes | `YYYY-MM-DD` | Publication date. Use ISO format exactly: `"2024-07-15"`. |
| `author` | ✗ Optional | string | Defaults to `"EarthPulse Editorial"` if omitted. |
| `tags` | ✗ Optional | string array | See tag list below. Drives tag pages and dynamic cover image lookup. |
| `featured` | ✗ Optional | boolean | `true` = appears in the homepage "Featured stories" section. Max 3 featured at a time. Defaults to `false`. |
| `coverImage` | ✗ Optional | URL string | Hero image for the article page. See [authoring-media.md](./authoring-media.md). Falls back to pillar image if omitted. |

### Common tags

Use tags from this list where possible to activate the tag pages and dynamic cover image matching:

`oceans` · `biodiversity` · `climate` · `ecosystems` · `forests` · `agriculture` · `food systems` · `deforestation` · `policy` · `government` · `conservation` · `sustainability` · `evolution` · `geology` · `history` · `extinction` · `science` · `action` · `lifestyle`

You may add new tags — they will automatically get a tag page at `/tag/your-tag`.

---

## 4. Complete article example

```mdx
---
title: "Why mangroves are the unsung heroes of coastal protection"
description: "Mangrove forests protect coastlines, sequester carbon at three times the rate of tropical rainforests, and support fisheries that feed millions — yet they are disappearing at alarming speed."
date: "2024-08-20"
author: "Dr. Marina Costa"
tags: ["oceans", "biodiversity", "climate", "forests", "conservation"]
featured: false
coverImage: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=1920&q=80"
---

## What makes mangroves extraordinary

Mangroves are salt-tolerant trees that grow at the intersection of land and sea across tropical and subtropical coastlines. They are among the most productive ecosystems on Earth.

A single hectare of mangrove forest can sequester up to **1,500 tonnes of carbon** — three to five times more than terrestrial tropical forests.

<DidYouKnow>
  Mangroves cover less than 0.5% of the world's coastlines but support roughly **80% of global fish catches**. Their root systems are nurseries for juvenile fish that later populate open ocean fisheries.
</DidYouKnow>

## The threat

Global mangrove cover has declined by 35–50% since the 1980s, primarily due to:

- Aquaculture ponds, particularly shrimp farming
- Coastal development and tourism infrastructure
- Agricultural expansion
- Sea level rise and increased storm intensity

<Impact>
  The equivalent of a football pitch of mangrove forest is lost every two hours. At current rates, 100% of the world's mangroves could be gone within 100 years.
</Impact>

## Restoration efforts

Community-led restoration projects in the Philippines, Indonesia, and Mozambique have demonstrated that mangroves recover quickly when replanting uses local species and restoration of natural tidal flows.

The key insight: mangroves do not need to be planted — they colonise naturally if the hydrology is right. Removing dams and berms is often more effective than seedling programmes.

<Tip>
  The [Global Mangrove Alliance](https://www.mangrovealliance.org) tracks restoration commitments. You can support restoration through organisations like Earthwatch or Wetlands International, both of which run community-based projects.
</Tip>

## What the numbers show

Restoring 15 million hectares of mangroves — roughly the estimated pre-1980 coverage — would:

- Sequester 9 billion tonnes of CO₂
- Protect 18 million people from coastal flooding annually
- Generate $82 billion in fisheries and coastal protection value

## Sources

- Hamilton, S.E. & Casey, D. (2016). Creation of a high spatio-temporal resolution global database of continuous mangrove forest cover. *Global Ecology and Biogeography*
- Alongi, D.M. (2014). Carbon cycling and storage in mangrove forests. *Annual Review of Marine Science*
- IUCN Red List of Ecosystems — Mangrove assessments
- Global Mangrove Alliance (2023). *State of the World's Mangroves*
```

---

## 5. Content structure guidelines

### Headings

Use `##` (H2) for main sections and `###` (H3) for sub-sections. Do not use `#` (H1) — the article title is already the page H1.

```mdx
## The main section heading

### A sub-section within it
```

### Paragraphs

Write in plain, active sentences. Avoid passive voice and jargon. If you must use a technical term, define it in the same sentence.

### Bold and emphasis

- Use `**bold**` for key terms, statistics, and quantities you want the reader to notice.
- Use `_italics_` sparingly — for species names (`_Homo sapiens_`), book titles, and genuine emphasis.

### Lists

Use bullet lists for four or more related items. Numbered lists when sequence matters.

### Links

```mdx
[Link text](https://destination-url.org)
```

All external links open in the same tab by default. That is fine.

### Code and data

Use backticks for inline values: `ppm`, `°C`, `pH 8.1`.

Use fenced code blocks (` ``` `) for multi-line data tables or sequences.

---

## 6. Callout components

Callouts break up long prose and draw attention to key facts, impacts, and actions. See [authoring-components.md](./authoring-components.md) for full usage.

Quick reference:

```mdx
<DidYouKnow>
  A surprising or counterintuitive fact the reader probably doesn't know.
</DidYouKnow>

<Impact>
  The scale or consequence of the issue — numbers, percentages, comparisons.
</Impact>

<Tip>
  A practical action the reader can take, or an organisation to support.
</Tip>
```

**Placement guidance:**
- One callout per major section is the maximum — avoid clustering.
- `DidYouKnow` works best early in a section to hook interest.
- `Impact` works best after establishing the problem.
- `Tip` works best at the end of the article or a section.

---

## 7. Sources section

End every article with a sources section. Use `##` heading:

```mdx
## Sources

- [IPCC Sixth Assessment Report (2023)](https://www.ipcc.ch/ar6)
- Hamilton, S.E. & Casey, D. (2016). *Global Ecology and Biogeography*, 25(6).
- [IUCN Red List](https://www.iucnredlist.org) — accessed July 2024
```

Primary sources (peer-reviewed papers, government datasets, IPCC/IPBES reports) are preferred over secondary sources.

---

## 8. Word count

| Article type | Target length |
|---|---|
| News / research summary | 400–700 words |
| Explainer | 700–1,200 words |
| Deep dive / long-form | 1,200–2,500 words |

---

## 9. Publishing workflow

```bash
# 1. Create your file in the right pillar folder
touch content/voices/my-article-slug.mdx

# 2. Write your article, save, and preview locally
npm run dev
# → open http://localhost:3000/voices/my-article-slug

# 3. Check it looks correct. Then:
git add content/voices/my-article-slug.mdx
git commit -m "Add article: My article title"
git push

# → Vercel auto-builds and deploys in ~90 seconds
# → Live at https://earthpulse.org/voices/my-article-slug
```

**To submit via pull request** (for external contributors):
1. Fork the repository on GitHub
2. Create a new branch: `git checkout -b article/my-article-slug`
3. Add your `.mdx` file
4. Open a pull request — the editorial team will review within 5 working days

---

## 10. Checklist before publishing

- [ ] Frontmatter has `title`, `description`, `date`, `tags`
- [ ] `date` is in `YYYY-MM-DD` format
- [ ] All factual claims have a cited source
- [ ] `coverImage` is set with a valid Unsplash URL (see [authoring-media.md](./authoring-media.md))
- [ ] Article renders correctly at `http://localhost:3000/[pillar]/[slug]`
- [ ] Sources section present at the end
- [ ] Spelling and grammar checked
