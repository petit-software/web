# Petit Web — Project Guide

Marketing site for Petit. The codebase is built around a **landing-page template system**: each landing page is a markdown file declared in a registry and rendered through a single template route.

## Stack

- **Next.js 15** App Router, **React 19**, **TypeScript**
- **Framer Motion** (`framer-motion`) for animation — not `motion/react`
- **CSS Modules** + native CSS nesting + global token files (NO Tailwind, NO shadcn, NO styled-components)
- **gray-matter** + **react-markdown** + **remark-gfm** for landing-page content
- **next/image** for managed images
- **Netlify** deployment via `@netlify/plugin-nextjs`
- **npm** package manager

## File structure

```
/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                       # redirects to first landing page
│  ├─ globals.css
│  ├─ colors.css                     # design tokens
│  ├─ spacing.css                    # 4px-grid spacing scale
│  ├─ radius.css
│  ├─ typography.css
│  ├─ motion.css                     # easings, durations, shadows
│  ├─ [slug]/page.tsx                # catch-all landing route
│  └─ api/
│     └─ email-signup/route.ts       # Resend Contacts API
├─ components/
│  ├─ Button/
│  ├─ Logo/
│  ├─ LandingPageTemplate/           # composes Hero + body + CTA
│  ├─ LandingHero/                   # frontmatter-driven hero
│  ├─ LandingCTA/                    # frontmatter-driven CTA + EmailSignup
│  ├─ MarkdownContent/               # body renderer
│  └─ EmailSignup/                   # client form posting to /api/email-signup
├─ lib/
│  ├─ landing-pages.ts               # registry of slug → { title, description, ogImage }
│  ├─ markdown.ts                    # loader + image-path resolver
│  └─ metadata.ts                    # Next Metadata helpers
├─ content/
│  └─ landing/
│     └─ <slug>.md                   # one file per landing page
├─ public/
│  ├─ fonts/
│  ├─ images/
│  └─ blog/
│     └─ <slug>/                     # per-page image folder
├─ .env.example
└─ package.json
```

## Adding a new landing page

1. Add the slug to `landingSlugs` in `lib/landing-pages.ts` — the registry is now just a slug list. Per-page metadata lives in markdown frontmatter.
2. Create `content/landing/my-new-page.md` with the full frontmatter contract (`seo`, `aeo`, `hero`, `cta`). See `content/landing/README.md` for the authoring guide.
3. Drop images into `public/blog/my-new-page/` (including a 1200×630 `og.png`) and reference them in the MD by bare filename.
4. Done — the page is live at `/my-new-page`.

Only slugs in the registry are built (`dynamicParams = false`).

## Markdown frontmatter contract

Every landing-page `.md` file MUST include `seo` (description + ogImage), `aeo` (summary), `hero` (title), and `cta` (title). Build throws if any required field is missing. See `content/landing/README.md` for the canonical reference; the abbreviated contract:

```yaml
---
seo:
  title: "Optional override; defaults to hero.title"
  description: "1–2 sentence meta description."          # REQUIRED
  ogImage: "og.png"                                       # REQUIRED — 1200x630 in /blog/<slug>/
  ogImageAlt: "Describes the OG image"
  keywords: ["primary keyword", "another"]
  publishedAt: "2026-05-29T00:00:00.000Z"
  author: "Petit"
aeo:
  question: "The primary question this page answers?"
  summary: "1–3 sentence direct answer."                  # REQUIRED — rendered + emitted as JSON-LD
  faqs:
    - q: "First question?"
      a: "Plain-text answer."
hero:
  eyebrow: "optional small label"
  title: "Required headline"
  subtitle: "optional"
  image: "hero.png"           # resolved against /blog/<slug>/
  imageAlt: "describes image"
cta:
  title: "Required CTA headline"
  subtitle: "optional"
  buttonLabel: "Get notified"
  placeholder: "you@company.com"
  segmentId: "uuid-from-resend"
---

Body markdown goes here. Images use bare filenames:
![alt](some-image.png)
```

## SEO + AEO

Each landing page is SEO- and AEO-ready out of the box:

- **Meta + OG + Twitter** come from `seo.*` via `lib/metadata.ts` (`landingMetadata()`).
- **JSON-LD** (`@graph` with `WebPage` + `Article` + optional `FAQPage`) is built in `lib/structured-data.ts` (`landingJsonLd()`) and injected from `app/[slug]/page.tsx` as `<script type="application/ld+json">`.
- **`LandingAnswer`** renders `aeo.summary` as a calm "The short answer" lede directly under the hero — first content an answer engine encounters.
- **`LandingFAQ`** renders `aeo.faqs` (if present) as a `<dl>` Q&A list above the CTA, mirroring the `FAQPage` structured data for human readers.

## House style

**No emojis in landing-page content.** Body, headings, lists, tables, callouts, CTAs — all text. Brand voice is calm and confident; emojis undercut it. This rule is documented in `content/landing/README.md` and applies to any new landing-page content.

## Image path resolution

Inside `content/landing/<slug>.md` and in the `hero.image` frontmatter:

- bare filename (`hero.png`) → resolves to `/blog/<slug>/hero.png`
- absolute path (`/anything`) → used verbatim
- full URL (`https://...`) → used verbatim

Image folder MUST match the slug exactly: `public/blog/<slug>/`.

## Body layout directives

The markdown body supports container directives (via `remark-directive`) for layouts that escape the default prose column:

