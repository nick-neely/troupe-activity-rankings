import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve the authenticated user's session information.
 *
 * Returns a JSON response containing the user's `id` and `username` if authenticated, or `user: null` if not authenticated or if an error occurs.
 */
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.userId,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null });
  }
}
