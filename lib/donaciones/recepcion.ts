import type { Enums } from "@/lib/supabase/database.types";

type EstadoDonacion = Enums<"estado_donacion">;

export function normalizarCodigo(codigo: string): string {
  return codigo.trim().toUpperCase();
}

/**
 * trg_recibir_donacion solo inserta el movimiento de inventario cuando
 * old.estado = 'comprometida'; confirmar sobre una donación ya recibida
 * sería un no-op silencioso, así que la UI lo bloquea antes de intentarlo.
 */
export function puedeConfirmarRecepcion(estado: EstadoDonacion): boolean {
  return estado === "comprometida";
}
