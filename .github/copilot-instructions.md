# Copilot Instructions for Troupe Scraper Web

## Project Overview

- **Next.js 14 (App Router)**: Server components by default in `app/`; interactive UI marked with `"use client"` at the top of TSX files.
- **TypeScript & React**: Domain components under `components/` (kebab-case filenames, named exports); UI primitives in `components/ui/`.
- **Styling**: Tailwind CSS; use the `cn(...)` helper (`lib/utils.ts`) to combine `clsx` + `twMerge`.
- **State Management**: Zustand store in `lib/store.ts` with localStorage persistence; core selectors like `getTopActivities`, `getCategoryStats`.
- **Data Flow**: CSV upload → parse CSV (`lib/utils.ts`) → `useActivityStore.setActivities` → components: `StatsCards`, `TopActivities`, `CategoryChart`, `ActivitiesTable`.

## Architecture & Data Flow

1. **Client vs Server**: Files in `app/` without `"use client"` run on the server. Add `"use client"` to enable hooks, state, and suspense in UI components.
2. **CSV Upload**: `components/upload-form.tsx` sends file to `/api/upload`; backend parses CSV, inserts into DB, and returns `ActivityData[]` to client.
3. **Zustand Store**: `useActivityStore` in `lib/store.ts` holds activities; UI reads slices via selectors and React Table.
4. **Category Icon Mappings**: Admin UI (`components/category-icon-manager.tsx`) uses `useCategoryMappings` hook to GET/POST `/api/category-mappings`.
5. **Drizzle ORM**: DB schema in `lib/db/schema.ts`, migrations in `db/migrations/`; query helpers in `lib/db/queries.ts`.
6. **API Routes**: Next.js Route Handlers under `app/api/*` (activities, admin, upload, auth, verify-otp, session, etc.).

## Components & Conventions

- **Domain vs UI**: Split feature components (`components/`) from primitives (`components/ui/`). Follow kebab-case for filenames.
- **Import Aliases**: Use `@/...` to reference `app/`, `components/`, `lib/`, `hooks/`.
- **Client Components**: Declare `"use client"` at top when using state or browser APIs.
- **Dynamic Icons**: Category icons use `React.lazy` + `Suspense` with dynamic imports from `lucide-react`.

## Utilities & Helpers

- **CSV Parser**: `parseCSVData` in `lib/utils.ts` returns validated records via Zod schemas.
- **ClassName Merge**: `cn(...)` merges Tailwind classes seamlessly.
- **Rate Limiting**: `lib/rateLimit.ts` applied in API routes to throttle requests.
- **Authentication**: Custom OTP flow under `app/api/verify-otp` and session management under `app/api/session`.

## Development Workflow

- **Install**: `npm install`
- **Local Dev**: `npm run dev` (PowerShell: join commands with `;` if chaining).
- **Production Build**: `npm run build && npm start`
- **Linting**: `npm run lint` uses `eslint.config.mjs`; autofix with `--fix`.
- **Type Checking**: `npm run type-check` is available but TS errors appear live in VS Code.
- **Database**: Apply migrations with `npm run migrate` (if script exists) or `npx drizzle-kit migrate`.

## Key Files & Folders

- `app/` – Next.js layouts, pages, and API routes. Default server components; add `"use client"` for hooks.
- `components/` – Domain UI. `components/ui/` for primitive controls (buttons, inputs, table).
- `lib/store.ts` – Zustand store with persistence and selectors.
- `lib/utils.ts` – Helpers: `cn`, `parseCSVData`, upload/file validations.
- `lib/db/` – Drizzle schema (`schema.ts`), queries (`queries.ts`), migrations (`migrations/`).
- `hooks/` – Data-fetching hooks (`useCategoryMappings`, `use-activities`, `use-auth`).
- `app/api/` – Route handlers (activities, upload, auth, admin, category-mappings).

---

_Feel free to request clarifications or deeper details on any part of the architecture or workflows._
