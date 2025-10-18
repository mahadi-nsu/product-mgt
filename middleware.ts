import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /products, /login)
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/products"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a protected route, we'll let the client-side auth handle it
  // This middleware is mainly for server-side redirects if needed
  if (isProtectedRoute) {
    // For now, let the client-side auth handle the protection
    // This ensures we don't have hydration mismatches
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
