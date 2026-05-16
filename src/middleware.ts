import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await auth.verifySessionCookie(sessionCookie, true);
    return NextResponse.next();
  } catch {
    // Session expired or invalid
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
