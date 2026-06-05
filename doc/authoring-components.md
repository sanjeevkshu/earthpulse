# MDX Component Reference

EarthPulse articles are written in **MDX** — Markdown with the ability to embed React components. You write normal Markdown paragraphs, headings, and lists as usual, and drop in named components when you want special visual treatments.

This document covers every component available to content authors.

---

## Available components

| Component | Where available | Visual style | Purpose |
|-----------|----------------|--------------|---------|
| [`<Tip>`](#tip) | Articles + static pages | 💡 Amber | Practical action or resource for the reader |
| [`<DidYouKnow>`](#didyouknow) | Articles + static pages | 🌍 Teal-green | Surprising fact or counterintuitive statistic |
| [`<Impact>`](#impact) | Articles + static pages | ⚡ Orange | Scale or consequence of an issue |
| [`<Callout>`](#callout) | Static pages only | Neutral card | Generic icon + title + body card |
| [`<NewsletterForm>`](#newsletterform) | `newsletter.mdx` only | Interactive | Topic selector + subscription form |

---

## `<Tip>`

**Use for:** practical actions, organisations to support, behaviour changes the reader can make, links to further resources.

**Visual:** amber/yellow background, 💡 icon.

### Syntax

```mdx
<Tip>
  Your tip text here. Supports **bold**, _italics_, and [links](https://example.org).
</Tip>
```

### Live example

```mdx
<Tip>
  Supporting Marine Protected Areas (MPAs) through advocacy or donation is one of the highest-impact ocean conservation actions available to individuals. Organisations like the [Marine Conservation Institute](https://marine-conservation.org) track and advocate for MPA expansion globally.
</Tip>
```

**Renders as:** amber box with 💡 icon and the text inside.

### Placement guidance

- Use at the end of a section or the end of the whole article
- One `<Tip>` per article is typical; two is the maximum
- Always include a concrete, actionable item — not a vague suggestion

---

## `<DidYouKnow>`

**Use for:** counterintuitive facts, surprising statistics, little-known connections between topics — things that make the reader pause.

**Visual:** brand teal-green background, 🌍 icon, "Did you know?" heading automatically added.

### Syntax

```mdx
<DidYouKnow>
  Your fact here. Supports **bold**, _italics_, and [links](https://example.org).
</DidYouKnow>
```

### Live example

```mdx
<DidYouKnow>
  The ocean produces around **50% of Earth's oxygen** — more than all the world's forests combined. Every second breath you take comes from the sea.
</DidYouKnow>
```

**Renders as:** teal box with 🌍 icon, "Did you know?" bold heading, and your text.

### Placement guidance

- Works best near the beginning of a section — hooks interest before the detailed explanation
- The fact should be verifiable and sourced (cite it in your Sources section)
- Avoid using more than one `<DidYouKnow>` per article

---

## `<Impact>`

**Use for:** the scale or consequence of an environmental problem — mortality figures, area lost, rate of change, economic cost. Makes abstract numbers concrete.

**Visual:** orange background, ⚡ icon, "Impact" heading automatically added.

### Syntax

```mdx
<Impact>
  Your impact statement here. Supports **bold**, _italics_, and [links](https://example.org).
</Impact>
```

### Live example

```mdx
<Impact>
  Back-to-back bleaching events in 2016–2017 killed approximately **50% of the Great Barrier Reef's** shallow-water corals — the largest die-off ever recorded on a single reef system.
</Impact>
```

**Renders as:** orange box with ⚡ icon, "Impact" bold heading, and your text.

### Placement guidance

- Place directly after establishing the context for the problem
- Lead with the most striking number; explain it in the surrounding prose
- Keep the text brief — one or two sentences is ideal

---

## Using all three together

A natural article pattern:

```mdx
## Coral reefs: the rainforests of the sea

Although coral reefs occupy less than 1% of the ocean floor, they harbour
approximately 25% of all marine species.

<DidYouKnow>
  Coral reefs generate an estimated **$375 billion** each year in goods and services
  for hundreds of millions of people worldwide.
</DidYouKnow>

They are also among the most threatened ecosystems on Earth. Rising sea temperatures
cause bleaching events that can kill entire reef structures within weeks.

<Impact>
  At current warming trajectories, **99% of the world's coral reefs** will experience
  bleaching severe enough to prevent recovery by 2100.
</Impact>

## What you can do

Individual choices around carbon footprint matter here more than in most ecosystems,
because reefs respond directly to global average temperature.

<Tip>
  The [Reef Check Foundation](https://www.reefcheck.org) trains citizen scientists
  to monitor coral health. You can join a survey team or donate to their global
  monitoring programme.
</Tip>
```

---

## `<Callout>`

**Use for:** static site pages (`content/pages/`) to create labelled information cards. Not typically used in regular articles — use `<Tip>`, `<DidYouKnow>`, or `<Impact>` there instead.

**Visual:** white card with border, optional emoji icon in left column, optional bold title.

### Syntax

```mdx
<Callout icon="🔬" title="Science-led">
  Every factual claim traces to a peer-reviewed source, government dataset,
  or reputable institution.
</Callout>
```

### Props

| Prop | Required | Description |
|------|----------|-------------|
| `icon` | Optional | Any emoji displayed in the left column |
| `title` | Optional | Bold heading above the body text |
| `children` | ✅ Required | The body text (supports Markdown inline formatting) |

### Examples

**With icon and title:**
```mdx
<Callout icon="🌍" title="Planet-first">
  We do not accept sponsorship from fossil fuel companies, industrial agriculture,
  or interests that profit from environmental harm.
</Callout>
```

**With icon only (no title):**
```mdx
<Callout icon="📬">
  Subscribe to our weekly digest — free, no spam, unsubscribe any time.
</Callout>
```

**With title only (no icon):**
```mdx
<Callout title="Step 03 — Submit a pull request">
  Fork the EarthPulse repository, add your `.mdx` file, and open a pull request.
  The editorial team will review for accuracy, tone, and style.
</Callout>
```

---

## `<NewsletterForm>`

Used exclusively in `content/pages/newsletter.mdx`. It renders the topic selector grid and the Brevo subscription form embed.

```mdx
<NewsletterForm />
```

Do not use this component in regular articles. It has no props.

---

## Standard Markdown elements

These work in all MDX files without any special components.

### Headings

```mdx
## Section heading (H2)
### Sub-section (H3)
```

Do **not** use `#` (H1) — the article title is the H1.

### Emphasis

```mdx
**Bold text** — for key statistics and terms
_Italic text_ — for species names, book titles, light emphasis
```

### Lists

```mdx
- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

### Links

```mdx
[Link text](https://destination.org)
```

### Code / technical values

```mdx
Inline: `pH 8.1`, `415 ppm`, `°C`
```

### Images (rare — prefer `coverImage` frontmatter)

```mdx
![Alt text describing the image](/images/articles/my-image.jpg)
```

Only use this for images that are part of the article content itself (diagrams, charts). For the article hero visual, use the `coverImage` frontmatter field instead.

### Horizontal rule

```mdx
---
```

Useful before a Sources section.

---

## What Markdown does NOT support in MDX

- Raw HTML `<div>`, `<span>`, `<table>` — use Markdown equivalents or a registered component
- Custom CSS — all styling is handled by Tailwind utility classes in the component code

---

## Do's and don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Use one `<DidYouKnow>` per article | Stack three callouts in a row |
| Place `<Tip>` at the end of a section | Put `<Tip>` in the middle of a sentence |
| Bold the key statistic inside a callout | Bold every sentence |
| Write callout text as 1–3 sentences | Write a full paragraph inside a callout |
| Use `<Callout>` in static pages | Use `<Callout>` in regular articles |
