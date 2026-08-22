import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { resolveMiRol, type MiRol } from "@/lib/roles/resolve-mi-rol";

/**
 * Server Components can't share React Context (see Next.js authentication
 * guide) — layout, necesidades/page and centro/page each call this
 * independently. `cache()` dedupes the mi_rol() round trip within a single
 * render pass instead of hitting Postgres three times per request.
 */
export const getMiRol = cache(async (): Promise<MiRol | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("mi_rol");
  if (error || !data) return null;
  return resolveMiRol(data);
});
