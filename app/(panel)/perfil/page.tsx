import { getMiRol } from "@/lib/roles/get-mi-rol";
import { CambiarPasswordForm } from "./cambiar-password-form";

export default async function PerfilPage() {
  const miRol = await getMiRol();

  if (!miRol) {
    return (
      <main className="pagina">
        <p role="alert" className="mensaje-error">
          Tu cuenta no tiene un rol asignado todavía.
        </p>
      </main>
    );
  }

  return (
    <div className="pagina">
      <h1>Mi perfil</h1>
      <CambiarPasswordForm />
    </div>
  );
}
