import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { getDashboardPathForRole } from "@/config/roles";

const hasAccess = (pathname: string, role?: Role): boolean => {
  if (!role) {
    return false;
  }

  if (pathname.startsWith("/admin")) {
    return role === "ADMIN";
  }

  if (pathname.startsWith("/dashboard/employer")) {
    return role === "EMPLOYER";
  }

  if (pathname.startsWith("/dashboard/job-seeker")) {
    return role === "JOB_SEEKER";
  }

  if (pathname === "/dashboard") {
    return true;
  }

  return false;
};

export default withAuth(
  function proxy(req: NextRequestWithAuth) {
    const pathname = req.nextUrl.pathname;
    const role = req.nextauth.token?.role as Role | undefined;

    if (pathname === "/dashboard" && role) {
      return NextResponse.redirect(new URL(getDashboardPathForRole(role), req.url));
    }

    if (!hasAccess(pathname, role)) {
      if (!role) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      return NextResponse.redirect(new URL(getDashboardPathForRole(role), req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/admin/:path*"],
};
