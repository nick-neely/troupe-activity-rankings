import { checkRateLimit } from "@/lib/rateLimit";
import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Use IP address as key for rate limiting
  const ip = request.headers.get?.("x-forwarded-for") || "unknown";
  const { limited, error: rateError } = await checkRateLimit({
    key: `otp:${ip}`,
  });
  if (limited) {
    return NextResponse.json(
      { success: false, error: rateError },
      { status: 429 }
    );
  }

  let code: string;
  try {
    const body = await request.json();
    code = body.code;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const sitewideCode = process.env.SITEWIDE_CODE;
  if (!sitewideCode) {
    return NextResponse.json(
      { success: false, error: "Server configuration error." },
      { status: 500 }
    );
  }
  if (typeof code !== "string" || code.length !== sitewideCode.length) {
    return NextResponse.json(
      { success: false, error: "Invalid code format." },
      { status: 400 }
    );
  }
  if (timingSafeEqual(Buffer.from(code), Buffer.from(sitewideCode))) {
    const response = NextResponse.json({ success: true });
    response.headers.set(
      "Set-Cookie",
      "sitewide_unlocked=true; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict"
    );
    return response;
  }
  return NextResponse.json(
    { success: false, error: "Incorrect code." },
    { status: 401 }
  );
}
