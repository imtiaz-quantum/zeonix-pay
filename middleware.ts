import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const allowedPaths = ["admin", "merchant", "staff"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.next();
  }

  // Get the first path segment - the dynamic role
  const segments = pathname.split("/").filter(Boolean);
  const routeRole = segments[0];

  // Check if the routeRole is an allowed path
  if (!allowedPaths.includes(routeRole)) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // Get user's role from token/session
  const token = await getToken({ req: request });
  const userRole = token?.role;

  // If user not logged in or role mismatch, redirect to login page
  if (!userRole || userRole !== routeRole) {
    return NextResponse.redirect(new URL(`/${userRole?? routeRole}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|server-down|payment|success|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};