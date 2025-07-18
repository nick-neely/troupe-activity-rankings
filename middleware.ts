import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "./lib/auth";

/**
 * Middleware for handling authentication and access control for admin and upload routes.
 *
 * Intercepts requests to admin pages, upload API, and category mappings API, enforcing authentication. Redirects authenticated users away from the login page to the admin dashboard, and redirects unauthenticated users attempting to access protected routes to the login page. Allows unauthenticated access to the login page.
 *
 * @returns A NextResponse that either allows the request to proceed or redirects based on authentication status and route.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const isAdminPath = pathname.startsWith("/admin");
  const isUploadAPI = pathname.startsWith("/api/upload");
  const isCategoryMappingsAPI = pathname.startsWith("/api/category-mappings");
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
  if (isAdminPath || isUploadAPI || isCategoryMappingsAPI) {
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
