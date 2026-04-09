# Website Recreation Prompt

```text
Recreate this marketing website as a production-quality codebase using the exact architectural style below.

Tech stack:
- Next.js 16 App Router
- React 19
- TypeScript
- motion.dev via `motion/react`
- CSS Modules plus global token files
- `next/image` for images
- Netlify deployment with `@netlify/plugin-nextjs`
- npm as package manager

Dependencies to use when relevant:
- next
- react
- react-dom
- motion
- embla-carousel
- embla-carousel-react

Do not add Tailwind, shadcn, styled-components, Framer Motion, or any new UI kit.

Use this file/folder structure and stay close to it:

/
├─ app/
│  ├─ globals.css
│  ├─ colors.css
│  ├─ spacing.css
│  ├─ radius.css
│  ├─ typography.css
│  ├─ api/
│  │  └─ email-signup/
│  │     └─ route.ts
│  └─ (site)/
│     ├─ layout.tsx
│     ├─ page.tsx
│     ├─ access/
│     │  ├─ page.tsx
│     │  └─ page.module.css
│     ├─ about/
│     │  ├─ page.tsx
│     │  ├─ page.module.css
│     │  └─ components/
│     │     ├─ Header/
│     │     ├─ WhyRuby/
│     │     ├─ WeBelieve/
│     │     ├─ OurApproach/
│     │     ├─ Team/
│     │     └─ CallToAction/
│     ├─ home/
│     │  ├─ page.tsx
│     │  ├─ HomePage.tsx
│     │  └─ components/
│     │     ├─ Hero/
│     │     ├─ Features/
│     │     ├─ BuiltWithAndFor/
│     │     ├─ HowItWorks/
│     │     ├─ WhatYouGet/
│     │     ├─ HowWeHelp/
│     │     ├─ Mission/
│     │     ├─ PowerUp/
│     │     └─ FooterNanoAccessButton/
│     ├─ manifest/
│     │  ├─ page.tsx
│     │  └─ page.module.css
│     └─ (legal)/
│        ├─ page.module.css
│        ├─ components/
│        │  └─ LastUpdate.tsx
│        ├─ content/
│        │  ├─ types.ts
│        │  ├─ privacy.ts
│        │  ├─ terms.ts
│        │  └─ imprint.ts
│        ├─ privacy/page.tsx
│        ├─ terms/page.tsx
│        └─ imprint/page.tsx
├─ components/
│  ├─ Button/
│  ├─ Header/
│  ├─ Footer/
│  ├─ FooterSmall/
│  ├─ FooterNano/
│  ├─ PageTransition/
│  ├─ SiteMenu/
│  ├─ CookieBanner/
│  ├─ Modal/
│  ├─ EmailSignup/
│  └─ Icon/
├─ lib/
│  └─ metadata.ts
├─ public/
├─ next.config.ts
├─ netlify.toml
├─ tsconfig.json
└─ package.json

Folder structure rules:
- Put route files under `app/`
- Keep page-specific sections inside that route’s own `components/` folder
- Keep shared UI primitives and cross-page components in top-level `components/`
- Keep small shared helpers like metadata builders in `lib/`
- Keep component files grouped by folder:
  - `Component.tsx`
  - `Component.module.css`
  - `index.ts` when useful
- Use route groups like `(legal)` when it helps group related pages without affecting the URL
- Put server API handlers in `app/api/.../route.ts`
- Keep global design tokens in top-level CSS files under `app/`

Code style:
- Keep components small and composable
- Prefer one folder per component with `Component.tsx`, `Component.module.css`, and `index.ts`
- Use semicolons
- Prefer straightforward React code over heavy abstractions
- Create new abstractions only if logic repeats 3+ times
- Keep presentational components simple and move interactive behavior into client components
- Use accessible semantics, keyboard support, and visible focus states
- Respect `prefers-reduced-motion`
- Use import aliases like `@/components/...` and `@/lib/...`

App Router rules:
- Default to Server Components
- Use Client Components only for animations, state, effects, browser APIs, menus, modals, carousels, or other interactive UI
- Use a single-language setup for now
- Keep routing simple
- Use `generateMetadata` for SEO where useful

Metadata and SEO:
- Use Next.js Metadata API via `generateMetadata`
- Create a shared helper in `lib/metadata.ts` for `metadataBase`, canonical URLs, and reusable metadata builders
- Set per-page `title`, `description`, `openGraph`, and `twitter`
- Use a shared OG image where appropriate
- Include canonical URLs for each page
- Add `robots.ts` and `sitemap.ts`
- Add JSON-LD structured data for `Organization` and `WebSite` where appropriate
- Keep the implementation clean and server-first
- Do not use third-party SEO libraries unless absolutely necessary

AI/crawler discoverability:
- Include clean semantic HTML
- Add JSON-LD structured data
- Add `robots.ts` and `sitemap.ts`
- Optionally include `llms.txt` for AI-readable site context if requested

Styling rules:
- Use CSS Modules for component styling
- Use native CSS nesting inside modules — this is the CSS Nesting spec (supported in all modern browsers, no preprocessor needed). Nest child selectors and pseudo-classes directly inside the parent rule, the same way you would in SCSS:
  ```css
  .footer {
    display: flex;

    .footerText {
      font-size: var(--text-sm);
    }

    &:hover {
      opacity: 0.8;
    }
  }
  ```
- Reuse global design tokens from CSS custom properties for:
  - spacing
  - radius
  - colors
  - typography
  - shadows
- Use `rem` units
- Match a clean, minimal, premium healthcare-tech aesthetic
- Use lots of whitespace, restrained color, rounded surfaces, subtle borders, and sharp typography
- Keep motion subtle, mostly opacity and transform
- Avoid flashy effects

Global design system to preserve:
- Inter Variable font
- Utility typography classes like `type-hero`, `type-display`, `type-title`, `type-body-regular`, `type-body-medium`
- Utility layout classes like `container-md`, `container-rg`, `container-sm`, `row`, `col`
- Token files for `colors.css`, `spacing.css`, `radius.css`, `typography.css`, and a shared `globals.css`
- Button variants such as `primary`, `secondary`, `outline`, `ghost`, `ghostOnDark`, `cta`
- Rounded pill buttons and soft transitions
- Sticky translucent header
- High-end editorial landing-page spacing

Animation rules:
- Use `motion/react`, not Framer Motion
- Use `useReducedMotion()` where appropriate
- Page transitions should be gentle fade/slide-in
- Menus and overlays should animate with opacity + translateY
- Use dynamic import with `ssr: false` for browser-only animated libraries when needed

Implementation details to preserve:
- Use `next/image` for all managed images
- Use normal Next.js internal navigation
- Use server-rendered sections by default
- Use client-only components for menu, modal, ticker, transitions, and any browser-dependent interaction
- Use an API route for email signup if needed
- Keep code Netlify-friendly

Output requirements:
1. Generate the full file structure.
2. Create complete code files, not pseudo-code.
3. Include global CSS token files and component CSS modules.
4. Include accessible states and reduced-motion handling.
5. Keep the implementation close to a real, maintainable production repo.

Quality bar:
- No unnecessary client components
- No extra dependencies
- Clean TypeScript types
- Mobile responsive
- Keyboard accessible
- Consistent with a polished startup marketing site in healthcare
- Ready to run with `npm install` and `npm run dev`

If a visual reference is provided, match it closely. If something is ambiguous, prefer the existing codebase patterns over inventing a new system.
```
