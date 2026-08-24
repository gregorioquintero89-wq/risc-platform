"use server";

import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { actorPuedeAsignar, rolesAsignablesPor } from "@/lib/roles/resolve-mi-rol";
import { buscarOCrearUsuarioPorEmail } from "@/lib/roles/provisionar";
import type { Enums } from "@/lib/supabase/database.types";
import type { EstadoAsignarRol } from "./estado-inicial";

type RolRisc = Enums<"rol_risc">;
const ROLES_VALIDOS: RolRisc[] = ["lider", "suplente", "operador", "admin_nacional"];

export async function asignarRol(
  _prevState: EstadoAsignarRol,
  formData: FormData,
): Promise<EstadoAsignarRol> {
  const miRol = await getMiRol();
  if (!miRol || rolesAsignablesPor(miRol.rol).length === 0) {
    return { ok: false, error: "Tu rol no puede asignar roles." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const rolObjetivoRaw = String(formData.get("rol") ?? "");
  const nodoIdForm = String(formData.get("nodoId") ?? "").trim() || null;

  if (!email || !nombre || !ROLES_VALIDOS.includes(rolObjetivoRaw as RolRisc)) {
    return { ok: false, error: "Completá el nombre, el correo y elegí un rol." };
  }
  const rolObjetivo = rolObjetivoRaw as RolRisc;

  // admin_nacional no cuelga de nodo (FR-E8-04); cualquier otro rol lo
  // necesita. Un lider/suplente asigna siempre en SU propio nodo, sin
  // confiar en lo que venga del formulario para ese caso.
  const nodoObjetivo =
    rolObjetivo === "admin_nacional" ? null : miRol.rol === "admin_nacional" ? nodoIdForm : miRol.nodoId;

  if (rolObjetivo !== "admin_nacional" && !nodoObjetivo) {
    return { ok: false, error: "Elegí una ciudad para ese rol." };
  }

  if (!actorPuedeAsignar(miRol, rolObjetivo, nodoObjetivo)) {
    return { ok: false, error: "No tenés permiso para asignar ese rol en ese nodo." };
  }

  let usuario: { id: string; cuentaNueva: boolean; passwordTemporal?: string };
  try {
    usuario = await buscarOCrearUsuarioPorEmail(email, nombre);
  } catch {
    return { ok: false, error: "No se pudo crear la cuenta para ese correo." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("usuario_roles").insert({
    user_id: usuario.id,
    rol: rolObjetivo,
    nodo_id: nodoObjetivo,
  });

  if (error) {
    // BR-11 (unique user_id) devuelve acá si esa persona ya tiene un rol.
    return { ok: false, error: error.message };
  }

  return usuario.cuentaNueva
    ? {
        ok: true,
        passwordTemporal: usuario.passwordTemporal,
        emailCreado: email,
        nombreCreado: nombre,
      }
    : { ok: true };
}
