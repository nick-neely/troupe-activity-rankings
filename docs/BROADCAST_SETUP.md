# Broadcast System Setup

Opinionated guide to implement a lightweight site-wide broadcast (banner) system. Focus: **simple DB + polling (Fetch Strategy Option A) + local dismissals**. No auth required to view broadcasts.

---

## 1. Concept & Requirements

- Display 0-3 active broadcast messages (banner at top of site) to all visitors.
- Quick create/update/publish via existing admin dashboard.
- Near real-time propagation: clients see updates within ≤15s (good enough; not sub-second).
- Each content change (or republish) bumps a `version` so previously dismissed banners can reappear.
- Local (per-browser) dismiss persistence only (unauthenticated users OK; no server dismissal table initially).
- Basic analytics: impression + dismiss events (PostHog).
- Optional scheduling window (start/end). Audience targeting deferred.

---

## 2. Data Model (Drizzle / Postgres)

Migration sketch:

```ts
// lib/db/schema.ts
import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const broadcasts = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // human id e.g. "oct-maintenance"
  title: text("title").notNull(),
  bodyMarkdown: text("body_markdown").notNull(),
  level: text("level").notNull().default("info"), // info | warn | critical (style in UI)
  active: boolean("active").notNull().default(true),
  startsAt: timestamp("starts_at"), // optional schedule start
  endsAt: timestamp("ends_at"), // optional schedule end
  version: integer("version").notNull().default(1), // bump when content changes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // future: audienceFilter: jsonb('audience_filter'), // omit for now
});
```

Add index in the drizzle schema for active, starts_ad and ends_at:

**Version Bump Logic:** On admin save: if `bodyMarkdown`, `title`, `level`, or schedule fields changed → increment `version`.

---

## 3. Fetch Strategy (Polling via TanStack Query)

We implement one endpoint and poll it.

### 3.1 API Route

`GET /api/broadcasts/active`

Behavior:

1. Query DB for rows where `active = true` and (schedule window matches current time).
2. Return minimal payload plus a `revision` (max updatedAt ms or hash) for quick change detection.
3. No caching: `cache: 'no-store'` to always hit origin (lightweight). Optionally ETag later.

Route handler (Next.js App Router):

```ts
// app/api/broadcasts/active/route.ts
import { db } from "@/db";
import { broadcasts } from "@/db/schema/broadcasts";
import { and, eq, or, isNull, lte, gte } from "drizzle-orm";

export const dynamic = "force-dynamic"; // ensure no static caching

export async function GET() {
  const now = new Date();
  const rows = await db.query.broadcasts.findMany({
    where: (b, { and, or, isNull, lte, gte }) =>
      and(
        eq(b.active, true),
        or(isNull(b.startsAt), lte(b.startsAt, now)),
        or(isNull(b.endsAt), gte(b.endsAt, now))
      ),
    columns: {
      id: true,
      slug: true,
      title: true,
      bodyMarkdown: true,
      level: true,
      version: true,
      updatedAt: true,
    },
    orderBy: (b, { desc }) => [desc(b.updatedAt)],
  });

  const revision = rows.reduce(
    (acc, r) => Math.max(acc, r.updatedAt.getTime()),
    0
  );

  return Response.json({ revision, broadcasts: rows });
}
```

### 3.2 TanStack Query Hook

```ts
// hooks/useBroadcasts.ts
import { useQuery } from "@tanstack/react-query";

export interface Broadcast {
  id: number;
  slug: string;
  title: string;
  bodyMarkdown: string;
  level: "info" | "warn" | "critical";
  version: number;
  updatedAt: string;
}

export function useBroadcasts() {
  return useQuery<{ revision: number; broadcasts: Broadcast[] }>({
    queryKey: ["broadcasts"],
    queryFn: async () => {
      const res = await fetch("/api/broadcasts/active", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load broadcasts");
      return res.json();
    },
    refetchInterval: 15000, // ~15s polling
    refetchOnWindowFocus: true, // picks up changes when user returns
    staleTime: 0,
  });
}
```

(Optimization later: track last revision in state; if unchanged you can early-exit render logic.)

---

## 4. Local Dismissal (Zustand)

Persist dismissals per `(slug, version)` so a new version reappears.

```ts
// store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BroadcastState {
  dismissed: Record<string, number>; // slug -> version dismissed
  dismiss: (slug: string, version: number) => void;
  reset: (slug: string) => void;
}

export const useBroadcastStore = create<BroadcastState>()(
  persist(
    (set) => ({
      dismissed: {},
      dismiss: (slug, version) =>
        set((s) => ({
          dismissed: { ...s.dismissed, [slug]: version },
        })),
      reset: (slug) =>
        set((s) => {
          const copy = { ...s.dismissed };
          delete copy[slug];
          return { dismissed: copy };
        }),
    }),
    { name: "broadcast-dismissals" }
  )
);
```

Visibility check: show broadcast if `dismissed[slug] !== version`.

---

## 5. UI Component

Simple banner stack. Use Tailwind + shadcn/ui primitives.

