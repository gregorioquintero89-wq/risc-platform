"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizarCodigo } from "@/lib/donaciones/recepcion";

/**
 * redirect() al mismo código de búsqueda: fuerza el re-render server
 * (garantía documentada de Next, ver necesidades/actions.ts) y de paso
 * deja al operador viendo el estado actualizado de la misma donación
 * que acaba de confirmar, sin tener que volver a buscar el código.
 */
export async function confirmarRecepcion(formData: FormData) {
  const codigo = normalizarCodigo(String(formData.get("codigo") ?? ""));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // .eq("estado", "comprometida") is the authoritative server-side guard —
  // trg_recibir_donacion only fires the inventory insert on that transition,
  // so confirming an already-recibida donation must affect zero rows here.
  await supabase
    .from("donaciones")
    .update({ estado: "recibida", recibida_por: user.id })
    .eq("codigo", codigo)
    .eq("estado", "comprometida");

  revalidatePath("/centro");
  redirect(`/centro?codigo=${encodeURIComponent(codigo)}`);
}
