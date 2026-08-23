"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveMiRol } from "@/lib/roles/resolve-mi-rol";

export type LoginState = { error: string } | undefined;

/**
 * A dónde cae cada rol al loguearse — la vista donde ese rol
 * realmente puede hacer algo, no siempre /necesidades (admin_nacional
 * ni operador la tienen: puedeGestionarNecesidades los excluye).
 */
function destinoSegunRol(rol: string): string {
  if (rol === "operador") return "/centro";
  if (rol === "admin_nacional") return "/nodos";
  return "/necesidades";
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const { data } = await supabase.rpc("mi_rol");
  const miRol = resolveMiRol(data ?? []);
  redirect(destinoSegunRol(miRol?.rol ?? ""));
}
