import type { Tables } from "@/lib/supabase/database.types";

/**
 * Minimal city/node shape used across the public portal — never
 * includes contact data (BR-06 is enforced by RLS, not by this type,
 * but we still avoid widening it to full Tables<"nodos"> by habit).
 */
export type NodoResumen = Pick<
  Tables<"nodos">,
  "id" | "municipio" | "departamento"
>;

/**
 * A `necesidad` as shown on the public portal, joined in application
 * code (not via a Postgrest embed) with its node. See
 * app/(publico)/page.tsx for why the join happens in JS.
 */
export type NecesidadListada = Pick<
  Tables<"necesidades">,
  | "id"
  | "titulo"
  | "categoria"
  | "albergue"
  | "cantidad_necesaria"
  | "cantidad_recibida"
  | "faltante"
  | "fecha_limite"
> & {
  nodo: NodoResumen | null;
};
