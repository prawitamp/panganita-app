import { NextResponse } from "next/server";

export function middleware(request) {
  const isMaintenance = process.env.MAINTENANCE_MODE === "true";
  const isMaintenancePage = request.nextUrl.pathname === "/maintenance";

  if (isMaintenance && !isMaintenancePage && !request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
