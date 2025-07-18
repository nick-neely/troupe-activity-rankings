import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const isAdminPath = pathname.startsWith("/admin");
  const isUploadAPI = pathname.startsWith("/api/upload");
  const isLoginPage = pathname === "/admin/login";

  // Get user authentication status
  const user = await getAuthUserFromRequest(request);

  // If user is authenticated and trying to access login page, redirect to admin
  if (isLoginPage && user) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  // Allow access to login page for unauthenticated users
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Check authentication for admin paths and upload API
  if (isAdminPath || isUploadAPI) {
    if (!user) {
      // Redirect to login page
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*"],
};

export const runtime = "nodejs";
