"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validarMotivoDescarte } from "@/lib/necesidades/transiciones";

export type EstadoAccionNecesidad = { ok: boolean; error?: string };

/**
 * Ni revalidatePath solo ni redirect() al mismo path refrescaban la
 * navegación blanda en producción, aunque el UPDATE sí llegaba a la
 * base cada vez (confirmado con datos reales vía Playwright + query
 * directa a Postgres — server-side, siempre correcto). El primitivo
 * que sí es incondicional es router.refresh() desde el cliente, así
 * que la acción solo devuelve éxito/error y el componente cliente
 * decide cuándo refrescar (ver publicar-descartar-form.tsx).
 */
export async function publicarNecesidad(
  _prevState: EstadoAccionNecesidad,
  formData: FormData,
): Promise<EstadoAccionNecesidad> {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión inválida." };

  const { error } = await supabase
    .from("necesidades")
    .update({
      estado: "publicada",
      verificado_por: user.id,
      verificado_en: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/necesidades");
  if (error) return { ok: false, error: "No se pudo publicar." };
  return { ok: true };
}

export async function descartarNecesidad(
  _prevState: EstadoAccionNecesidad,
  formData: FormData,
): Promise<EstadoAccionNecesidad> {
  const id = String(formData.get("id") ?? "");
  const validacion = validarMotivoDescarte(String(formData.get("motivo") ?? ""));
  if (!validacion.ok) return { ok: false, error: "Ingresá un motivo de descarte." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión inválida." };

  const { error } = await supabase
    .from("necesidades")
    .update({
      estado: "descartada",
      motivo_descarte: validacion.motivo,
      verificado_por: user.id,
      verificado_en: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/necesidades");
  if (error) return { ok: false, error: "No se pudo descartar." };
  return { ok: true };
}
