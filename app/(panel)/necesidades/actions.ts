"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validarMotivoDescarte } from "@/lib/necesidades/transiciones";

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
}
