"use server";

import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarCentros } from "@/lib/roles/resolve-mi-rol";
import { buscarUsuarioIdPorEmail } from "@/lib/roles/provisionar";
import type { EstadoCrearCentro } from "./estado-inicial";

export async function crearCentro(
  _prevState: EstadoCrearCentro,
  formData: FormData,
): Promise<EstadoCrearCentro> {
  const miRol = await getMiRol();
  if (!miRol || !puedeGestionarCentros(miRol.rol)) {
    return { ok: false, error: "Tu rol no puede crear centros de acopio." };
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  const ubicacion = String(formData.get("ubicacion") ?? "").trim();
  const horario = String(formData.get("horario") ?? "").trim();
  const responsableEmail = String(formData.get("responsableEmail") ?? "").trim();
  const nodoIdForm = String(formData.get("nodoId") ?? "").trim();

  if (!nombre || !ubicacion || !horario || !responsableEmail) {
    return { ok: false, error: "Completá todos los campos." };
  }

  // admin_nacional elige el nodo en el form; lider/suplente usan el suyo,
  // sin confiar en lo que venga del cliente para ese caso.
  const nodoId = miRol.rol === "admin_nacional" ? nodoIdForm : miRol.nodoId;
  if (!nodoId) {
    return { ok: false, error: "Elegí una ciudad." };
  }

  const responsableId = await buscarUsuarioIdPorEmail(responsableEmail);
  if (!responsableId) {
    return {
      ok: false,
      error:
        "No existe ninguna cuenta con ese correo. Asigná primero un rol a esa persona en Roles.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("centros_acopio").insert({
    nodo_id: nodoId,
    nombre,
    ubicacion,
    horario,
    responsable_user_id: responsableId,
  });

  if (error) {
    // El trigger trg_exigir_rol_responsable devuelve este mensaje si el
    // responsable no tiene ya un rol en ese nodo (FR-E3-01, FR-E8-07).
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
