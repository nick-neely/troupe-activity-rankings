# Copilot Instructions for Troupe Scraper Web

## Project Overview

- **Framework**: Next.js 14 App Router project in the `app/` directory.
- **Language**: TypeScript and React (all components live under `components/`, TSX files).
- **Styling**: Tailwind CSS with `clsx` + `twMerge` helper (`lib/utils.ts`).
- **State Management**: Zustand store with persistence middleware (`lib/store.ts`).
- **Data Source**: CSV upload parsed by `lib/utils.ts` → `ActivityData[]`.

## Architecture & Data Flow

1. **Entry Point**: `app/page.tsx` (client component, marked with `"use client"`).
2. On mount, CSV data is loaded (via `components/upload-form.tsx`) and fed into `useActivityStore.setActivities`.
3. Shared store hook (`useActivityStore`) drives downstream components:
   - `StatsCards` (summary metrics)
   - `TopActivities` (sorted list)
   - `CategoryChart` (stats by category)
   - `ActivitiesTable` (full list with sorting/filtering)
4. Store selectors include `getTopActivities`, `getCategoryStats`, `getTotalStats`, etc.

## Components & Conventions

- **Domain Components**: `components/*.tsx` (kebab-case filenames, named exports).
- **UI Primitives**: `components/ui/` folder with reusable inputs, buttons, menus, etc.
- **Custom Hooks**: `hooks/` (e.g., `use-mobile.ts` for responsive behavior).
- **File Imports**: Use `@/` alias (configured in `tsconfig.json`).

## Styling & Utility Functions

- **Tailwind Config**: See `tailwind.config.js` & `postcss.config.mjs`.
- **ClassName Merge**: `cn(...inputs)` in `lib/utils.ts` wraps `clsx` + `twMerge`.
- **CSV Parsing**: Robust parser in `lib/utils.ts` (`parseCSVData`).

## Development Workflow

- **Install Dependencies**: `npm install`
- **Run Dev Server**: `npm run dev` (Windows PowerShell)
- **Build**: `npm run build`
- **Start Production**: `npm start`
- **ESLint**: `npm run lint` (uses `eslint.config.mjs`)
- **Type Checks**: `npm run type-check` if scripted

## Key Files & Folders

- `app/` – Next.js pages, layouts
- `components/` – Feature components & UI primitives under `components/ui`
- `lib/` – Store (`store.ts`) & utility (`utils.ts`) modules
- `hooks/` – Custom React hooks
- `public/` – Static assets (SVGs, favicon)
- `next.config.ts` – Next.js config (path aliases, configs)

---

_Feel free to request clarifications or deeper details on any part of the architecture or workflows._
