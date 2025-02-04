import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./action/verifyToken";

// Middleware function to check authorization
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL(
    `/login?nextUrl=${encodeURIComponent(`${pathname}${search}`)}`,
    request.url
  );

  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.redirect(loginUrl);
    }

    const data = await verifyToken(
      accessToken,
      process.env.access_token_secret!
    );

    if (!data) {
      return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname === "/promotion") {
      return NextResponse.redirect(new URL("/promotion/slider", request.url));
    }
    // shop setup redirect /shop-setup to /shop-setup/general-settings
    if (pathname === "/shop-setup") {
      return NextResponse.redirect(
        new URL("/shop-setup/general-settings", request.url)
      );
    }
    if (pathname === "/review") {
      return NextResponse.redirect(new URL("/review/all-reviews", request.url));
    }

    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/((?!login|signup|forgot-password|submit-otp|api|_next|public|assets).*)",
  ],
};
