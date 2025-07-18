import { initializeAdminUser } from "@/lib/db/queries";
import { NextResponse } from "next/server";

/**
 * Handles POST requests to initialize an admin user in non-production environments.
 *
 * Returns a JSON response with the admin user's ID and username on success. In production, returns a 403 Forbidden error. On failure, returns a 500 Internal Server Error with an error message.
 */
export async function POST() {
  try {
    // Only allow this in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Not available in production" },
        { status: 403 }
      );
    }

    const user = await initializeAdminUser();

    return NextResponse.json({
      message: "Admin user initialized",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Initialize admin error:", error);
    return NextResponse.json(
      { error: "Failed to initialize admin user" },
      { status: 500 }
    );
  }
}
