# DNAture Next — Rebranding & Modernization Blueprint

> **Purpose**: A comprehensive, actionable reference for refactoring `dnature_next` from its current Next.js 12 / React 17 / JavaScript architecture to a modern **Next.js 16.2 App Router / React 19.2 / TypeScript** stack with Cache Components (`"use cache"`), optimized Contentful integration, SSR/ISR best practices, and a modern UI layer.

---

## Table of Contents

1. [Current Architecture Audit](#1-current-architecture-audit)
2. [Target Architecture Overview](#2-target-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Project Scaffolding & Folder Structure](#4-project-scaffolding--folder-structure)
5. [TypeScript Configuration](#5-typescript-configuration)
6. [Next.js Configuration](#6-nextjs-configuration)
7. [Contentful Integration — Optimized](#7-contentful-integration--optimized) 
8. [Routing Migration (Pages → App Router)](#8-routing-migration-pages--app-router)
9. [Data Fetching Strategy — SSR, ISR & Caching](#9-data-fetching-strategy--ssr-isr--caching)
10. [UI Layer & Styling](#10-ui-layer--styling)
11. [Component Architecture](#11-component-architecture)
12. [State Management](#12-state-management)
13. [SEO & Metadata](#13-seo--metadata)
14. [Authentication](#14-authentication)
15. [Image Optimization](#15-image-optimization)
16. [Analytics & Third-Party Scripts](#16-analytics--third-party-scripts)
17. [Testing Strategy](#17-testing-strategy)
18. [Performance Budget](#18-performance-budget)
19. [Environment Variables](#19-environment-variables)
20. [Migration Checklist](#20-migration-checklist)
21. [Appendix: Type Definitions](#appendix-type-definitions)

---

## 1. Current Architecture Audit

### What the application does

DNAture (`dnaturefood.com`) is a **pet food e-commerce platform** based in Costa Rica serving natural/raw pet food products. It provides:

- **Product Catalog** — Categories (snacks, recetas, suplementos, proteínas, órganos) with product detail views
- **Blog** — Contentful-powered blog with posts, categories, search, rich text rendering
- **Food Portion Calculator** — Interactive multi-step wizard to calculate daily pet food portions
- **Nutritional Plan Builder** (Plan DNAture) — Multi-step form to create customized pet nutrition plans
- **Shopping Cart** — Client-side cart with localStorage persistence, WhatsApp-based checkout
- **FAQ Section** — Static FAQ page
- **Client Management** — Client forms with pet profiles
- **SEO** — Sitemap generation, structured data, Open Graph tags

### Current tech stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (Pages Router) | 12.x |
| UI Library | React | 17.0.2 |
| Language | JavaScript (no types) | ES2020 |
| UI Components | MUI (Material UI) | 5.14.x |
| Styling | SCSS Modules + MUI ThemeProvider + Emotion | Mixed |
| CMS | Contentful (GraphQL API via `graphql-request`) | — |
| Icons | FontAwesome + MUI Icons | Mixed |
| State | React Context (shopping cart, scroll, global, user) | — |
| Auth | next-auth (installed but barely used) | 4.x |
| Images | Next/Image (disabled optimization) + react-lazy-load | — |
| Carousel | react-slick + custom Slider component | — |
| Maps | @googlemaps/js-api-loader | — |
| Analytics | Google Analytics (via gtag inline script) | — |
| Sitemap | next-sitemap | — |

### Key architectural problems

1. **Outdated stack** — Next.js 12, React 17 are significantly behind current (Next.js 16.2, React 19.2)
2. **No TypeScript** — Zero type safety; models defined as classes/plain objects
3. **Mixed styling** — SCSS modules, MUI `sx` prop, Emotion, global SCSS, and inline styles all coexist
4. **Suboptimal Contentful usage** — `NEXT_PUBLIC_` env vars expose API keys client-side; no caching; no Content Delivery Network optimization; no response caching layer
5. **Client-side fetching for SSR-eligible pages** — Product detail page (`/productos/[product]`) fetches data client-side when it should use SSR/ISR
6. **No `getStaticPaths`** — Blog posts and products lack static path generation
7. **Custom description formatting** — Relies on string replacement hacks (`@`, `_`, `%`) instead of rich text
8. **Dead/unused dependencies** — `@apollo/client`, `crypto`, `npm`, `yarn`, `i` packages
9. **Security** — Contentful API key exposed via `NEXT_PUBLIC_` prefix
10. **No image optimization** — `unoptimized: true` defeats Next.js image pipeline
11. **Container/Presentational pattern inconsistency** — Some features use it, others don't
12. **Font bloat** — Multiple font families loaded (Poppins, OpenSans, Roboto, Raleway, Lobster, Helvetica Neue Pro)

---

## 2. Target Architecture Overview

```
┌─────────────────────────────────────────────────┐
│            Next.js 16.2 App Router               │
│    (React 19.2 + Server + Cache Components)      │
├──────────────┬──────────────┬───────────────────┤
│  Server      │  Cache       │  Client            │
│  Components  │  Components  │  Components        │
│  (default)   │ ("use cache")│  ('use client')    │
├──────────────┴──────────────┴───────────────────┤
│        Contentful Service Layer (server-only)     │
│  ┌────────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ REST Client│  │ cacheTag │  │ cacheLife    │ │
│  │            │  │          │  │ (TTL)        │ │
│  └────────────┘  └──────────┘  └──────────────┘ │
├─────────────────────────────────────────────────┤
│           Tailwind CSS + CSS Modules             │
├─────────────────────────────────────────────────┤
│     Zustand (cart) + Server State (RSC data)     │
├─────────────────────────────────────────────────┤
│               TypeScript Strict                  │
└─────────────────────────────────────────────────┘
```

Key architectural decisions:

- **Server Components by default** — Data fetching happens on the server; only interactive components opt into `'use client'`
- **Cache Components (`"use cache"`)** — Next.js 16's first-class caching primitive replaces `unstable_cache`. Tag-based revalidation via `cacheTag()` and TTL via `cacheLife()`
- **Contentful API keys never leave the server** — All CMS calls happen in Server Components or Route Handlers
- **`proxy.ts` replaces `middleware.ts`** — Edge routing, redirects, and rewrites handled via the new Proxy API
- **React Compiler (stable)** — Automatic memoization; no manual `useMemo`/`useCallback` needed
- **Turbopack (default)** — ~400% faster dev startup, stable file-system caching
- **Single styling approach** — Tailwind CSS for utilities + CSS Modules for component-scoped styles (no MUI, no Emotion)
- **Type-safe throughout** — Strict TypeScript with Contentful-generated types

---

## 3. Technology Stack

```jsonc
// package.json — target dependencies
{
  "dependencies": {
    "next": "^16.2",
    "react": "^19.2",
    "react-dom": "^19.2",
    "contentful": "^11.0",         // REST client for content delivery
    "@contentful/rich-text-react-renderer": "^16.0",
    "@contentful/rich-text-types": "^17.0",
    "zustand": "^5.0",             // Lightweight state management
    "zod": "^3.24",                // Runtime validation + type inference
    "lucide-react": "^0.500",      // Modern icon library (tree-shakable)
    "clsx": "^2.1",                // Conditional classnames
    "tailwind-merge": "^3.0",      // Tailwind class conflict resolution
    "nuqs": "^2.4",                // Type-safe URL search params (products filter, blog search)
    "sonner": "^2.0",              // Toast notifications (cart feedback)
    "embla-carousel-react": "^8.5",// Lightweight carousel (replaces react-slick)
    "next-sitemap": "^4.2",
    "@vercel/analytics": "^1.4",
    "@vercel/speed-insights": "^1.1"
  },
  "devDependencies": {
    "typescript": "^5.8",
    "@types/react": "^19.2",
    "@types/node": "^22.0",
    "tailwindcss": "^4.0",
    "@tailwindcss/postcss": "^4.0",
    "contentful-management": "^11.0", // For type generation
    "cf-content-types-generator": "^3.0", // Auto-generate TS types from Contentful
    "@biomejs/biome": "^1.9",       // Replaces ESLint + Prettier (next lint removed in 16)
    "@playwright/test": "^1.50"
  }
}
```

### What was removed and why

| Removed | Reason |
|---------|--------|
| `@mui/material`, `@mui/icons-material`, `@mui/styles` | Replaced by Tailwind CSS + custom components (smaller bundle, no runtime CSS-in-JS) |
| `@emotion/react`, `@emotion/styled` | No longer needed without MUI |
| `@apollo/client`, `graphql`, `graphql-request` | Use Contentful REST SDK + `fetch` with native caching instead of GraphQL (reduces bundle + simplifies caching) |
| `@fortawesome/*` | Replaced by `lucide-react` (tree-shakable, consistent design) |
| `react-slick`, `slick-carousel` | Replaced by `embla-carousel-react` (lightweight, accessible, touch-friendly) |
| `sass` | Replaced by Tailwind CSS + CSS Modules (plain CSS) |
| `react-lazy-load-image-component` | Next.js `<Image>` handles lazy loading natively |
| `html2canvas` | Re-evaluate if still needed; if so, dynamically import |
| `next-auth` | Replace with lightweight custom auth or keep only if auth is truly needed |
| `crypto`, `npm`, `yarn`, `i` | Unused/accidental dependencies |
| `eslint`, `eslint-config-next`, `prettier` | Replaced by **Biome** — single fast linter + formatter (`next lint` removed in Next.js 16) |

### Recommended 3rd-party libraries (new additions)

| Library | Purpose | Why recommended |
|---------|---------|-----------------|
| **`nuqs`** | Type-safe URL search params | Perfect for product filtering & blog search — state in URL, shareable links, SSR-compatible. Replaces manual `searchParams` parsing |
| **`sonner`** | Toast notifications | Minimal, accessible, beautiful toasts for cart actions (add/remove feedback). ~3KB, no provider needed |
| **`embla-carousel-react`** | Lightweight carousel | Replaces `react-slick` (which needs jQuery-era CSS). Touch-friendly, accessible, ~5KB |
| **`@biomejs/biome`** | Lint + format | Replaces ESLint + Prettier with a single Rust-based tool. ~150x faster, zero config for most cases |
| **`zustand`** | Client state management | Replaces verbose React Context. Built-in `persist` middleware for localStorage cart |
| **`zod`** | Runtime validation | Type-safe form validation (client forms, calculator inputs). Infers TypeScript types from schemas |
| **`lucide-react`** | Icon library | Tree-shakable, 1000+ icons, consistent design system. Replaces FontAwesome + MUI Icons |
| **`tailwind-merge`** | CSS class conflict resolution | Prevents duplicate/conflicting Tailwind classes when composing component styles |

### Libraries evaluated but NOT recommended

| Library | Reason for exclusion |
|---------|---------------------|
| **Radix UI / shadcn/ui** | Good but adds layer of abstraction. For this project size, custom Tailwind components are simpler and more maintainable |
| **React Query (TanStack Query)** | Overkill — all data fetching happens server-side via Cache Components. No client-side data fetching needed |
| **Framer Motion** | Heavy (~50KB). Use native CSS `@starting-style` and View Transitions API (React 19.2) for animations instead |
| **tRPC** | No custom API layer to type — Contentful SDK is already typed |

---

## 4. Project Scaffolding & Folder Structure

```
dnature-next/
├── public/
│   ├── fonts/                    # Self-hosted font files (Poppins only)
│   ├── images/                   # Static images
│   ├── icons/                    # SVG icons
│   └── robots.txt
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx              # Home page (/)
│   │   ├── loading.tsx           # Root loading UI
│   │   ├── not-found.tsx         # 404 page
│   │   ├── error.tsx             # Error boundary
│   │   ├── productos/
│   │   │   ├── page.tsx          # Products listing (/productos)
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Product detail (/productos/[slug])
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing (/blog)
│   │   │   ├── busqueda/
│   │   │   │   └── page.tsx      # Blog search results (/blog/busqueda)
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Blog post detail (/blog/[slug])
│   │   ├── calculadora/
│   │   │   └── page.tsx          # Calculator (/calculadora)
│   │   ├── plan-dnature/
│   │   │   └── page.tsx          # Plan DNAture (/plan-dnature)
│   │   ├── cart/
│   │   │   └── page.tsx          # Shopping cart (/cart)
│   │   ├── preguntas-frecuentes/
│   │   │   └── page.tsx          # FAQ (/preguntas-frecuentes)
│   │   ├── login/
│   │   │   └── page.tsx          # Login (/login)
│   │   └── api/
│   │       └── revalidate/
│   │           └── route.ts      # On-demand ISR webhook
│   ├── proxy.ts                  # Edge proxy — replaces middleware.ts
│   ├── components/               # Shared UI components
│   │   ├── ui/                   # Primitives (Button, Input, Card, etc.)
│   │   ├── layout/               # Header, Footer, Navigation
│   │   ├── product/              # ProductCard, ProductGrid, ProductInfo
│   │   ├── blog/                 # PostCard, PostGrid, RichTextRenderer
│   │   ├── cart/                 # CartItem, CartSummary, CartDrawer
│   │   ├── calculator/           # CalculatorSteps, PortionResult
│   │   ├── plan/                 # PlanSteps, PetForm, PetCard
│   │   ├── forms/                # Input, Select, Checkbox, ClientForm
│   │   └── common/               # Loading, WhatsAppLink, Map, Currency
│   ├── lib/                      # Core libraries & utilities
│   │   ├── contentful/
│   │   │   ├── client.ts         # Contentful REST client (server-only)
│   │   │   ├── queries.ts        # Query helpers
│   │   │   ├── mappers.ts        # Raw Contentful → domain type mappers
│   │   │   └── types.ts          # Auto-generated Contentful types
│   │   ├── utils/
│   │   │   ├── cn.ts             # clsx + tailwind-merge helper
│   │   │   ├── currency.ts       # Price formatting
│   │   │   ├── dates.ts          # Date formatting
│   │   │   └── images.ts         # Contentful image URL builder
│   │   └── constants.ts          # Breakpoints, config, etc.
│   ├── hooks/                    # Client-side React hooks
│   │   ├── use-cart.ts
│   │   ├── use-local-storage.ts
│   │   └── use-media-query.ts
│   ├── stores/                   # Zustand stores
│   │   └── cart-store.ts
│   ├── types/                    # Shared TypeScript types
│   │   ├── product.ts
│   │   ├── blog.ts
│   │   ├── category.ts
│   │   ├── client.ts
│   │   ├── pet.ts
│   │   └── cart.ts
│   └── styles/
│       └── globals.css           # Tailwind directives + minimal global resets
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── next-sitemap.config.js
├── postcss.config.mjs
├── biome.json                    # Biome linter + formatter config
├── .env.local                    # Local env (never committed)
├── .env.example                  # Template for env vars
└── package.json
```

### Key structural decisions

- **`src/` directory** — Keeps configuration files at root, application code inside `src/`
- **`app/` router** — Every route is a folder with `page.tsx`; layouts are inherited
- **`components/` organized by domain** — Not by pattern (no `containers/` vs `presentational/`). Server vs. Client is determined by `'use client'` directive per file
- **`lib/contentful/`** — Single place for all CMS logic; marked `server-only` to prevent accidental client imports
- **`types/`** — Domain types separate from Contentful types; mappers in `lib/contentful/mappers.ts` bridge the gap

---

## 5. TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Strict mode rules enforced

- `strict: true` — Enables `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.
- `noUncheckedIndexedAccess: true` — Forces null checks on array/object index access
- `allowJs: false` — No JavaScript files allowed (enforces full TypeScript migration)
- Path alias `@/*` maps to `src/*` for clean imports

---

## 6. Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  // ─── React Compiler (stable in Next.js 16 — top-level, NOT experimental) ───
  reactCompiler: true,

  // ─── Cache Components: enables "use cache" directive ───
  cacheComponents: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
    ],
    // DO NOT set unoptimized: true — leverage Next.js image optimization
    // NOTE: images.domains is deprecated in 16; use remotePatterns only
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://images.ctfassets.net data:",
              "font-src 'self'",
              "connect-src 'self' https://cdn.contentful.com https://www.google-analytics.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### `proxy.ts` — Replaces `middleware.ts`

Next.js 16 introduces `proxy.ts` as the replacement for `middleware.ts`. It runs at the edge and handles routing concerns (redirects, rewrites, auth checks) without the limitations of the old middleware API.

```typescript
// src/proxy.ts
import { type NextRequest, NextResponse } from 'next/server';

export function handleRequest(request: NextRequest) {
  // Example: redirect old product URLs
  if (request.nextUrl.pathname.startsWith('/productos/producto/')) {
    const slug = request.nextUrl.pathname.split('/').pop();
    return NextResponse.redirect(new URL(`/productos/${slug}/`, request.url));
  }

  return NextResponse.next();
}
```

### Key changes from current config

- **Next.js 16.2 / Turbopack** — Turbopack is now the default bundler (~400% faster dev startup). No `--turbopack` flag needed
- **React Compiler (stable)** — Moved from `experimental.reactCompiler` to top-level `reactCompiler: true`. Auto-memoization removes the need for manual `useMemo`/`useCallback`
- **Cache Components** — `cacheComponents: true` enables the `"use cache"` directive, replacing `unstable_cache` with a cleaner, composable caching primitive
- **`proxy.ts`** — Replaces deprecated `middleware.ts` for edge routing logic
- **Image optimization enabled** — Removed `unoptimized: true`; Next.js will now optimize and serve images in AVIF/WebP. `images.domains` is deprecated; only `remotePatterns` is used
- **Security headers** — Added CSP, X-Frame-Options, X-Content-Type-Options
- **TypeScript config file** — `next.config.ts` instead of `.js`
- **Node.js 20.9+ required** — Next.js 16 dropped support for Node.js <20.9

---

## 7. Contentful Integration — Optimized

### 7.1 Security: Server-Only Client

The current codebase exposes the Contentful API key to the browser via `NEXT_PUBLIC_` prefix. The new architecture ensures **all Contentful calls happen exclusively on the server**.

```typescript
// src/lib/contentful/client.ts
import 'server-only'; // Prevents importing this file in client components

import { createClient, type EntryCollection, type Entry } from 'contentful';

// NO "NEXT_PUBLIC_" prefix — these are server-only
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
});

// Preview client for draft content (optional, for CMS previews)
const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: 'preview.contentful.com',
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
});

export function getClient(preview = false) {
  return preview ? previewClient : client;
}
```

### 7.2 Why REST instead of GraphQL

The current codebase uses `graphql-request` for Contentful's GraphQL API. The migration switches to the **Contentful REST SDK** because:

1. **Native `fetch` integration** — The SDK uses `fetch` internally, which Next.js intercepts for automatic caching and ISR
2. **No extra dependencies** — Eliminates `graphql`, `graphql-request`, `@apollo/client`
3. **Better caching control** — Next.js can cache individual `fetch` requests with granular `revalidate` options
4. **Simpler error handling** — No GraphQL error parsing needed
5. **Type generation** — `cf-content-types-generator` produces TypeScript interfaces directly from the Contentful REST schema

### 7.3 Query Helpers with Cache Components (`"use cache"`)

Next.js 16 introduces **Cache Components** via the `"use cache"` directive — a first-class caching primitive that replaces `unstable_cache`. Each async function marked with `"use cache"` is automatically cached, with tag-based revalidation via `cacheTag()` and TTL control via `cacheLife()`.

```typescript
// src/lib/contentful/queries.ts
"use cache";

import 'server-only';

import { cacheTag, cacheLife } from 'next/cache';
import { getClient } from './client';
import {
  mapProduct,
  mapCategory,
  mapBlogPost,
  mapBlogPostPreview,
} from './mappers';
import type { Product, Category, BlogPost, BlogPostPreview } from '@/types';

// ─── Cache Life Profiles ────────────────────────────────────────
// Custom profiles can also be defined in next.config.ts under
// cacheLife: { myProfile: { stale: 300, revalidate: 60, expire: 3600 } }
// Built-in profiles: 'default', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'max'

// ─── Categories ─────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  cacheTag('categories');
  cacheLife('hours'); // ~1 hour stale-while-revalidate

  const entries = await getClient().getEntries({
    content_type: 'category',
    order: ['fields.order'],
  });
  return entries.items.map(mapCategory);
}

// ─── Products ───────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  cacheTag('products');
  cacheLife('minutes'); // ~5 minute stale-while-revalidate

  const entries = await getClient().getEntries({
    content_type: 'product',
    include: 2, // Resolve 2 levels of linked entries
  });
  return entries.items.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  cacheTag('products', `product-${slug}`);
  cacheLife('minutes');

  const entries = await getClient().getEntries({
    content_type: 'product',
    'fields.urlSlug': slug,
    include: 2,
    limit: 1,
  });
  const item = entries.items[0];
  return item ? mapProduct(item) : null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  cacheTag('products');
  cacheLife('hours');

  const entries = await getClient().getEntries({
    content_type: 'product',
    select: ['fields.urlSlug'],
  });
  return entries.items.map(
    (item) => item.fields.urlSlug as string
  );
}

// ─── Blog ───────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPostPreview[]> {
  cacheTag('blog');
  cacheLife('minutes'); // ~10 minute stale-while-revalidate

  const entries = await getClient().getEntries({
    content_type: 'blogPost',
    order: ['-sys.createdAt'],
    select: [
      'sys.id',
      'sys.createdAt',
      'fields.title',
      'fields.excerpt',
      'fields.category',
      'fields.media',
      'fields.slug',
    ],
  });
  return entries.items.map(mapBlogPostPreview);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  cacheTag('blog', `blog-${slug}`);
  cacheLife('minutes');

  const entries = await getClient().getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    include: 3,
    limit: 1,
  });
  const item = entries.items[0];
  return item ? mapBlogPost(item) : null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  cacheTag('blog');
  cacheLife('hours');

  const entries = await getClient().getEntries({
    content_type: 'blogPost',
    select: ['fields.slug'],
  });
  return entries.items.map(
    (item) => item.fields.slug as string
  );
}

export async function getBlogPostsByField(field: string, value: string): Promise<BlogPostPreview[]> {
  cacheTag('blog');
  cacheLife('minutes');

  const entries = await getClient().getEntries({
    content_type: 'blogPost',
    [`fields.${field}`]: value,
    select: [
      'sys.id',
      'sys.createdAt',
      'fields.title',
      'fields.excerpt',
      'fields.category',
      'fields.media',
      'fields.slug',
    ],
  });
  return entries.items.map(mapBlogPostPreview);
}
```

> **Why `"use cache"` over `unstable_cache`?**
> - `unstable_cache` is deprecated in Next.js 16
> - `"use cache"` is composable — works on entire files, individual functions, or inline blocks
> - `cacheTag()` and `cacheLife()` are declarative and co-located with the data fetching logic
> - Better integration with the React server component model
> - Supports custom cache life profiles defined in `next.config.ts`
```

### 7.4 Contentful Data Mappers

```typescript
// src/lib/contentful/mappers.ts
import 'server-only';

import type { Entry, Asset } from 'contentful';
import type {
  Product,
  Category,
  BlogPost,
  BlogPostPreview,
  ContentfulImage,
} from '@/types';

// Helper to extract image data from Contentful Asset
function mapAsset(asset: Asset | undefined): ContentfulImage | null {
  if (!asset?.fields?.file) return null;
  return {
    url: `https:${asset.fields.file.url}`,
    title: (asset.fields.title as string) ?? '',
    width: asset.fields.file.details?.image?.width ?? 0,
    height: asset.fields.file.details?.image?.height ?? 0,
  };
}

export function mapCategory(entry: Entry): Category {
  return {
    label: entry.fields.label as string,
    slug: entry.fields.slug as string,
    image: mapAsset(entry.fields.image as Asset),
  };
}

export function mapProduct(entry: Entry): Product {
  const images = (entry.fields.imageCollection as Asset[] | undefined) ?? [];
  const icons = (entry.fields.iconosCollection as Asset[] | undefined) ?? [];

  return {
    id: entry.sys.id,
    name: entry.fields.productName as string,
    description: entry.fields.description as string | undefined,
    category: entry.fields.category as string,
    categorySlug: entry.fields.categorySlug as string,
    slug: entry.fields.urlSlug as string,
    unit: entry.fields.medida as string,
    price: entry.fields.precio as number,
    pricesPerUnit: entry.fields.preciosPorUnidad as number[] | undefined,
    rating: (entry.fields.rating as number) ?? 100,
    ingredients: entry.fields.ingredientes as string | undefined,
    images: images.map(mapAsset).filter(Boolean) as ContentfulImage[],
    icons: icons.map(mapAsset).filter(Boolean) as ContentfulImage[],
  };
}

export function mapBlogPostPreview(entry: Entry): BlogPostPreview {
  return {
    id: entry.sys.id,
    publishedAt: entry.sys.createdAt,
    title: entry.fields.title as string,
    excerpt: entry.fields.excerpt as string,
    category: entry.fields.category as string,
    slug: entry.fields.slug as string,
    image: mapAsset(entry.fields.media as Asset),
  };
}

export function mapBlogPost(entry: Entry): BlogPost {
  return {
    ...mapBlogPostPreview(entry),
    body: entry.fields.body as BlogPost['body'],
    asideContent: entry.fields.asideContent as BlogPost['asideContent'],
    images: ((entry.fields.imagesCollection as Asset[]) ?? [])
      .map(mapAsset)
      .filter(Boolean) as ContentfulImage[],
    relatedProducts: ((entry.fields.productsCollection as Entry[]) ?? []).map(
      (p) => ({
        id: p.sys.id,
        name: p.fields.productName as string,
        slug: p.fields.urlSlug as string,
        image: mapAsset(
          (p.fields.imageCollection as Asset[] | undefined)?.[0]
        ),
      })
    ),
    hashtags: (entry.fields.hashtags as string[]) ?? [],
    author: entry.fields.author
      ? {
          name: (entry.fields.author as Entry).fields.name as string,
          avatar: mapAsset(
            (entry.fields.author as Entry).fields.avatar as Asset
          ),
        }
      : undefined,
  };
}
```

### 7.5 On-Demand Revalidation Webhook

Set a Contentful webhook to call this endpoint when content changes:

```typescript
// src/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const contentType = body?.sys?.contentType?.sys?.id;

    // Revalidate based on content type
    // In Next.js 16, revalidateTag() invalidates all cache entries
    // that were tagged with cacheTag() in "use cache" functions
    switch (contentType) {
      case 'product':
        revalidateTag('products');
        break;
      case 'blogPost':
        revalidateTag('blog');
        break;
      case 'category':
        revalidateTag('categories');
        break;
      default:
        revalidateTag('products');
        revalidateTag('blog');
        revalidateTag('categories');
    }

    return NextResponse.json({ revalidated: true, contentType });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
```

### 7.6 Contentful Optimization Summary

| Strategy | Implementation | Impact |
|----------|---------------|--------|
| **Server-only access** | `import 'server-only'` + non-public env vars | API key never reaches client bundle |
| **Cache Components** | `"use cache"` directive + `cacheTag()` + `cacheLife()` | Declarative caching replaces `unstable_cache`; reduces Contentful API calls by 90%+ |
| **On-demand revalidation** | Webhook → `revalidateTag()` | Fresh content within seconds of publish |
| **Selective field fetching** | `select` parameter in queries | Smaller API responses for list pages |
| **Include depth control** | `include: 2` only when linked entries needed | Fewer round trips, smaller payloads |
| **Static path generation** | `generateStaticParams()` for products/blog | Pages pre-built at build time |
| **REST over GraphQL** | Contentful REST SDK instead of GraphQL | Native `fetch` caching, simpler setup |

---

## 8. Routing Migration (Pages → App Router)

### Route mapping

| Current (Pages Router) | New (App Router) | Rendering Strategy |
|----------------------|-----------------|-------------------|
| `pages/index.js` | `src/app/page.tsx` | **Cached** (`"use cache"` in queries, `cacheLife('hours')`) |
| `pages/productos/index.js` | `src/app/productos/page.tsx` | **Cached** (`cacheLife('minutes')`) |
| `pages/productos/[product]/index.js` | `src/app/productos/[slug]/page.tsx` | **SSG** + cached (`generateStaticParams`) |
| `pages/blog/index.js` | `src/app/blog/page.tsx` | **Cached** (`cacheLife('minutes')`) |
| `pages/blog/[post]/index.js` | `src/app/blog/[slug]/page.tsx` | **SSG** + cached (`generateStaticParams`) |
| `pages/blog/busqueda/index.js` | `src/app/blog/busqueda/page.tsx` | **Dynamic SSR** (searchParams) |
| `pages/calculadora/index.js` | `src/app/calculadora/page.tsx` | **Static** (client interactive) |
| `pages/plan-dnature/index.js` | `src/app/plan-dnature/page.tsx` | **Static** (client interactive) |
| `pages/cart/index.js` | `src/app/cart/page.tsx` | **Static** (client interactive) |
| `pages/preguntas-frecuentes/index.js` | `src/app/preguntas-frecuentes/page.tsx` | **Static** |
| `pages/login/index.js` | `src/app/login/page.tsx` | **Static** (client interactive) |
| `pages/_app.js` | `src/app/layout.tsx` | Root layout |

### Root Layout

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/stores/cart-provider';

import '@/styles/globals.css';

const poppins = localFont({
  src: [
    { path: '../../public/fonts/Poppins-Light.ttf', weight: '300' },
    { path: '../../public/fonts/Poppins-Regular.ttf', weight: '400' },
    { path: '../../public/fonts/Poppins-Bold.ttf', weight: '700' },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dnaturefood.com'),
  title: {
    default: 'DNAture — Alimentación natural para mascotas',
    template: '%s | DNAture',
  },
  description:
    'La mejor alimentación natural y saludable para mascotas. Snacks, dieta blanda, barf, raw.',
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    siteName: 'DNAture',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="font-sans text-gray-900 antialiased">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Example: Products Listing Page (ISR)

```tsx
// src/app/productos/page.tsx
import type { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/contentful/queries';
import { ProductCatalog } from '@/components/product/product-catalog';

export const metadata: Metadata = {
  title: 'Nuestros Productos',
  description: 'Explora nuestra línea completa de alimentación natural para mascotas.',
};

// No more `export const revalidate = 300;` — caching is handled by
// the "use cache" directive inside getProducts() / getCategories()

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductCatalog products={products} categories={categories} />;
}
```

### Example: Product Detail (SSG + ISR)

```tsx
// src/app/productos/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/contentful/queries';
import { ProductDetail } from '@/components/product/product-detail';

interface Props {
  params: Promise<{ slug: string }>;
}

// Pre-generate all product pages at build time
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata from Contentful
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.name} — Alimentación natural para mascotas`,
    openGraph: {
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.name }]
        : [],
    },
  };
}

export const revalidate = 300;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // Caching is handled inside getProductBySlug() via "use cache"
  // The `revalidate` export above is a fallback for the full route cache

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
```

### Example: Blog Post (SSG + ISR)

```tsx
// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getBlogPostBySlug,
  getAllBlogSlugs,
} from '@/lib/contentful/queries';
import { BlogPostView } from '@/components/blog/blog-post-view';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.image ? [{ url: post.image.url }] : [],
    },
  };
}

export const revalidate = 600;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  // Caching handled inside getBlogPostBySlug() via "use cache"

  if (!post) {
    notFound();
  }

  return <BlogPostView post={post} />;
}
```

### Example: Blog Search (Dynamic SSR)

```tsx
// src/app/blog/busqueda/page.tsx
import type { Metadata } from 'next';
import { getBlogPostsByField } from '@/lib/contentful/queries';
import { BlogSearchResults } from '@/components/blog/blog-search-results';

interface Props {
  searchParams: Promise<{ field?: string; value?: string }>;
}

export const metadata: Metadata = {
  title: 'Resultados de búsqueda',
};

// Dynamic — no caching for search results
export const dynamic = 'force-dynamic';

export default async function BlogSearchPage({ searchParams }: Props) {
  const { field, value } = await searchParams;

  if (!field || !value) {
    return <BlogSearchResults posts={[]} query={{ field: '', value: '' }} />;
  }

  const posts = await getBlogPostsByField(field, value);

  return <BlogSearchResults posts={posts} query={{ field, value }} />;
}
```

---

## 9. Data Fetching Strategy — Cache Components, SSG & Dynamic

### Decision matrix

| Page | Strategy | Cache Control | Why |
|------|----------|-------------|-----|
| Home (`/`) | Cached | `cacheLife('hours')` via queries | Categories rarely change |
| Products listing | Cached | `cacheLife('minutes')` via queries | Products update moderately |
| Product detail `[slug]` | SSG + Cached | `generateStaticParams` + `cacheLife('minutes')` | Pre-built, refreshed via tags + webhook |
| Blog listing | Cached | `cacheLife('minutes')` via queries | Posts published occasionally |
| Blog post `[slug]` | SSG + Cached | `generateStaticParams` + `cacheLife('minutes')` | Pre-built, refreshed via tags + webhook |
| Blog search | Dynamic SSR | none | Depends on query params |
| Calculator | Static | ∞ | Pure client-side interaction |
| Plan DNAture | Static | ∞ | Pure client-side interaction |
| Cart | Static | ∞ | Client-side state only |
| FAQ | Static | ∞ | Content from static JSON/files |
| Login | Static | ∞ | Client-side form |

### Caching architecture (Next.js 16 Cache Components)

```
Request → Edge Cache (Vercel/CDN)
          ↓ (cache MISS)
        Next.js Cache Components ("use cache" functions)
          ↓ (cache MISS — checked via cacheTag/cacheLife)
        Contentful REST API
          ↓
        Response cached with cacheLife profile (stale/revalidate/expire)
          ↓
        Page rendered, Route Cache stores the result
```

### Key rules

1. **Server Components fetch data** — No `useEffect` + `fetch` for content that can be server-rendered
2. **`"use cache"` directive on query functions** — Each Contentful query function declares its own caching behavior via `cacheTag()` and `cacheLife()`
3. **`generateStaticParams` for all dynamic routes** — Products and blog posts are pre-built at deploy
4. **On-demand revalidation via webhook** — Content updates trigger `revalidateTag()` which invalidates all `"use cache"` functions tagged with that tag
5. **`force-dynamic` only for search** — Blog search depends on user query and cannot be statically generated
6. **No more `export const revalidate`** — Caching is handled at the data layer via Cache Components, not at the route level

---

## 10. UI Layer & Styling

### Why Tailwind CSS instead of MUI

| Concern | MUI | Tailwind CSS |
|---------|-----|-------------|
| Bundle size | ~80KB+ (runtime CSS-in-JS) | ~10KB (purged CSS) |
| Server Components | Not compatible (requires `'use client'`) | Fully compatible |
| Performance | Runtime style injection | Zero-runtime, compiled CSS |
| Customization | Theme object | Utility classes + CSS variables |
| Learning curve | MUI-specific API | Standard CSS knowledge |

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors (mapped from current _colors.scss)
        brand: {
          primary: '#07bbc7',
          'primary-hover': '#04a6af',
          secondary: '#ff6f00',
          'secondary-hover': '#e66300',
          accent: '#dbe077',
          success: '#a8b247',
          warning: '#f2a83b',
          danger: '#d33f49',
          teal: '#29434e',
        },
        // Neutral palette
        surface: {
          DEFAULT: '#fafafa',
          muted: '#f7f7f7',
          border: '#efefef',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      // Map current size variables
      spacing: {
        header: '70px',
        subheader: '35px',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Global Styles

```css
/* src/styles/globals.css */
@import 'tailwindcss';

/* ─── Custom theme tokens (from current _variables.scss) ─── */
@theme {
  --color-brand-primary: #07bbc7;
  --color-brand-primary-hover: #04a6af;
  --color-brand-secondary: #ff6f00;
  --color-brand-secondary-hover: #e66300;
  --color-brand-accent: #dbe077;
  --color-brand-success: #a8b247;
  --color-brand-warning: #f2a83b;
  --color-brand-danger: #d33f49;
  --color-brand-teal: #29434e;
  --color-surface: #fafafa;
  --color-surface-muted: #f7f7f7;
  --color-surface-border: #efefef;
}

/* ─── Base resets ─── */
@layer base {
  * {
    box-sizing: border-box;
  }

  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }
}
```

### Utility Helper: `cn()`

```typescript
// src/lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 11. Component Architecture

### Server vs. Client Component Decision

| Component | Type | Why |
|-----------|------|-----|
| `Header` (shell) | Server | Static HTML structure |
| `MobileMenu` | Client | Toggle state, click handlers |
| `Footer` | Server | Static content |
| `ProductCatalog` | Client | Filtering, search, category switching |
| `ProductCard` | Server | Pure presentation |
| `ProductDetail` | Server | Content from props, static |
| `AddToCartButton` | Client | Cart interaction |
| `CartDrawer` | Client | Cart state, animations |
| `BlogPostView` | Server | Rich text rendering |
| `RichTextRenderer` | Server | Contentful rich text → React |
| `Calculator` | Client | Multi-step form, local state |
| `PlanDNA` | Client | Multi-step form, local state |
| `WhatsAppLink` | Server | Static link generation |
| `Currency` | Server | Pure formatting |

### Example: UI Primitive — Button

```tsx
// src/components/ui/button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover',
  secondary: 'bg-brand-secondary text-white hover:bg-brand-secondary-hover',
  outline: 'border border-brand-primary text-brand-primary hover:bg-brand-primary/10',
  ghost: 'text-gray-600 hover:bg-gray-100',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
        'disabled:pointer-events-none disabled:opacity-40',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    />
  )
);

Button.displayName = 'Button';
```

### Example: ProductCard (Server Component)

```tsx
// src/components/product/product-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/currency';
import { AddToCartButton } from './add-to-cart-button'; // 'use client'

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const primaryImage = product.images[0];

  return (
    <article className="group overflow-hidden rounded-lg border border-surface-border bg-white transition-shadow hover:shadow-md">
      <Link href={`/productos/${product.slug}/`}>
        {primaryImage && (
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={primaryImage.url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-primary">
            {product.category}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-gray-900">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.unit}</p>
          <p className="mt-2 text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
```

### Rich Text Renderer for Blog

```tsx
// src/components/blog/rich-text-renderer.tsx
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import Image from 'next/image';

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { url, title } = node.data.target.fields.file;
      const { width, height } = node.data.target.fields.file.details.image;
      return (
        <Image
          src={`https:${url}`}
          alt={title ?? ''}
          width={width}
          height={height}
          className="my-4 rounded-lg"
        />
      );
    },
    [BLOCKS.PARAGRAPH]: (_node: any, children: React.ReactNode) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node: any, children: React.ReactNode) => (
      <h2 className="mb-3 mt-8 text-2xl font-bold">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node: any, children: React.ReactNode) => (
      <h3 className="mb-2 mt-6 text-xl font-semibold">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (_node: any, children: React.ReactNode) => (
      <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: any, children: React.ReactNode) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>
    ),
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <a
        href={node.data.uri}
        className="text-brand-primary underline hover:text-brand-primary-hover"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

interface Props {
  content: Document;
}

export function RichTextRenderer({ content }: Props) {
  return (
    <div className="prose prose-lg max-w-none">
      {documentToReactComponents(content, renderOptions)}
    </div>
  );
}
```

---

## 12. State Management

### Replace React Context with Zustand (Cart)

The shopping cart is the only truly global client state. Replace the verbose Context + Provider pattern with Zustand.

```typescript
// src/stores/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            totalItems: state.totalItems + 1,
            subtotal: state.subtotal + item.price,
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
            totalItems: state.totalItems + 1,
            subtotal: state.subtotal + item.price,
          }));
        }
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        if (item.quantity === 1) {
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
            totalItems: state.totalItems - 1,
            subtotal: state.subtotal - item.price,
          }));
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
            totalItems: state.totalItems - 1,
            subtotal: state.subtotal - item.price,
          }));
        }
      },

      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        const diff = quantity - item.quantity;
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id ? { ...i, quantity } : i
                ),
          totalItems: state.totalItems + diff,
          subtotal: state.subtotal + diff * item.price,
        }));
      },

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),
    }),
    {
      name: 'dnature-cart',
    }
  )
);
```

### Cart Provider (Hydration Safety)

```tsx
// src/stores/cart-provider.tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function CartProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      {children}
      {/* Zustand persist handles hydration; this wrapper prevents flash */}
    </>
  );
}
```

### What's removed

| Current Context | Replacement |
|----------------|-------------|
| `shopping-cart-context.js` | `useCartStore` (Zustand with `persist`) |
| `global-context.js` | Not needed — `disableGlobalScroll` handled via CSS class toggle |
| `scroll-context.js` | Not needed — use `useInView` from Intersection Observer or CSS `scroll-driven-animations` |
| `user-context.js` | Not needed — hardcoded mock data; implement real auth when needed |

---

## 13. SEO & Metadata

### App Router Metadata API

Replace the current manual `<Head>` / `<meta>` approach in every page with the App Router's built-in `metadata` export.

```tsx
// Static metadata (in any page.tsx or layout.tsx)
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Dynamic metadata (for dynamic routes)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return {
    title: product?.name,
    description: `...`,
    openGraph: { images: [...] },
  };
}
```

### Structured Data (JSON-LD)

```tsx
// src/components/common/json-ld.tsx
interface Props {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in a product page:
<JsonLd
  data={{
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images[0]?.url,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'CRC',
      availability: 'https://schema.org/InStock',
    },
  }}
/>
```

### Sitemap

Keep `next-sitemap` but update the config:

```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://dnaturefood.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/login/', '/cart/'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/login/', '/cart/', '/api/'] },
    ],
  },
};
```

---

## 14. Authentication

The current auth implementation is minimal (a mock context + unused `next-auth`). For the rebranding:

- **If auth is not yet needed**: Remove all auth code. Add it back when requirements are clear.
- **If auth IS needed**: Use `next-auth` v5 (Auth.js) with the App Router integration:

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Implement actual authentication logic
        return null;
      },
    }),
  ],
});
```

---

## 15. Image Optimization

### Current problems

1. `unoptimized: true` in `next.config.js` — All images served as-is, no WebP/AVIF conversion
2. Custom `imageLoader.js` exists but is unused in the config
3. Images loaded via `react-lazy-load-image-component` instead of native `next/image`

### New approach

```tsx
// Use Next.js <Image> everywhere — it handles:
// - Lazy loading (default)
// - WebP/AVIF conversion
// - Responsive srcset generation
// - Blur placeholder

import Image from 'next/image';

// For Contentful images:
<Image
  src={product.images[0].url}   // https://images.ctfassets.net/...
  alt={product.name}
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={`${product.images[0].url}?w=20&q=10`}  // Tiny Contentful thumbnail
/>
```

### Contentful Image URL helper

```typescript
// src/lib/utils/images.ts
interface ContentfulImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
}

export function contentfulImageUrl(
  baseUrl: string,
  options: ContentfulImageOptions = {}
): string {
  const url = new URL(baseUrl.startsWith('//') ? `https:${baseUrl}` : baseUrl);
  if (options.width) url.searchParams.set('w', String(options.width));
  if (options.height) url.searchParams.set('h', String(options.height));
  if (options.quality) url.searchParams.set('q', String(options.quality));
  if (options.format) url.searchParams.set('fm', options.format);
  if (options.fit) url.searchParams.set('fit', options.fit);
  return url.toString();
}
```

---

## 16. Analytics & Third-Party Scripts

### Current problems

- Google Analytics injected via raw `<Script>` tags with inline gtag code
- No privacy consideration, no consent management

### New approach

```tsx
// Option A: Vercel Analytics (recommended if hosting on Vercel)
// Already added in layout.tsx via @vercel/analytics

// Option B: Google Analytics via @next/third-parties
import { GoogleAnalytics } from '@next/third-parties/google';

// In layout.tsx:
<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
```

---

## 17. Testing Strategy

### Linting & Formatting — Biome (replaces ESLint + Prettier)

`next lint` has been removed in Next.js 16. Use **Biome** as a single, fast linter + formatter:

```jsonc
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "useExhaustiveDependencies": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "files": {
    "ignore": [".next", "node_modules"]
  }
}
```

```jsonc
// package.json scripts
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --fix .",
    "format": "biome format --write ."
  }
}
```

### E2E Tests (Keep Playwright, modernize)

The project already has Playwright e2e tests. Migrate them to match new routes:

```typescript
// e2e/tests/products.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('should load product catalog', async ({ page }) => {
    await page.goto('/productos/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('article')).toHaveCount({ min: 1 });
  });

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/productos/');
    await page.locator('article').first().click();
    await expect(page).toHaveURL(/\/productos\/.+\//);
  });
});
```

### Component Tests (add Vitest)

```jsonc
// vitest.config.ts (add to project)
{
  "test": {
    "environment": "jsdom",
    "setupFiles": ["./src/test/setup.ts"]
  }
}
```

---

## 18. Performance Budget

| Metric | Target | How |
|--------|--------|-----|
| **LCP** | < 2.5s | ISR + Image optimization + Server Components |
| **FID** | < 100ms | Minimal client JS (only interactive components) |
| **CLS** | < 0.1 | `width`/`height` on all images, font `display: swap` |
| **Total JS** | < 150KB (first load) | No MUI, no Emotion, tree-shaken icons |
| **TTI** | < 3.5s | Server rendering + streaming |

---

## 19. Environment Variables

```bash
# .env.example

# ─── Contentful (server-only — NO NEXT_PUBLIC_ prefix) ─────────
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_DELIVERY_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_TOKEN=your_preview_token
CONTENTFUL_ENVIRONMENT=master

# ─── Revalidation ──────────────────────────────────────────────
REVALIDATION_SECRET=a_random_secure_string

# ─── Public (safe for client) ─────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://dnaturefood.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ─── Google Maps (if still used) ──────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key

# ─── Auth (if implemented) ────────────────────────────────────
AUTH_SECRET=your_auth_secret
```

### Migration note

Current `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` and `NEXT_PUBLIC_CONTENTFUL_DELIVERY_API_KEY` must be renamed to `CONTENTFUL_SPACE_ID` and `CONTENTFUL_DELIVERY_TOKEN` (no `NEXT_PUBLIC_` prefix) to keep them server-only.

---

## 20. Migration Checklist

### Phase 1: Foundation
- [ ] Initialize new Next.js 16.2 project with TypeScript (`npx create-next-app@latest --ts`)
- [ ] Install dependencies from Section 3
- [ ] Configure `tsconfig.json`, `next.config.ts` (with `reactCompiler`, `cacheComponents`), `tailwind.config.ts`
- [ ] Create `proxy.ts` for edge routing (redirects from old URLs)
- [ ] Set up Biome for linting + formatting (`biome.json`)
- [ ] Set up folder structure from Section 4
- [ ] Copy fonts to `public/fonts/` (keep only Poppins)
- [ ] Set up environment variables (Section 19)
- [ ] Create `src/styles/globals.css` with Tailwind directives + brand tokens
- [ ] Create `src/lib/utils/cn.ts` utility

### Phase 2: Contentful Layer
- [ ] Create `src/lib/contentful/client.ts` (server-only)
- [ ] Generate TypeScript types from Contentful schema (`cf-content-types-generator`)
- [ ] Create `src/lib/contentful/mappers.ts`
- [ ] Create `src/lib/contentful/queries.ts` with `"use cache"` + `cacheTag()` + `cacheLife()`
- [ ] Create on-demand revalidation API route
- [ ] Set up Contentful webhook pointing to `/api/revalidate`
- [ ] Test: verify all Contentful queries return expected data

### Phase 3: Layout & Core Components
- [ ] Create `src/app/layout.tsx` (root layout with fonts, metadata, providers)
- [ ] Build `src/components/layout/header.tsx` (responsive nav)
- [ ] Build `src/components/layout/footer.tsx`
- [ ] Build `src/components/ui/button.tsx`
- [ ] Build `src/components/ui/input.tsx`
- [ ] Build `src/components/ui/card.tsx`
- [ ] Build `src/components/common/loading.tsx`
- [ ] Build `src/components/common/currency.tsx`
- [ ] Build `src/components/common/whatsapp-link.tsx`

### Phase 4: Product Pages
- [ ] Build `src/app/page.tsx` (Home — ISR)
- [ ] Build `src/app/productos/page.tsx` (catalog — ISR)
- [ ] Build `src/app/productos/[slug]/page.tsx` (detail — SSG+ISR)
- [ ] Build `src/components/product/product-card.tsx`
- [ ] Build `src/components/product/product-catalog.tsx` (`'use client'` for filtering)
- [ ] Build `src/components/product/product-detail.tsx`
- [ ] Build `src/components/product/add-to-cart-button.tsx` (`'use client'`)

### Phase 5: Cart
- [ ] Create `src/stores/cart-store.ts` (Zustand)
- [ ] Build `src/app/cart/page.tsx`
- [ ] Build `src/components/cart/cart-item.tsx`
- [ ] Build `src/components/cart/cart-summary.tsx`
- [ ] Build `src/components/forms/client-form.tsx`
- [ ] Implement WhatsApp checkout flow

### Phase 6: Blog
- [ ] Build `src/app/blog/page.tsx` (listing — ISR)
- [ ] Build `src/app/blog/[slug]/page.tsx` (post — SSG+ISR)
- [ ] Build `src/app/blog/busqueda/page.tsx` (search — dynamic SSR)
- [ ] Build `src/components/blog/rich-text-renderer.tsx`
- [ ] Build `src/components/blog/post-card.tsx`
- [ ] Build `src/components/blog/blog-search-results.tsx`

### Phase 7: Interactive Features
- [ ] Build `src/app/calculadora/page.tsx` + calculator components (`'use client'`)
- [ ] Build `src/app/plan-dnature/page.tsx` + plan components (`'use client'`)
- [ ] Build `src/app/preguntas-frecuentes/page.tsx` (FAQ)
- [ ] Build `src/app/login/page.tsx` (if auth is needed)

### Phase 8: SEO & Polish
- [ ] Verify all `generateMetadata` exports produce correct meta tags
- [ ] Add JSON-LD structured data for products and blog posts
- [ ] Configure `next-sitemap`
- [ ] Set up analytics (Vercel Analytics or Google Analytics)
- [ ] Add `not-found.tsx` and `error.tsx` pages
- [ ] Add `loading.tsx` with skeleton UIs

### Phase 9: Testing & QA
- [ ] Migrate Playwright e2e tests to new routes
- [ ] Run Lighthouse audits — target scores: Performance 90+, SEO 95+, Accessibility 90+
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify Contentful webhook revalidation works end-to-end
- [ ] Test cart persistence across page navigations and refreshes

### Phase 10: Deploy
- [ ] Set environment variables in hosting platform
- [ ] Deploy to staging → full QA pass
- [ ] Deploy to production
- [ ] Verify sitemap.xml and robots.txt
- [ ] Set up monitoring

---

## Appendix: Type Definitions

```typescript
// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  categorySlug: string;
  slug: string;
  unit: string;
  price: number;
  pricesPerUnit?: number[];
  rating: number;
  ingredients?: string;
  images: ContentfulImage[];
  icons: ContentfulImage[];
}

// src/types/blog.ts
import type { Document } from '@contentful/rich-text-types';

export interface BlogPostPreview {
  id: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  image: ContentfulImage | null;
}

export interface BlogPost extends BlogPostPreview {
  body: Document;
  asideContent?: Document;
  images: ContentfulImage[];
  relatedProducts: RelatedProduct[];
  hashtags: string[];
  author?: {
    name: string;
    avatar: ContentfulImage | null;
  };
}

export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image: ContentfulImage | null;
}

// src/types/category.ts
export interface Category {
  label: string;
  slug: string;
  image: ContentfulImage | null;
}

// src/types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  image?: string;
}

// src/types/client.ts
export interface Client {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    direccion: string;
    provincia: string;
    canton: string;
  };
  contactPhoneNumber: string;
  pets: Pet[];
}

