import { clearAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Handles the admin logout POST request by clearing the authentication cookie.
 *
 * Returns a JSON response indicating success or failure of the logout operation.
 */
export async function POST() {
  try {
    await clearAuthCookie();

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
