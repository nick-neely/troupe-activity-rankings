import { deleteBroadcast } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// DELETE /api/broadcasts/{id} - Delete broadcast by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Valid broadcast ID is required" },
        { status: 400 }
      );
    }

    await deleteBroadcast(id);

    return NextResponse.json({
      success: true,
      message: "Broadcast deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting broadcast:", error);
    return NextResponse.json(
      { error: "Failed to delete broadcast" },
      { status: 500 }
    );
  }
}
