"use server";

import { createClient } from "@/lib/supabase/server";
import {
  esCompromisoValido,
  validarCompromisoDonacion,
  type CompromisoDonacionInput,
} from "@/lib/donaciones/validar-compromiso";
import type { EstadoCompromisoDonacion } from "./estado-inicial";

/**
 * Comprometer donación (FR-E2-02/03, US-E2-02). necesidadId viaja
 * "horneado" en la Server Action vía .bind(null, necesidadId) desde el
 * Client Component — no como campo oculto del form — para que no
 * dependa de un valor que el navegante pueda alterar.
 *
 * Usa la función crear_donacion_publica() (security definer) en vez de
 * un INSERT directo: `donaciones` no tiene policy de SELECT para anon
 * a propósito, y encadenar .select() en un insert directo revierte la
 * operación entera (Postgres exige SELECT policy cuando hay
 * RETURNING). La función hace la misma validación que tenía la policy
 * retirada y devuelve el código generado — único camino de inserción
 * pública, ver migración 20260822153000.
 */
export async function comprometerDonacion(
  necesidadId: string,
  _estadoPrevio: EstadoCompromisoDonacion,
  formData: FormData,
): Promise<EstadoCompromisoDonacion> {
  const valores: CompromisoDonacionInput = {
    cantidad: String(formData.get("cantidad") ?? ""),
    contactoNombre: String(formData.get("contactoNombre") ?? ""),
    contactoTelefono: String(formData.get("contactoTelefono") ?? ""),
    centroId: String(formData.get("centroId") ?? ""),
  };

  const errores = validarCompromisoDonacion(valores);
  if (!esCompromisoValido(errores)) {
    return { errores, valores };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("crear_donacion_publica", {
    p_necesidad_id: necesidadId,
    p_centro_id: valores.centroId,
    p_cantidad: Number(valores.cantidad),
    p_contacto_nombre: valores.contactoNombre.trim(),
    p_contacto_telefono: valores.contactoTelefono.trim(),
  });

  const fila = data?.[0];
  if (error || !fila) {
    return {
      errores: {},
      valores,
      errorEnvio:
        "No pudimos registrar tu donación. Revisá los datos e intentá de nuevo.",
    };
  }

  return {
    errores: {},
    valores,
    resultado: { codigo: fila.codigo, centroNombre: fila.centro_nombre },
  };
}
