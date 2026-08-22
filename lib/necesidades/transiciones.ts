type ValidacionMotivo = { ok: true; motivo: string } | { ok: false; error: string };

export function validarMotivoDescarte(motivo: string): ValidacionMotivo {
  const trimmed = motivo.trim();
  if (!trimmed) {
    return { ok: false, error: "El motivo del descarte es obligatorio." };
  }
  return { ok: true, motivo: trimmed };
}

type NecesidadOrdenable = { fecha_limite: string; faltante: number | null };

/**
 * FR-E1-06: sin prioridad editable, el orden se deriva de fecha límite
 * (más urgente primero) y, en empate, del faltante mayor primero.
 */
export function compararPublicadas(a: NecesidadOrdenable, b: NecesidadOrdenable): number {
  if (a.fecha_limite !== b.fecha_limite) {
    return a.fecha_limite < b.fecha_limite ? -1 : 1;
  }
  return (b.faltante ?? 0) - (a.faltante ?? 0);
}
