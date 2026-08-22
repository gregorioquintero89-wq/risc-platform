import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components (browser).
 *
 * RLS in Postgres — not application code — is what enforces data
 * isolation (see docs/adr/0001-stack-selection.md). This client only
 * carries the user's session; it never bypasses RLS.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
