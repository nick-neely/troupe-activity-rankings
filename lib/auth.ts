import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { User } from "./db";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("ADMIN_JWT_SECRET environment variable is required");
}
// TextEncoder-based secret for Web Crypto
const encoder = new TextEncoder();
const SECRET = encoder.encode(JWT_SECRET);
const COOKIE_NAME = "admin_token";

export interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export async function generateToken(user: User): Promise<string> {
  const payload = { userId: user.id, username: user.username };
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
  return jwt;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = (await jwtVerify(token, SECRET)) as {
      payload: JWTPayload;
    };
    return payload;
  } catch (error) {
    console.log("Token verification failed:", error);
    return null;
  }
}

export async function setAuthCookie(user: User) {
  const token = await generateToken(user);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function getAuthUserFromRequest(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const result = await verifyToken(token);
  return result;
}
