// ─────────────────────────────────────────────────────────────────────────────
// src/middleware.ts
// Next.js Edge Middleware — ป้องกัน protected routes และ role-based access
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// ─── route config ─────────────────────────────────────────────────────────────

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const AUTH_ROUTES = ["/login", "/register"];        // redirect ออกถ้า login อยู่แล้ว
const ADMIN_ROUTES = ["/admin"];                     // ต้องเป็น role admin เท่านั้น

// ─── JWT payload type ─────────────────────────────────────────────────────────

interface JwtPayload {
  sub: string;
  email: string;
  role: "user" | "admin";
  exp: number;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function getTokenFromRequest(req: NextRequest): string | null {
  // 1. Authorization header (API calls)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // 2. Cookie (SSR / httpOnly fallback)
  return req.cookies.get("vdx_access_token")?.value ?? null;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    // Check expiry
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function isPathMatch(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// ─── middleware ───────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(req);
  const payload = token ? decodeToken(token) : null;
  const isAuthenticated = !!payload;

  // ── If on auth page and already logged in → redirect to dashboard ──
  if (isAuthenticated && isPathMatch(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── If on public route → allow through ──
  if (isPathMatch(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // ── Not authenticated → redirect to login ──
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // ── Admin route guard ──
  if (isPathMatch(pathname, ADMIN_ROUTES) && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};