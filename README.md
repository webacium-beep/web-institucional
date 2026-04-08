# aciumweb

Official website for ACIUM, built with Astro 6 + React 19 islands, Tailwind CSS 4, and full server-side rendering on Netlify. The project ships with a multilanguage system that auto-detects the visitor's browser language and routes them transparently to the correct locale.

---

## Sanity Setup

This project integrates with [Sanity](https://www.sanity.io/) as a headless CMS backend. The bootstrap layer (`src/lib/sanity/`) enables SSR content queries from Astro pages.

### Prerequisites

- A Sanity project with at least one dataset (typically `production`).
- Your project ID is available in the [Sanity Manage console](https://www.sanity.io/manage).

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Exposed to browser | Description |
|----------|----------|--------------------|-------------|
| `PUBLIC_SANITY_PROJECT_ID` | ✅ Yes | Yes | Your Sanity project ID |
| `PUBLIC_SANITY_DATASET` | ✅ Yes | Yes | Dataset name (e.g. `production`) |
| `SANITY_API_VERSION` | Recommended (has fallback `2024-04-08`) | No | API date pin (e.g. `2024-04-08`). Omitting it keeps the bundled fallback; always set explicitly in production. |
| `SANITY_API_TOKEN` | Optional | **No — server-only** | Required only for private/draft reads |

> **Important:** `SANITY_API_TOKEN` is intentionally not prefixed with `PUBLIC_`. It is a server-side secret and must never be bundled into browser code. For anonymous public reads it can be omitted entirely.

### Image delivery strategy

Story 3 uses **direct Sanity CDN URLs** as the canonical image strategy. The `urlFor()` helper in `src/lib/sanity/image.ts` resolves Sanity image references to `cdn.sanity.io` URLs directly.

`astro.config.mjs` does not need remote image domain configuration for this bootstrap. Astro's `<Image>` optimisation for Sanity assets is explicitly deferred to a future story.

### Current content source

While the Sanity access layer is in place, existing pages still use local/static content. No live CMS queries are active until Story 4 wires the first page to Sanity.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro (SSR) | 6.0.4 |
| UI Islands | React | 19.2.4 |
| Styling | Tailwind CSS (Vite plugin) | 4.2.1 |
| Language | TypeScript (strict) | — |
| Deployment | Netlify (`@astrojs/netlify`) | — |
| Package manager | pnpm | — |
| Node | >=22.12.0 | — |

---

## Getting Started

**Prerequisites**

- Node.js `>=22.12.0`
- pnpm (`npm install -g pnpm`)

**Install dependencies**

```bash
pnpm install
```

**Development server**

```bash
pnpm dev
```

**Production build**

```bash
pnpm build
```

**Preview production build locally**

```bash
pnpm preview
```

---

## Project Structure

```
src/
├── components/
│   ├── islands/          # React islands (client-side interactive)
│   │   └── LanguageSelector.tsx
│   └── ui/               # Astro UI components (server-rendered)
│       └── Titulo.astro
├── i18n/
│   ├── ui.ts             # Central translation dictionary
│   └── utils.ts          # useTranslations() helper
├── layouts/
│   └── Layout.astro      # Root HTML shell — sets <html lang>
├── middleware.ts          # Browser language detection + cookie + redirect
├── pages/
│   ├── index.astro        # / (español — default)
│   ├── en/index.astro     # /en/
│   ├── de/index.astro     # /de/
│   ├── zh/index.astro     # /zh/
│   ├── pt/index.astro     # /pt/
│   └── it/index.astro     # /it/
└── styles/
    └── global.css
```

---

## Scripts

| Command | Action |
|---------|--------|
| `pnpm dev` | Start local dev server at `http://localhost:4321` |
| `pnpm build` | Build for production into `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint across the project |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm test` | Run the full Vitest suite once (CI mode) |
| `pnpm test:watch` | Run Vitest in watch mode (dev workflow) |
| `pnpm test:coverage` | Run Vitest with v8 coverage report |

### Testing

The project uses **Vitest** as the single test runner for all test types:

- **Node environment** (default): server-side logic such as `src/middleware.test.ts` and Sanity bootstrap smoke tests.
- **jsdom environment** (per-file opt-in via `// @vitest-environment jsdom`): React island component tests using Testing Library.
- **Shared setup**: `test/setup-dom.ts` registers `@testing-library/jest-dom` matchers and handles cleanup automatically.

Test files live colocated next to their source (`src/**/*.test.ts(x)`). Run `pnpm test` before every commit.

---

## Deployment

The project uses the `@astrojs/netlify` adapter for SSR. Netlify reads the build configuration from `netlify.toml`:

```toml
[build]
  command = "pnpm run build"
```

Push to the connected branch — Netlify handles the rest.

---

## Multilanguage System

This is the core architectural feature of the project. Every part of the stack — routing, middleware, components, and the translation dictionary — is designed to work together for a seamless multilanguage experience.

### Supported Locales

| Code | Language | Default |
|------|----------|---------|
| `es` | 🇪🇸 Español | Yes |
| `en` | 🇬🇧 English | — |
| `de` | 🇩🇪 Deutsch | — |
| `zh` | 🇨🇳 中文 | — |
| `pt` | 🇧🇷 Português | — |
| `it` | 🇮🇹 Italiano | — |

### Astro i18n Configuration

Configured in `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en', 'de', 'zh', 'pt', 'it'],
  routing: {
    prefixDefaultLocale: false
  }
}
```

`prefixDefaultLocale: false` means Spanish lives at the root (`/`) with no prefix, while every other locale gets its own path prefix (`/en/`, `/de/`, etc.).

### URL Structure

```
/          → Español (default, no prefix)
/en/       → English
/de/       → Deutsch
/zh/       → 中文
/pt/       → Português
/it/       → Italiano
```

Each locale has its own page file under `src/pages/`:

```
src/pages/
├── index.astro       ← /
├── en/index.astro    ← /en/
├── de/index.astro    ← /de/
├── zh/index.astro    ← /zh/
├── pt/index.astro    ← /pt/
└── it/index.astro    ← /it/
```

### Browser Language Detection — `src/middleware.ts`

The SSR middleware intercepts every request to `/` and determines which locale the user should see, in this order:

1. **Cookie check** — if a `preferred-locale` cookie exists and holds a valid locale, use it immediately (respects a previous user choice).
2. **`Accept-Language` header** — parse the browser's language header, extract language codes, sort by `q`-value priority, and find the first match in the supported locales list.
3. **Save cookie** — store the resolved locale in a cookie (`max-age` = 1 year, `path=/`, `samesite=lax`) so subsequent visits skip the detection step.
4. **Route** — if the locale is `es`, serve `/` directly (no redirect). For any other locale, issue a `302` redirect to `/{locale}/`.

Requests that are already localized (e.g., `/en/about`), point to assets, or target internal Astro routes (`/_*`) are passed through without any processing.

```
Request GET /
    │
    ▼
middleware.ts
    │
    ├─ Cookie "preferred-locale" present and valid?
    │   ├─ es  → serve / directly
    │   └─ other → 302 → /{locale}/
    │
    ├─ Parse Accept-Language header
    │   └─ Sort by q-value, find first match in supported locales
    │
    ├─ Set cookie (1 year, path=/, samesite=lax)
    │
    └─ es  → serve / directly
       other → 302 → /{locale}/
                    │
                    ▼
            pages/{locale}/index.astro
              Astro.currentLocale = '{locale}'
                    │
                    ▼
            Layout.astro → <html lang="{locale}">
                    │
                    ▼
            Components use useTranslations(lang)
                    │
                    ▼
            ui.ts → ui[locale][key]
```

### Translation Dictionary — `src/i18n/ui.ts`

All translations live in a single, centrally typed file. The `UIContent` interface defines which keys exist. The `ui` object is a `Record<Locales, UIContent>` — TypeScript enforces that every locale provides every key.

```ts
export type Locales = 'es' | 'en' | 'it' | 'pt' | 'de' | 'zh';

interface UIContent {
  title: string;
  // add new keys here
}

export const ui: Record<Locales, UIContent> = {
  es: { title: "Título en español" },
  en: { title: "Title in English" },
  de: { title: "Titel in Deutsch" },
  zh: { title: "中文标题" },
  pt: { title: "Título em português" },
  it: { title: "Titolo in italiano" },
} as const;
```

### Translation Helper — `src/i18n/utils.ts`

A lightweight `useTranslations(lang)` factory returns a `t(key)` function for the requested locale. If a key is missing in the requested locale it falls back to Spanish — the canonical source of truth.

```ts
import { ui } from './ui';

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui['es']) {
    return ui[lang][key] || ui['es'][key];
  }
}
```

**Usage in any Astro component:**

```astro
---
import { useTranslations } from '../i18n/utils';
import type { Locales } from '../i18n/ui';

const lang = Astro.currentLocale || 'es';
const t = useTranslations(lang as Locales);
---

<h1>{t('title')}</h1>
```

### Language Selector — `src/components/islands/LanguageSelector.tsx`

A React island (`client:load`) that renders a dropdown with flag emojis and locale codes. It reads the current locale from `window.location.pathname` on mount and writes a `preferred-locale` cookie when the user picks a new language, then navigates to the corresponding URL:

- Spanish → `window.location.href = "/"`
- Other → `window.location.href = "/{code}/"`

Being a React island means this component hydrates on the client while the rest of the layout remains static HTML — keeping interactivity surgical and the page weight minimal.

### How to Add a New Translation Key

1. **Define the key** — add it to the `UIContent` interface in `src/i18n/ui.ts`:

   ```ts
   interface UIContent {
     title: string;
     heroSubtitle: string; // ← new key
   }
   ```

2. **Add translations for all 6 locales** — TypeScript will report a compile error for any locale that is missing the new key:

   ```ts
   es: { title: "...", heroSubtitle: "Subtítulo" },
   en: { title: "...", heroSubtitle: "Subtitle" },
   de: { title: "...", heroSubtitle: "Untertitel" },
   zh: { title: "...", heroSubtitle: "副标题" },
   pt: { title: "...", heroSubtitle: "Subtítulo" },
   it: { title: "...", heroSubtitle: "Sottotitolo" },
   ```

3. **Use it in a component** — `t('heroSubtitle')`. TypeScript autocompletes valid keys and flags typos at build time.

### How to Add a New Locale

1. Add the locale code to the `Locales` type in `src/i18n/ui.ts`.
2. Add a translations object for it in the `ui` constant (TypeScript will enforce completeness).
3. Add the code to `supportedLocales` in `src/middleware.ts`.
4. Add the code to the `locales` array in `astro.config.mjs`.
5. Create `src/pages/{code}/index.astro` (copy an existing locale page as a starting point).
6. Add an entry to the `LOCALES` array in `src/components/islands/LanguageSelector.tsx` with the flag, label, and name.
