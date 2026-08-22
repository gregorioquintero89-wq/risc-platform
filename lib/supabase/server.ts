import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use in Server Components and Server Actions.
 *
 * Reads/writes the session through Next.js cookies so the user's JWT
 * travels with every request — RLS in Postgres enforces isolation,
 * this client never uses the service_role key (see
 * docs/adr/0001-stack-selection.md, "Por qué sin ORM").
 *
 * Server Components can only read cookies, not write them — the
 * `setAll` call is wrapped in try/catch because Next.js throws when
 * called from a Server Component render. Session refresh in that case
 * is handled by middleware (added when auth is implemented).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — safe to ignore when
            // middleware handles session refresh.
          }
        },
      },
    },
  );
}
