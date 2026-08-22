/**
 * Progress-bar percentage for a need's card (PRD sección 13 — "ficha de
 * necesidad con barra de progreso"). Mirrors FR-E1-04's máx(0, ...)
 * clamping in the other direction: concurrent donations can push
 * cantidad_recibida past cantidad_necesaria (OpenSpec sección 6,
 * surplus is accepted, not rejected), so this clamps at 100 instead of
 * rendering a bar wider than its container.
 */
export function calcularProgresoDonacion(
  cantidadNecesaria: number,
  cantidadRecibida: number,
): number {
  if (!Number.isFinite(cantidadNecesaria) || cantidadNecesaria <= 0) {
    return 0;
  }

  const porcentaje = (cantidadRecibida / cantidadNecesaria) * 100;
  return Math.min(100, Math.max(0, Math.round(porcentaje)));
}
