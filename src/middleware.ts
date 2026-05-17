/**
 * Next.js 路由守卫 — 主站鉴权 + /xtrue-admin 白名单（Edge，Cookie access_token）
 */

import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/products/*/review",
  "/posts/new",
  "/certification",
];

const ADMIN_PREFIX = "/xtrue-admin";
const ADMIN_FORBIDDEN = "/xtrue-admin/forbidden";

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((pattern) => {
    const regex = new RegExp("^" + pattern.replace(/\*/g, "[^/]+") + "$");
    return regex.test(pathname);
  });
}

function parseAdminUserIds(raw: string | undefined): Set<number> {
  if (!raw?.trim()) return new Set();
  const out = new Set<number>();
  for (const part of raw.split(",")) {
    const n = parseInt(part.trim(), 10);
    if (!Number.isNaN(n)) out.add(n);
  }
  return out;
}

async function getUserIdFromAccessToken(token: string): Promise<number | null> {
  const secret = process.env.JWT_SECRET_KEY?.trim();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    const sub = payload.sub;
    if (typeof sub === "string") {
      const id = parseInt(sub, 10);
      return Number.isNaN(id) ? null : id;
    }
    return null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (pathname === ADMIN_FORBIDDEN || pathname.startsWith(`${ADMIN_FORBIDDEN}/`)) {
      return NextResponse.next();
    }

    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("tab", "login");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userId = await getUserIdFromAccessToken(token);
    const allow = parseAdminUserIds(process.env.ADMIN_USER_IDS);
    if (allow.size === 0 || userId === null || !allow.has(userId)) {
      return NextResponse.redirect(new URL(ADMIN_FORBIDDEN, request.url));
    }
    return NextResponse.next();
  }

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("tab", "login");
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
