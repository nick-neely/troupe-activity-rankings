import { generateToken } from "@/lib/auth";
import { validateUserPassword } from "@/lib/db/queries";
import { loginSchema } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";

export async function POST(request: NextRequest) {
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
