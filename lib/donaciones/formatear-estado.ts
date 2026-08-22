import type { Enums } from "@/lib/supabase/database.types";

/**
 * Human-readable label for a donation's estado (US-E2-05). Only
 * `comprometida` and `recibida` exist (database.types.ts,
 * estado_donacion) — a donation flagged for operator review (FR-E2-05)
 * is out of scope for the donor-facing query, per that story's Edge
 * Cases section.
 */
export function formatearEstadoDonacion(
  estado: Enums<"estado_donacion">,
): string {
  if (estado === "recibida") {
    return "Recibida en el centro de acopio.";
  }
  return "Comprometida — todavía no llega al centro de acopio.";
}
