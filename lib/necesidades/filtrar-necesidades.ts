import type { NecesidadListada } from "./types";

export type FiltroNecesidades = {
  nodoId?: string;
  categoria?: string;
};

/**
 * Filters the public listing to needs that still have something
 * missing (FR-E1-04/05 — a need with faltante 0 auto-resolves and
 * stops being actionable) and, optionally, to one city/node and one
 * category (FR-E2-01).
 *
 * Sorts by fecha_limite ascending, then faltante descending — there is
 * no priority field, that ordering IS the priority (FR-E1-06, BR-03).
 */
export function filtrarYOrdenarNecesidades(
  necesidades: NecesidadListada[],
  filtro: FiltroNecesidades = {},
): NecesidadListada[] {
  return necesidades
    .filter((n) => (n.faltante ?? 0) > 0)
    .filter((n) => !filtro.nodoId || n.nodo?.id === filtro.nodoId)
    .filter((n) => !filtro.categoria || n.categoria === filtro.categoria)
    .sort((a, b) => {
      const porFecha = a.fecha_limite.localeCompare(b.fecha_limite);
      if (porFecha !== 0) return porFecha;
      return (b.faltante ?? 0) - (a.faltante ?? 0);
    });
}
