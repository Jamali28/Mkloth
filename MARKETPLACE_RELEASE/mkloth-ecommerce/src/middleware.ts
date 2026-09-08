import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PUBLIC_FILE = /\.(.*)$/;

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

  const isLoggedIn = !!req.auth?.user;
  const isAdmin = req.auth?.user?.role === "ADMIN";
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  if (isApiAuthRoute) return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|api/auth).*)"],
};
