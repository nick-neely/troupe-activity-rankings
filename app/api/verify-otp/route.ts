import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();

  const sitewideCode = process.env.SITEWIDE_CODE;
  if (!sitewideCode) {
    throw new Error("SITEWIDE_CODE environment variable is not set.");
  }
  if (typeof code !== "string" || code.length < 6) {
    return NextResponse.json(
      { success: false, error: "Invalid code format." },
      { status: 400 }
    );
  }
  if (
    code.length === sitewideCode.length &&
    timingSafeEqual(Buffer.from(code), Buffer.from(sitewideCode))
  ) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json(
    { success: false, error: "Incorrect code." },
    { status: 401 }
  );
}
