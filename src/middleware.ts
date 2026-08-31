import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Only protect admin dashboard (not login page)
  if (path.startsWith("/admin/dashboard") || path.startsWith("/admin/api")) {
    const isAuthenticated = await verifySession()

    if (!isAuthenticated) {
      const loginUrl = new URL("/admin", request.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/api/:path*"],
}