- `:::full-width` — edge-to-edge breakout; images inside lose their rounded frame and use `sizes="100vw"`.
- `:::wide` — wider than prose, still padded (good for tables, diagrams).
- `:::columns` + `:::column` — multi-column grid. Default is responsive auto-fit; `{variant=halves}` forces fixed 1/2+1/2; `{variant=thirds}` forces fixed 1/3+1/3+1/3 (both collapse to a single column under ~40rem).
- `:::callout{variant=tip|warn|note}` — accented highlight box; default is the accent blue.
- `::button[Label]{variant=… href=…}` — pill button; default `href` is `#signup` (the email form on `LandingCTA`, which has `id="signup"`). Variants mirror the Button component (`cta` default, plus `primary`/`secondary`/`outline`/`ghost`). Multiple buttons can be grouped inline with `:::buttons`.

Directives are configured in `components/MarkdownContent/MarkdownContent.tsx` (`DIRECTIVE_NAMES` + `remarkLandingDirectives`) and styled in `MarkdownContent.module.css` under `.prose :global(.md-…)`. Author-facing reference: `content/landing/README.md`.

## Resend signup

`/api/email-signup` creates a Resend contact via the official `resend` SDK (`resend.contacts.create({ email, segments })`). Audiences are deprecated in Resend — contacts are global and grouped via segments for broadcast targeting. Duplicate emails are treated as success (the SDK returns an "already exists" error which the route swallows). The route logs `source` (the landing slug) server-side.

**Per-form segments**: each landing page declares its own `cta.segmentId` in frontmatter. `<EmailSignup />` posts that segment ID to `/api/email-signup`, which adds the new contact to it. This lets the same component drop into multiple pages with different downstream segments. The segment ID is sent from the client — trusted because the worst case (someone POSTing a different segment ID) just shuffles signups between segments on the same Resend account.

Env vars:

- `RESEND_API_KEY` — required. Must be a **full-access** key; sending-only keys return 401 `restricted_api_key`.

The SDK returns `{ data, error }` and never throws on API errors — this route checks `error` explicitly (gotcha #5 from the Resend skill). The form returns a 503 with a friendly message when the API key is missing, so local dev works without keys.

## Theming (light + dark)

The site supports both light and dark modes. The mechanism:

- **Tokens** are defined twice in `app/colors.css`: on `:root` (light defaults) and on `[data-theme="dark"]` (dark overrides). Shadows in `app/motion.css` follow the same pattern.
- **No-flash init**: `lib/theme-init.ts` exports an inline script that runs in `<head>` before paint. It reads `localStorage["theme"]` (`"light"` or `"dark"`), falls back to OS preference, and sets `data-theme` + `color-scheme` on `<html>`.
- **Toggle**: `components/ThemeToggle/` is mounted in the root layout (fixed top-right). It writes the user's choice to `localStorage`.
- **Component rule**: NEVER hardcode `#fff`, `#000`, or `rgb(255 255 255 / X)` / `rgb(0 0 0 / X)` in component CSS. Use semantic tokens:
  - Surfaces: `--color-surface`, `--color-surface-raised`, `--color-surface-subtle`
  - Borders: `--color-border`, `--color-border-strong`
  - Text: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-fade-stop` (for gradient-text effects)
  - Hover overlays: `--color-overlay-faint`, `--color-overlay`, `--color-overlay-strong`
  - Status: `--color-danger`
- **SVGs**: use `currentColor` so they inherit the themed text color (see `components/Logo/parseLogo.ts` which auto-converts `"black"` fills to `currentColor`).

## Design system

Framer-inspired aesthetic. Tokens live in `app/*.css` and are loaded through `globals.css`:

- **Colors**: themed surfaces (`--color-surface`, `--color-surface-raised`, `--color-surface-subtle`), translucent borders, electric blue accent (`--color-accent`, `--color-accent-strong`, `--color-accent-soft`).
- **Spacing**: 4px grid, with `--space-1` through `--space-64`.
- **Radii**: `--radius-xs` → `--radius-3xl` plus `--radius-full` for pills.
- **Typography**: `Die Grotesk A` (already shipped). Utility classes: `type-hero`, `type-display`, `type-title`, `type-subtitle`, `type-body-regular`, `type-body-medium`, `type-small`, `type-eyebrow`.
- **Motion**: easings `--ease-expo-out`, `--ease-quart-out`, `--ease-soft`, `--ease-overshoot`. Durations `--duration-fast` (150ms) → `--duration-xslow` (650ms).
- **Containers**: `.container-sm` / `.container-md` / `.container-lg` / `.container-xl` apply max-width + page padding.

Button variants: `primary`, `secondary`, `outline`, `ghost`, `ghostOnDark`, `cta`. All pill-shaped via `--radius-full`.

## Conventions

- **Server Components by default**; opt into Client only for state, animation, browser APIs (`LandingHero`, `EmailSignup`).
- One folder per component: `Component.tsx`, `Component.module.css`, `index.ts`.
- Import via `@/components/...`, `@/lib/...`.
- Native CSS nesting inside `.module.css` (no preprocessor).
- Respect `prefers-reduced-motion` (handled globally in `globals.css` + via `useReducedMotion()` in Framer Motion components).
- Semicolons, accessible focus rings, keyboard-friendly forms.
- Add new abstractions only when logic repeats 3+ times.

## Run

```
npm install
npm run dev
```

Build:
```
npm run build
```
