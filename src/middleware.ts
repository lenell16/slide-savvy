import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // if (session?.user && request.nextUrl.pathname === "/login") {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }

    // if (!session?.user && request.nextUrl.pathname !== "/login") {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
