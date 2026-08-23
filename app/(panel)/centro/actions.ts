"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizarCodigo } from "@/lib/donaciones/recepcion";

export type EstadoConfirmarRecepcion = { ok: boolean; error?: string };

/**
 * Ni revalidatePath solo ni redirect() al mismo path refrescaban la
 * navegación blanda en producción (mismo hallazgo documentado en
 * necesidades/actions.ts). La acción solo devuelve éxito/error; el
 * componente cliente decide cuándo refrescar con router.refresh().
 */
export async function confirmarRecepcion(
  _prevState: EstadoConfirmarRecepcion,
  formData: FormData,
): Promise<EstadoConfirmarRecepcion> {
  const codigo = normalizarCodigo(String(formData.get("codigo") ?? ""));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión inválida." };

  // .eq("estado", "comprometida") is the authoritative server-side guard —
  // trg_recibir_donacion only fires the inventory insert on that transition,
  // so confirming an already-recibida donation must affect zero rows here.
  const { error } = await supabase
    .from("donaciones")
    .update({ estado: "recibida", recibida_por: user.id })
    .eq("codigo", codigo)
    .eq("estado", "comprometida");

  revalidatePath("/centro");
  if (error) return { ok: false, error: "No se pudo confirmar la recepción." };
  return { ok: true };
}
