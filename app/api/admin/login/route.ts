import { generateToken } from "@/lib/auth";
import { validateUserPassword } from "@/lib/db/queries";
import { loginSchema } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";

/**
 * Handles admin login requests by validating credentials and issuing an authentication token.
 *
 * Accepts a JSON request body with `username` and `password`, verifies the credentials, and returns user information with an authentication cookie on success. Responds with appropriate error messages and status codes on failure.
 */
export async function POST(request: NextRequest) {
  // Use IP address for rate limiting key
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { limited, error: rateLimitError } = await checkRateLimit({
    key: `login:${ip}`,
  });
  if (limited) {
    return NextResponse.json(
      {
        error:
          rateLimitError || "Too many login attempts. Please try again later.",
      },
      { status: 429 }
    );
  }
  try {
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    // Validate user credentials
    const user = await validateUserPassword(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
      },
    });

    // Set authentication cookie on the response
    const token = await generateToken(user);
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
