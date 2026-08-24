"use server";

import { createClient } from "@/lib/supabase/server";
import { buscarUsuarioIdPorEmail } from "@/lib/roles/provisionar";

export type EstadoEditarCentro = { ok: boolean; error?: string };

export async function actualizarCentro(
  _prevState: EstadoEditarCentro,
  formData: FormData,
): Promise<EstadoEditarCentro> {
  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const ubicacion = String(formData.get("ubicacion") ?? "").trim();
  const horario = String(formData.get("horario") ?? "").trim();
  const responsableEmail = String(formData.get("responsableEmail") ?? "").trim();

  if (!nombre || !ubicacion || !horario) {
    return { ok: false, error: "Completá nombre, ubicación y horario." };
  }

  const update: Record<string, string> = { nombre, ubicacion, horario };
  if (responsableEmail) {
    const responsableId = await buscarUsuarioIdPorEmail(responsableEmail);
    if (!responsableId) {
      return { ok: false, error: "No existe ninguna cuenta con ese correo." };
    }
    update.responsable_user_id = responsableId;
  }

  const supabase = await createClient();
  // centros_gestiona_lider (RLS) es la autoridad: lider/suplente en su
  // nodo, admin_nacional en cualquiera.
  const { error } = await supabase.from("centros_acopio").update(update).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function toggleActivoCentro(
  _prevState: EstadoEditarCentro,
  formData: FormData,
): Promise<EstadoEditarCentro> {
  const id = String(formData.get("id") ?? "");
  const activo = String(formData.get("activo") ?? "") === "true";

  const supabase = await createClient();
  const { error } = await supabase
    .from("centros_acopio")
    .update({ activo: !activo })
    .eq("id", id);
  if (error) return { ok: false, error: "No se pudo cambiar el estado del centro." };
  return { ok: true };
}
