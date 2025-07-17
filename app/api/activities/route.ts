import { getAllActivities, getLatestActivities } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latest = searchParams.get("latest");

    let activities;
    if (latest === "true") {
      activities = await getLatestActivities();
    } else {
      activities = await getAllActivities();
    }

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
