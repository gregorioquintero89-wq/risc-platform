"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  esReporteValido,
  validarReporteNecesidad,
  type ReporteNecesidadInput,
} from "@/lib/necesidades/validar-reporte";
import type { EstadoReporteNecesidad } from "./estado-inicial";

/**
 * Reportar necesidad (FR-E1-01/02, US-E1-01). El insert es público —
 * la policy necesidades_insert_publico exige estado = 'reportada', que
 * es exactamente el único estado que se manda acá. No se encadena
 * .select() tras el insert: la fila recién creada tiene estado
 * 'reportada', que no pasa la policy de SELECT pública
 * (necesidades_select_publico solo deja ver 'publicada'/'resuelta'),
 * así que un RETURNING lanzaría un error de RLS en vez de ayudar.
 */
export async function reportarNecesidad(
  _estadoPrevio: EstadoReporteNecesidad,
  formData: FormData,
): Promise<EstadoReporteNecesidad> {
  const valores: ReporteNecesidadInput = {
    titulo: String(formData.get("titulo") ?? ""),
    categoria: String(formData.get("categoria") ?? ""),
    responsable: String(formData.get("responsable") ?? ""),
    cantidadNecesaria: String(formData.get("cantidadNecesaria") ?? ""),
    fechaLimite: String(formData.get("fechaLimite") ?? ""),
    nodoId: String(formData.get("nodoId") ?? ""),
    albergue: String(formData.get("albergue") ?? ""),
  };

  const errores = validarReporteNecesidad(valores);
  if (!esReporteValido(errores)) {
    return { errores, valores };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("necesidades").insert({
    titulo: valores.titulo.trim(),
    categoria: valores.categoria.trim(),
    responsable: valores.responsable.trim(),
    cantidad_necesaria: Number(valores.cantidadNecesaria),
    fecha_limite: valores.fechaLimite,
    nodo_id: valores.nodoId,
    albergue: valores.albergue?.trim() ? valores.albergue.trim() : null,
    estado: "reportada",
  });

  if (error) {
    return {
      errores: {},
      valores,
      errorEnvio:
        "No pudimos registrar la necesidad. Revisá los datos e intentá de nuevo.",
    };
  }

  redirect("/");
}
