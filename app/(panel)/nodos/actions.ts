"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarNodos } from "@/lib/roles/resolve-mi-rol";
import type { EstadoCrearNodo } from "./estado-inicial";

export async function crearNodo(
  _prevState: EstadoCrearNodo,
  formData: FormData,
): Promise<EstadoCrearNodo> {
  const miRol = await getMiRol();
  if (!miRol || !puedeGestionarNodos(miRol.rol)) {
    return { ok: false, error: "Tu rol no puede crear ciudades." };
  }

  const municipio = String(formData.get("municipio") ?? "").trim();
  const departamento = String(formData.get("departamento") ?? "").trim();
  if (!municipio || !departamento) {
    return { ok: false, error: "Completá municipio y departamento." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("nodos").insert({ municipio, departamento });
  if (error) {
    return {
      ok: false,
      error: error.code === "23505" ? "Esa ciudad ya existe." : error.message,
    };
  }

  revalidatePath("/nodos");
  return { ok: true };
}

export async function toggleActivoNodo(
  _prevState: EstadoCrearNodo,
  formData: FormData,
): Promise<EstadoCrearNodo> {
  const miRol = await getMiRol();
  if (!miRol || !puedeGestionarNodos(miRol.rol)) {
    return { ok: false, error: "Tu rol no puede desactivar ciudades." };
  }

  const id = String(formData.get("id") ?? "");
  const activo = String(formData.get("activo") ?? "") === "true";

  const supabase = await createClient();
  const { error } = await supabase.from("nodos").update({ activo: !activo }).eq("id", id);
  if (error) return { ok: false, error: "No se pudo cambiar el estado de la ciudad." };
  return { ok: true };
}
