import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isProductionDomain(req: NextRequest): boolean {
  const prodDomain = process.env.PROD_DOMAIN;
  if (!prodDomain) return false;
  const host = req.headers.get("host") ?? "";
  return host === prodDomain || host.endsWith(`.${prodDomain}`);
}

export function middleware(req: NextRequest) {
  if (isProductionDomain(req)) return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const [username, password] = atob(authHeader.slice(6)).split(":");
    if (username === "k&s" && password === process.env.SITE_PASSWORD) return NextResponse.next();
  }

  return new NextResponse(null, {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Kilburn & Strode"' },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)).*)",
  ],
};
