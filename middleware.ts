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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/auth/callback"];
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Si es ruta pública, permitir acceso
  if (isPublicRoute) {
    return response;
  }

  // Si no hay sesión y no es ruta pública, redirigir a login
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay sesión y está en login, redirigir a dashboard
  if (req.nextUrl.pathname === "/login") {
    const dashboardUrl = new URL("/app/ventas", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Verificar acceso a rutas protegidas por rol
  if (req.nextUrl.pathname.startsWith("/app/")) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const userRole = "ventas"; // Por defecto, se puede mejorar después
      const path = req.nextUrl.pathname;

      // Por ahora, permitir acceso a todas las rutas /app para usuarios autenticados
      // La verificación de roles se implementará en las páginas individuales
    } catch (error) {
      console.error("Error verificando rol:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return response;
}

// Protege rutas específicas
export const config = {
  matcher: ["/app/:path*", "/login", "/auth/callback"],
};
