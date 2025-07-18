import { initializeAdminUser } from "@/lib/db/queries";
import { NextResponse } from "next/server";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("Initialize admin error: Failed to initialize admin user");
    return NextResponse.json(
      { error: "Failed to initialize admin user" },
      { status: 500 }
    );
  }
}
