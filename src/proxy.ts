import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

// Next.js 16 "proxy" (the new name for middleware).
// Its only job: keep the Supabase login session fresh by refreshing
// expiring tokens and writing the updated cookies on every page request.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() asks Supabase to verify the token (getSession() alone is not trustworthy).
  // Do not put any code between createServerClient and this call.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on pages only; skip static files, images and common assets.
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
