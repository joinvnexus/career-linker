import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `config` arg in `withAuth` function
  function middleware(req) {
    // Middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          if (token?.role === "JOB_SEEKER" && req.nextUrl.pathname.startsWith("/dashboard/job-seeker")) return true
          if (token?.role === "EMPLOYER" && req.nextUrl.pathname.startsWith("/dashboard/employer")) return true
          if (token?.role === "ADMIN" && req.nextUrl.pathname.startsWith("/admin")) return true
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
}

