// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types/database";

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            response = NextResponse.next({
              request: {
                headers: req.headers,
              },
            });
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getSession();

  return response;
}

// Protege rutas dentro de /app (zona autenticada)
export const config = {
  matcher: ["/app/:path*"],
};
