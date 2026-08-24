import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 renamed middleware.ts -> proxy.ts (same runtime, new name —
 * see node_modules/next/dist/docs/.../file-conventions/proxy.md). Scoped by
 * `config.matcher` to exactly the panel routes so it never touches the
 * public portal another agent is building in parallel.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/necesidades",
    "/necesidades/:path*",
    "/centro",
    "/centro/:path*",
    "/roles",
    "/roles/:path*",
    "/nodos",
    "/nodos/:path*",
    "/perfil",
    "/perfil/:path*",
  ],
};
