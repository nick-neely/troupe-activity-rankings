import { clearAuthCookie, getAuthUserFromRequest } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { getUserByUsername } from "@/lib/db/queries";
import { checkRateLimit } from "@/lib/rateLimit";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

/**
 * Handles POST requests to change the authenticated user's password with rate limiting and validation.
 *
 * Validates the request body, enforces a maximum of 5 attempts per 10 minutes per user or IP, verifies the current password, updates the password hash in the database, and forces logout upon success.
 *
 * @returns A JSON response indicating success or an error with the appropriate HTTP status code.
 */
export async function POST(request: NextRequest) {
  try {
    // Identify user/IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const auth = await getAuthUserFromRequest(request);
    const userKey = auth ? `user:${auth.username}` : `ip:${ip}`;

    // Rate limit check
    const { limited, error: rateError } = await checkRateLimit({
      key: userKey,
    });
    if (limited) {
      return NextResponse.json({ error: rateError }, { status: 429 });
    }

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    const user = await getUserByUsername(auth.username);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, user.id));

    // Optionally, force logout by clearing the cookie (client should redirect to login)
    const response = NextResponse.json({ success: true });
    await clearAuthCookie();
    return response;
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
