import type { Enums } from "@/lib/supabase/database.types";

type RolRisc = Enums<"rol_risc">;

type MiRolRow = { rol: RolRisc; nodo_id: string | null };

export type MiRol = { rol: RolRisc; nodoId: string | null };

/**
 * usuario_roles.user_id is unique (BR-11: un rol por persona), so mi_rol()
 * returns at most one row in practice. If it ever returns more, the first
 * row wins rather than throwing — a data anomaly shouldn't crash the panel.
 */
export function resolveMiRol(rows: MiRolRow[]): MiRol | null {
  const first = rows[0];
  if (!first) return null;
  return { rol: first.rol, nodoId: first.nodo_id };
}

export function puedeGestionarNecesidades(rol: RolRisc): boolean {
  return rol === "lider" || rol === "suplente";
}

export function puedeOperarCentro(rol: RolRisc): boolean {
  return rol === "lider" || rol === "suplente" || rol === "operador";
}
