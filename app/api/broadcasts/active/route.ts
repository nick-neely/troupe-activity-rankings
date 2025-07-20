import { db } from "@/lib/db";
import { broadcasts } from "@/lib/db/schema";
import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ensure no static caching

export async function GET() {
  try {
    const now = new Date();

    // Query for active broadcasts within their schedule window (if any)
    const rows = await db
      .select({
        id: broadcasts.id,
        slug: broadcasts.slug,
        title: broadcasts.title,
        bodyMarkdown: broadcasts.bodyMarkdown,
        level: broadcasts.level,
        version: broadcasts.version,
        updatedAt: broadcasts.updatedAt,
      })
      .from(broadcasts)
      .where(
        and(
          eq(broadcasts.active, true),
          // No start time set, or start time is in the past
          or(isNull(broadcasts.startsAt), lte(broadcasts.startsAt, now)),
          // No end time set, or end time is in the future
          or(isNull(broadcasts.endsAt), gte(broadcasts.endsAt, now))
        )
      )
      .orderBy(broadcasts.updatedAt);

    // Calculate revision based on latest updatedAt timestamp
    const revision = rows.reduce(
      (acc, r) => Math.max(acc, r.updatedAt.getTime()),
      0
    );

    return NextResponse.json({
      revision,
      broadcasts: rows,
    });
  } catch (error) {
    console.error("Error fetching active broadcasts:", error);
    return NextResponse.json(
      { error: "Failed to fetch broadcasts" },
      { status: 500 }
    );
  }
}
