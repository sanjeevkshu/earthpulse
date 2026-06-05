# Feature: Dark mode toggle

## What to build

Add a persistent dark/light mode toggle to the EarthPulse site.

---

## Step 1 — Install dependency

```bash
npm install next-themes
```

---

## Step 1b — Configure Tailwind v4 class-based dark variant ⚠️ Required

> **Tailwind v4 breaking difference:** In Tailwind v4, the `dark:` utility variant defaults to
> `@media (prefers-color-scheme: dark)` — the OS media query. `next-themes` works by toggling
> a `.dark` class on `<html>`. These two mechanisms are incompatible without an explicit override.
> Without this step, all `dark:*` inline utilities silently ignore the manual toggle and only
> react to the user's OS setting.

In `src/app/globals.css`, add this line immediately after the `@import` / `@plugin` block:

```css
/* Wire dark: utilities to the .dark class that next-themes applies to <html> */
@custom-variant dark (&:where(.dark, .dark *));
```

This tells Tailwind that the `dark:` variant should activate whenever an element is `.dark`
or is a descendant of `.dark` — which is exactly what `next-themes` sets.

---

## Step 2 — Create src/components/layout/ThemeProvider.tsx

```tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
```

---

## Step 3 — Create src/components/ui/ThemeToggle.tsx

```tsx
'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="5" strokeWidth="2"/>
          <path strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}
```

---

## Step 4 — Update src/app/layout.tsx

Import `ThemeProvider` and wrap the body content with it. The `<html>` tag must have `suppressHydrationWarning`.

Key change — replace the body content:
```tsx
// Add import at top:
import ThemeProvider from '@/components/layout/ThemeProvider';

// Wrap body children:
<body className="min-h-screen flex flex-col">
  <ThemeProvider>
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </ThemeProvider>
</body>
```

---

## Step 5 — Update src/components/layout/Navbar.tsx

Import `ThemeToggle` and add it in two places:

1. **Desktop nav** — inside the `hidden lg:flex items-center gap-2` div, before the Subscribe button
2. **Mobile** — wrap the existing hamburger button in a flex div alongside `ThemeToggle`

```tsx
// Add import at top:
import ThemeToggle from '@/components/ui/ThemeToggle';

// Desktop (replace the existing right-side div):
<div className="hidden lg:flex items-center gap-2">
  <ThemeToggle />
  <Link href="/newsletter" className="btn-primary text-xs py-2 px-4">Subscribe</Link>
</div>

// Mobile (replace the existing hamburger button with):
<div className="flex lg:hidden items-center gap-1">
  <ThemeToggle />
  <button
    className="p-2 rounded-md text-gray-600 dark:text-gray-300"
    onClick={() => setOpen(o => !o)}
    aria-label="Toggle menu"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {open
        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
    </svg>
  </button>
</div>
```

---

## Step 6 — Verify

```bash
npm run dev
```

Check:
- [ ] Toggle button visible in Navbar on desktop (right side, before Subscribe)
- [ ] Toggle button visible on mobile (beside hamburger)
- [ ] Clicking toggles between sun icon (dark mode) and moon icon (light mode)
- [ ] Theme persists after page refresh
- [ ] On first visit, theme matches OS system preference
- [ ] No hydration warning in browser console

```bash
npm run build
```

Confirm clean build with no TypeScript errors.

---

## Files changed summary

| File | Action |
|------|--------|
| `src/app/globals.css` | Update — add `@custom-variant dark` to enable class-based dark mode |
| `src/components/layout/ThemeProvider.tsx` | Create new |
| `src/components/ui/ThemeToggle.tsx` | Create new |
| `src/app/layout.tsx` | Update — add ThemeProvider import and wrapper |
| `src/components/layout/Navbar.tsx` | Update — add ThemeToggle in desktop and mobile |

---

## Tailwind v4 + next-themes: how they fit together

| Layer | Mechanism | Who sets it |
|-------|-----------|-------------|
| `next-themes` | Adds/removes `.dark` class on `<html>` | ThemeProvider on client |
| Tailwind `dark:` utilities (v4 default) | `@media (prefers-color-scheme: dark)` | OS only — **ignores class** |
| Tailwind `dark:` utilities (after fix) | `.dark` ancestor selector | next-themes class ✅ |
| Custom CSS `.dark .classname` rules | CSS descendant selector | next-themes class ✅ (always worked) |

The `@custom-variant dark` line is the bridge that makes Tailwind's `dark:` utilities
respond to next-themes' class instead of the OS media query.