// src/types/pet.ts
export type PetAge = 'cachorro' | 'adulto' | 'senior';
export type PetSize = 'mini' | 'pequeno' | 'mediano' | 'grande' | 'gigante';
export type PetBodyFrame = 'delgado' | 'normal' | 'sobrepeso';
export type PetActivity = 'baja' | 'moderada' | 'alta';

export interface Pet {
  name: string;
  weight: number;
  age: PetAge;
  size: PetSize;
  castrated: boolean;
  bodyFrame: PetBodyFrame;
  dailyActivity: PetActivity;
  puppyStage?: string;
  portionSize?: number;
}

// Shared
export interface ContentfulImage {
  url: string;
  title: string;
  width: number;
  height: number;
}
```

---

## Summary of Key Architectural Wins

| Area | Before | After | Impact |
|------|--------|-------|--------|
| **Framework** | Next.js 12 (Pages Router) | Next.js 16.2 (App Router) | Server/Cache Components, streaming, Turbopack, ~400% faster dev |
| **Language** | JavaScript | TypeScript (strict) | Type safety, better DX, fewer runtime errors |
| **Rendering** | Mixed CSR/SSR/ISR | Primarily SSG + Cache Components | Faster loads, declarative caching, lower server costs |
| **Contentful** | GraphQL + exposed API key | REST SDK + server-only + `"use cache"` | Secure, 90% fewer API calls, `cacheTag`/`cacheLife` revalidation |
| **Styling** | MUI + SCSS + Emotion (mixed) | Tailwind CSS | ~70KB less CSS-in-JS, no runtime overhead, RSC-compatible |
| **State** | React Context (verbose) | Zustand (minimal) | Less boilerplate, better performance |
| **Images** | Unoptimized, lazy-load library | Next.js Image (AVIF/WebP) | 50-70% smaller images |
| **Bundle** | ~300KB+ first load JS | Target <150KB | Faster TTI, better Core Web Vitals |
| **SEO** | Manual `<Head>` per page | Metadata API + `generateMetadata` | Consistent, type-safe, automatic |
| **Security** | API key in client bundle | Server-only + CSP headers + `proxy.ts` | Secure by default |
| **Linting** | None (no ESLint config) | Biome (lint + format in one tool) | Fast, consistent, zero-config |
| **Caching** | None / manual | `"use cache"` + `cacheTag` + `cacheLife` | Declarative, composable, replaces `unstable_cache` |
| **React** | React 17 | React 19.2 | React Compiler (auto-memo), View Transitions, `<Activity>` |
