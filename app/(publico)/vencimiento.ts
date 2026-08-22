/**
 * Presentational-only helper for the "vence pronto" chip on the public
 * home (mockup guide, no FR attached — this is pure UI, not a business
 * rule). Kept local to app/(publico) instead of lib/ on purpose: it's
 * not part of the domain model, just a display concern for the card.
 */

const MS_POR_DIA = 1000 * 60 * 60 * 24;

/**
 * Days between "today" (midnight UTC) and fecha_limite (a "YYYY-MM-DD"
 * string, always UTC-midnight per how it's stored — see
 * lib/necesidades/types.ts). Normalizing "today" to UTC midnight too
 * avoids the chip flipping a day early/late depending on what time of
 * day it renders.
 */
export function calcularDiasHastaVencimiento(fechaLimite: string): number {
  const hoyMedianoche = Math.floor(Date.now() / MS_POR_DIA) * MS_POR_DIA;
  const limite = new Date(`${fechaLimite}T00:00:00Z`).getTime();
  return Math.round((limite - hoyMedianoche) / MS_POR_DIA);
}

export type UrgenciaVencimiento = "urgente" | "medio" | null;

/** Maps days-remaining to a chip variant — matches .chip--urgente/.chip--medio in globals.css. */
export function calcularUrgenciaVencimiento(dias: number): UrgenciaVencimiento {
  if (dias <= 2) return "urgente";
  if (dias <= 7) return "medio";
  return null;
}

/** Chip label text. */
export function textoVencimiento(dias: number): string {
  if (dias < 0) {
    const vencioHace = Math.abs(dias);
    return `Venció hace ${vencioHace} día${vencioHace === 1 ? "" : "s"}`;
  }
  if (dias === 0) return "Vence hoy";
  if (dias === 1) return "Vence mañana";
  return `Vence en ${dias} días`;
}
