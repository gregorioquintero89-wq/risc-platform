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

/**
 * Espejo de las policies roles_admin_asigna / roles_lider_asigna_en_su_nodo
 * (RLS es la autoridad real; esto es solo para no mostrar en la UI una
 * opción que la base va a rechazar igual).
 */
export function rolesAsignablesPor(rol: RolRisc): RolRisc[] {
  if (rol === "admin_nacional") return ["lider", "suplente", "operador", "admin_nacional"];
  if (rol === "lider" || rol === "suplente") return ["suplente", "operador"];
  return [];
}

/** Espejo de centros_gestiona_lider. */
export function puedeGestionarCentros(rol: RolRisc): boolean {
  return rol === "lider" || rol === "suplente" || rol === "admin_nacional";
}

/** Espejo de nodos_admin_gestiona. */
export function puedeGestionarNodos(rol: RolRisc): boolean {
  return rol === "admin_nacional";
}

/**
 * Autorización completa (rol + nodo) para asignar rolObjetivo en
 * nodoObjetivo. Espejo exacto de roles_admin_asigna +
 * roles_lider_asigna_en_su_nodo — RLS es quien realmente lo hace
 * cumplir, esto solo evita ofrecer en la UI algo que la base rechazaría.
 */
export function actorPuedeAsignar(
  actor: MiRol,
  rolObjetivo: RolRisc,
  nodoObjetivo: string | null,
): boolean {
  if (!rolesAsignablesPor(actor.rol).includes(rolObjetivo)) return false;
  if (actor.rol === "admin_nacional") return true;
  return actor.nodoId !== null && actor.nodoId === nodoObjetivo;
}