```tsx
// components/BroadcastBanners.tsx
import { useBroadcasts } from "@/lib/queries/useBroadcasts";
import { useBroadcastStore } from "@/stores/broadcastStore";
import Markdown from "react-markdown"; // or your MD renderer
import posthog from "posthog-js";

const levelClasses: Record<string, string> = {
  info: "bg-indigo-50 border-indigo-200 text-indigo-900",
  warn: "bg-amber-50 border-amber-300 text-amber-900",
  critical: "bg-red-50 border-red-300 text-red-900",
};

export function BroadcastBanners() {
  const { data } = useBroadcasts();
  const { dismissed, dismiss } = useBroadcastStore();
  if (!data) return null;

  const visible = data.broadcasts.filter(
    (b) => dismissed[b.slug] !== b.version
  );
  if (!visible.length) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 space-y-2 p-2">
      {visible.map((b) => (
        <div
          key={b.slug}
          className={`rounded-md border px-4 py-2 shadow ${
            levelClasses[b.level]
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="font-medium mb-1">{b.title}</h4>
              <Markdown className="prose prose-sm max-w-none">
                {b.bodyMarkdown}
              </Markdown>
            </div>
            <button
              onClick={() => {
                dismiss(b.slug, b.version);
                posthog.capture("broadcast_dismissed", {
                  slug: b.slug,
                  version: b.version,
                });
              }}
              className="opacity-70 hover:opacity-100 text-sm"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

Mount this near root layout (`app/layout.tsx`) so it appears globally.

Optional: Add layout offset (top padding) when banners present.

---

## 6. Admin CRUD Flow

Route: `/admin/broadcasts` (protected by your existing auth if any). Minimal fields:

- `slug` (immutable after create ideally)
- `title`
- `bodyMarkdown`
- `level` (select: info | warn | critical)
- `active` (toggle)
- `startsAt`, `endsAt` (optional)

**Version bump:** On update transaction: compare old vs new significant fields; if changed, set `version = version + 1`.

Pseudo server action:

```ts
// app/admin/broadcasts/[id]/actions.ts
"use server";
import { db } from "@/db";
import { broadcasts } from "@/db/schema/broadcasts";
import { eq } from "drizzle-orm";

export async function updateBroadcast(
  id: number,
  input: {
    title: string;
    bodyMarkdown: string;
    level: string;
    active: boolean;
    startsAt?: Date | null;
    endsAt?: Date | null;
  }
) {
  const existing = await db.query.broadcasts.findFirst({
    where: (b, { eq }) => eq(b.id, id),
  });
  if (!existing) throw new Error("Not found");

  const significantChanged =
    existing.title !== input.title ||
    existing.bodyMarkdown !== input.bodyMarkdown ||
    existing.level !== input.level ||
    existing.startsAt?.getTime() !== input.startsAt?.getTime() ||
    existing.endsAt?.getTime() !== input.endsAt?.getTime();

  await db
    .update(broadcasts)
    .set({
      ...input,
      version: significantChanged ? existing.version + 1 : existing.version,
      updatedAt: new Date(),
    })
    .where(eq(broadcasts.id, id));
}
```

Add a preview panel (render markdown) + a quick "Deactivate" button.

---

## 7. Analytics (PostHog)

Events:

- `broadcast_impression`: fire once per slug+version per page load (dedupe in code or allow duplicates + use PostHog property dedupe in queries).
- `broadcast_dismissed` when user dismisses.

Implementation snippet (impression):

```ts
useEffect(() => {
  visible.forEach((b) => {
    posthog.capture("broadcast_impression", {
      slug: b.slug,
      version: b.version,
      level: b.level,
    });
  });
}, [visible]);
```

(Place inside `BroadcastBanners` after `visible` computed.)

Metrics to watch:

- Impression count vs total sessions.
- Dismiss rate (dismiss / impression).
- Time-to-dismiss (PostHog funnel / property with timestamp difference if you record first seen time locally).

---

## 8. Performance Considerations

- Polling every 15s is trivial load (tiny table, small JSON). If scale becomes large, increase interval or implement conditional fetch with `If-None-Match`.
- Mark route `dynamic` to skip full-page caching; we want fresh data.
- Could return `revision` and store it in a ref; if unchanged, skip re-render operations.

---

## 9. Progressive Enhancement (Optional Later)

If you need faster than 15s or want immediate incident banners:

1. Add a WebSocket/SSE provider (Pusher / Ably / simple ws). Admin update publishes `broadcastsUpdated` event.
2. Client listens; on event, call `queryClient.invalidateQueries(['broadcasts'])`.
3. Keep polling as fallback.

Alternate: push active broadcasts JSON into Redis + use `revalidateTag('broadcasts')` for SSR pages (Next 15 cache tags). Not needed initially.

---

## 10. User Experience Notes

- Stack multiple banners (rare) with vertical spacing.
- Use color + icon per `level` (info ≈ indigo, warn ≈ amber, critical ≈ red). Avoid harsh backgrounds.
- Provide clear dismiss (×) accessible label.
- If critical, optionally make it sticky until dismissed (already sticky by fixed top). Could additionally block scroll for true emergencies (not default).

---

## 11. Security & Sanitization

- Render markdown via a safe renderer. If you ever allow raw HTML in markdown, sanitize (DOMPurify on client or `rehype-sanitize`).
- No script tags or inline event handlers.

---

## 12. Future Enhancements (Defer)

| Feature                                             | Add When                          |
| --------------------------------------------------- | --------------------------------- |
| Audience filters (plan, route regex)                | Need plan-specific CTAs           |
| Scheduling UI improvements (date pickers, timezone) | Multiple scheduled campaigns      |
| Server-side dismiss persistence                     | Need cross-device consistency     |
| WebSocket push                                      | High urgency or frequent edits    |
| A/B testing (PostHog flags)                         | Optimizing copy / conversions     |
| Modal / inline placement variants                   | Need contextual prompts           |
| Personalization tokens ({{user.firstName}})         | Logged-in personalization         |
| Edge caching + Redis snapshot                       | High traffic + performance tuning |

---

## 13. Summary

Start simple: DB table + polling + local dismissals. This meets 90% of needs with minimal surface area. Layer in push, targeting, and personalization only when you have real use cases.
