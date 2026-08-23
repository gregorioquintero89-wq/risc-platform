import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

function generarPasswordTemporal(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
}

/**
 * Busca una cuenta existente por email — NO crea una nueva. Usado por
 * "crear centro de acopio": el responsable debe tener YA un rol
 * registrado en el nodo (FR-E3-01, FR-E8-07, bloqueo duro que ya
 * aplica el trigger trg_exigir_rol_responsable); si la cuenta no
 * existe todavía, no tiene sentido crearla acá — el líder primero
 * tiene que asignarle un rol.
 */
export async function buscarUsuarioIdPorEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) return null;
  const usuario = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return usuario?.id ?? null;
}

/**
 * Busca una cuenta por email; si no existe, la crea con una contraseña
 * temporal (misma mecánica usada para bootstrapear las cuentas de
 * prueba a mano: Admin API + email_confirm=true). Usado solo por el
 * flujo de asignar rol — es el único punto de la app donde onboardear
 * gente nueva a RISC tiene sentido, porque asignar el rol es
 * justamente lo que la habilita a hacer algo.
 */
export async function buscarOCrearUsuarioPorEmail(
  email: string,
): Promise<{ id: string; cuentaNueva: boolean; passwordTemporal?: string }> {
  const existenteId = await buscarUsuarioIdPorEmail(email);
  if (existenteId) return { id: existenteId, cuentaNueva: false };

  const admin = createAdminClient();
  const passwordTemporal = generarPasswordTemporal();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: passwordTemporal,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`No se pudo crear la cuenta para ${email}: ${error?.message}`);
  }
  return { id: data.user.id, cuentaNueva: true, passwordTemporal };
}
