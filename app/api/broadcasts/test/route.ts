import { createBroadcast } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // Create a test broadcast
    const testBroadcast = await createBroadcast({
      slug: "welcome-test",
      title: "Welcome to Troupe Scraper!",
      bodyMarkdown:
        "This is a **test broadcast** to demonstrate the new broadcast system. You can dismiss this message by clicking the × button.",
      level: "info",
      active: true,
      startsAt: null,
      endsAt: null,
    });

    return NextResponse.json({
      success: true,
      broadcast: testBroadcast,
    });
  } catch (error) {
    console.error("Error creating test broadcast:", error);
    return NextResponse.json(
      { error: "Failed to create test broadcast" },
      { status: 500 }
    );
  }
}
