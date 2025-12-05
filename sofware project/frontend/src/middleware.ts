import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "../../i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if route requires authentication
  const protectedRoutes = ["/dashboard", "/appointments", "/records", "/settings", "/chatbot"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.includes(route));

  // Skip auth check for auth pages and public routes
  const publicRoutes = ["/login", "/register", "/emergency"];
  const isPublicRoute = publicRoutes.some((route) => pathname.includes(route));

  if (isProtectedRoute && !isPublicRoute) {
    // Check for auth cookie
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login/register
  if ((pathname.includes("/login") || pathname.includes("/register"))) {
    const token = request.cookies.get("token")?.value;
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Apply i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

