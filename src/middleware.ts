import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import { ROUTE_ROLES } from "@/lib/rbac";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Find matching route rule from RBAC mapping
  const rule = Object.entries(ROUTE_ROLES).find(
    ([prefix]) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
  
  if (!rule) return; // Public route, allow access

  const role = req.auth?.user?.role;
  
  // 1. Unauthenticated users -> Redirect to login page
  if (!role) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.nextUrl)
    );
  }

  // 2. Unauthorized role -> Redirect to 403 Forbidden page
  if (!rule[1].includes(role)) {
    return NextResponse.redirect(new URL("/forbidden", req.nextUrl));
  }
});

// Skip static assets, API endpoints, SVG icons, and Next.js internal files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};