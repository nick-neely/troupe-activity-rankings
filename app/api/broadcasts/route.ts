import {
  createBroadcast,
  getAllBroadcasts,
  updateBroadcast,
} from "@/lib/db/queries";
import { broadcastSchema } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

// GET /api/broadcasts - Get all broadcasts for admin
export async function GET() {
  try {
    const broadcasts = await getAllBroadcasts();
    return NextResponse.json({ broadcasts });
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    return NextResponse.json(
      { error: "Failed to fetch broadcasts" },
      { status: 500 }
    );
  }
}

// POST /api/broadcasts - Create new broadcast
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = broadcastSchema.parse(body);

    const broadcast = await createBroadcast({
      slug: validatedData.slug,
      title: validatedData.title,
      bodyMarkdown: validatedData.bodyMarkdown,
      level: validatedData.level,
      active: validatedData.active,
      startsAt: validatedData.startsAt || null,
      endsAt: validatedData.endsAt || null,
    });

    return NextResponse.json({
      success: true,
      broadcast,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating broadcast:", error);
    return NextResponse.json(
      { error: "Failed to create broadcast" },
      { status: 500 }
    );
  }
}

// PUT /api/broadcasts - Update broadcast
export async function PUT(request: NextRequest) {
  try {
    // Parse and validate the complete request first
    const body = await request.json();
    const putSchema = z
      .object({
        id: z.number().int().positive("Valid broadcast ID is required"),
      })
      .extend(broadcastSchema.partial().shape);

    const { id, ...validatedData } = putSchema.parse(body);

    const broadcast = await updateBroadcast(id, validatedData);

    return NextResponse.json({
      success: true,
      broadcast,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating broadcast:", error);
    return NextResponse.json(
      { error: "Failed to update broadcast" },
      { status: 500 }
    );
  }
}
