import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not run any code between createServerClient and auth.getClaims()
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Log for debugging
  console.log(
    "[Middleware] Path:",
    request.nextUrl.pathname,
    "| User:",
    user ? "Present" : "None",
  );

  // Allow auth callback routes to proceed without user check
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    console.log("[Middleware] Allowing auth callback to proceed");
    return supabaseResponse;
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/onboarding"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Check if user is authenticated for protected routes
  if (!user && isProtectedRoute) {
    console.log("[Middleware] Redirecting to login:", request.nextUrl.pathname);
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth page (except callback)
  if (
    user &&
    request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.includes("/callback")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
