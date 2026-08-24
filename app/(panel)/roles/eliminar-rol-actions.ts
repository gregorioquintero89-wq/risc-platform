"use server";

import { createClient } from "@/lib/supabase/server";

export type EstadoEliminarRol = { ok: boolean; error?: string };

export async function eliminarRol(
  _prevState: EstadoEliminarRol,
  formData: FormData,
): Promise<EstadoEliminarRol> {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  // RLS (roles_admin_elimina / roles_lider_elimina_en_su_nodo) es la
  // autoridad real — mismo alcance que asignar, por diseño (mirror
  // exacto de las policies de insert).
  const { error } = await supabase.from("usuario_roles").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo quitar el rol." };
  return { ok: true };
}
