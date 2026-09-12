# Global Connect

A Next.js 16 (App Router, React 19, Tailwind v4) clone of the Global Connect
youth-opportunity site, built CMS-first with **Contentful** and auth with
**Clerk**. Rendered fully static with ISR (Cache Components).

## Stack

| Concern   | Choice                                                    |
| --------- | --------------------------------------------------------- |
| Framework | Next.js 16 (App Router, React 19, TypeScript)             |
| Styling   | Tailwind v4 + [shadcn/ui](https://ui.shadcn.com) (Base UI) |
| CMS       | Contentful (Delivery + Preview API)                       |
| Auth      | Clerk (sign-in/sign-up to join the community)             |
| Caching   | SSG + ISR via Cache Components (`cacheLife` / `cacheTag`) |
| Quality   | ESLint, `tsc --noEmit`, [React Doctor](https://react-doctor.com) |

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

> The site ships with built-in sample content so it renders before you connect
> Contentful. Once your CMS is wired up, real entries replace it automatically.

## Environment variables

Copy `.env.example` → `.env.local` and fill in your keys. Full walkthroughs:

- **Contentful** — see [`contentful/README.md`](./contentful/README.md) (model
  import, entries, codegen, caching).
- **Clerk** — create an app in the [Clerk dashboard](https://dashboard.clerk.com),
  then copy the Publishable Key and Secret Key into `.env.local`. The cofig lives
  in `src/proxy.ts`.

## Useful commands

```bash
pnpm dev               # development server
pnpm build             # production build
pnpm start             # run production build
pnpm lint              # eslint
pnpm typecheck         # tsc --noEmit
pnpm react-doctor      # scan the codebase for React issues (0-100 score)
pnpm contentful:import # import the content model into your space (see contentful/README.md)
pnpm contentful:codegen# generate TS types from your Contentful content model
```

## Project structure

```
src/
  app/                    # routes (page.tsx per route)
    (sections on the home page) + /opportunities, /sessions, /guides + /community, /about
  components/
    sections/             # homepage section components
    ui/                   # shadcn/ui primitives
  lib/
    contentful/           # client.ts, queries.ts (cached fetchers), seed.ts (fallback content)
    richtext.tsx          # Contentful rich-text → React
  types/                  # hand-written models (models.ts) + Contentful skeleton types (contentful.ts)
contentful/               # content-model.json + setup guide
```

## Caching model

Fetchers in `src/lib/contentful/queries.ts` are marked `"use cache"` with the
`cms` `cacheLife` profile (revalidate every 15 min, serve stale up to 24 h) and
tagged `contentful`. Watch the `contentful/README.md` section on revalidation to
wire a webhook for instant refreshes.