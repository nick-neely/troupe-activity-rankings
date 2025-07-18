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

/**
 * Generates a signed JWT token for the given user with a 7-day expiration.
 *
 * @param user - The user for whom the token is generated
 * @returns A signed JWT string containing the user's ID and username
 */
export async function generateToken(user: User): Promise<string> {
  const payload = { userId: user.id, username: user.username };
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
  return jwt;
}

/**
 * Verifies a JWT token and returns its decoded payload if valid.
 *
 * @param token - The JWT string to verify
 * @returns The decoded payload if the token is valid, or `null` if verification fails
 */
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

/**
 * Sets an HTTP-only authentication cookie for the specified user.
 *
 * Generates a JWT for the user and stores it as a secure cookie named "admin_token" with a 7-day expiration.
 */
export async function setAuthCookie(user: User) {
  const token = await generateToken(user);
  const cookieStore = await cookies();

  console.log("Setting auth cookie for user:", user.username);

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

/**
 * Removes the authentication cookie from the user's browser, effectively logging out the user.
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Retrieves and verifies the current user's authentication token from cookies.
 *
 * @returns The decoded JWT payload if a valid token is present; otherwise, null.
 */
export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

/**
 * Retrieves and verifies the authentication JWT from the provided Next.js request.
 *
 * @param request - The Next.js request object containing cookies
 * @returns The decoded JWT payload if the token is valid, or null if missing or invalid
 */
export async function getAuthUserFromRequest(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const result = await verifyToken(token);
  return result;
}
