import { getIronSession } from "iron-session";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { type SessionData, sessionOptions } from "~/lib/siwe-session";

const protectedPaths = ["/activity", "/bookmarks"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  try {
    const res = NextResponse.next();
    const session = await getIronSession<SessionData>(request, res, sessionOptions);

    if (!session.siwe?.address) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const now = new Date();
    const expirationTime = new Date(session.siwe.expirationTime);

    if (now > expirationTime) {
      session.destroy();
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
