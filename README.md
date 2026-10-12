# Doubtster web (Next.js)

Landing, blog, article pages, legal pages, signup and login, in the same UI as the HTML versions.

## Run
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

## Routes
| Route | Source |
|---|---|
| `/` | `src/app/page.tsx`, components in `src/components/landing` |
| `/blog` | `src/components/blog/BlogHome.tsx` (search and filters are client side) |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx`, content in `src/content/articles.ts` |
| `/terms`, `/privacy`, `/refund-policy` | markdown in `src/content/legal`, converted by `src/lib/legal.ts` |

Each page's CSS lives in `src/styles/*.css`, scoped under a wrapper class (`.pg-landing`, `.pg-blog`, `.pg-post`, `.pg-legal`) so pages cannot affect each other. All auth (login, signup, and app sessions) runs on `app.doubtster.com`.

## Add an article
Add an object to `ARTICLES` in `src/content/articles.ts` and a one line board text in `BOARD` (`src/lib/blog.ts`). Prices come from `src/content/pricing.ts`.

## Before launch
- Fill the `[PLACEHOLDER]` fields in `src/content/legal/*.md` (they show highlighted on the page) and have a lawyer review them.
- Set `NEXT_PUBLIC_SITE_URL`.
- `src/lib/chalk.ts` (video board engine) and `src/content/notes.ts` are kept as `@ts-nocheck` modules ported from the HTML.
