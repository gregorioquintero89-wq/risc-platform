"use server";

import { createClient } from "@/lib/supabase/server";
import type { EstadoCambiarPassword } from "./estado-inicial";

/**
 * supabase.auth.updateUser cambia la contraseña de la sesión actual —
 * no hace falta la service_role key acá, a diferencia de crear cuentas
 * ajenas en lib/roles/provisionar.ts.
 */
export async function cambiarPassword(
  _prevState: EstadoCambiarPassword,
  formData: FormData,
): Promise<EstadoCambiarPassword> {
  const nueva = String(formData.get("nueva") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");

  if (nueva.length < 8) {
    return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }
  if (nueva !== confirmar) {
    return { ok: false, error: "Las contraseñas no coinciden." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: nueva });
  if (error) {
    return { ok: false, error: "No se pudo cambiar la contraseña." };
  }

  return { ok: true };
}
