import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente con la service_role key — bypasea RLS por completo (ver
 * docs/adr/0001-stack-selection.md y 22-Security-Standards.md del
 * playbook: "el backend que usa service_role bypasea RLS... no asumir
 * que el backend ya valida el rol cubre este caso"). Por eso:
 *
 * - Solo se usa para lo único que un cliente normal no puede hacer:
 *   crear/buscar cuentas de auth por email (lib/roles/provisionar.ts).
 * - Cada función que lo use valida el rol del usuario que llama ANTES
 *   de tocar este cliente — RLS no protege nada acá, la autorización
 *   es responsabilidad explícita del código.
 * - `import "server-only"` hace que el build falle si este archivo
 *   termina importado desde un Client Component.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
