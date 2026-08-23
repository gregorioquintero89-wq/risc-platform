"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validarMotivoDescarte } from "@/lib/necesidades/transiciones";

/**
 * revalidatePath por sí solo debería alcanzar (docs de Next: "Server
 * Functions: Updates the UI immediately"), pero en producción la
 * navegación blanda quedaba con datos viejos hasta un reload completo
 * (reproducido y confirmado con datos reales — el UPDATE sí llegaba a
 * la base). redirect() es el primitivo que la propia doc garantiza
 * que fuerza el re-render: "navigates the router and streams the
 * destination's RSC Payload". Mismo patrón que reportarNecesidad.
 */
export async function publicarNecesidad(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("necesidades")
    .update({
      estado: "publicada",
      verificado_por: user.id,
      verificado_en: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/necesidades");
  redirect("/necesidades");
}

export async function descartarNecesidad(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const validacion = validarMotivoDescarte(String(formData.get("motivo") ?? ""));
  if (!validacion.ok) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("necesidades")
    .update({
      estado: "descartada",
      motivo_descarte: validacion.motivo,
      verificado_por: user.id,
      verificado_en: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/necesidades");
  redirect("/necesidades");
}
