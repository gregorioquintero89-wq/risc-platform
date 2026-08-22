import Link from "next/link";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarNecesidades, puedeOperarCentro } from "@/lib/roles/resolve-mi-rol";
import { logout } from "./actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const miRol = await getMiRol();

  if (!miRol) {
    return (
      <main>
        <p role="alert">
          Tu cuenta no tiene un rol asignado todavía. Contactá a un administrador nacional
          para que te registre en un nodo.
        </p>
      </main>
    );
  }

  return (
    <div>
      <nav>
        {puedeGestionarNecesidades(miRol.rol) && <Link href="/necesidades">Necesidades</Link>}
        {puedeOperarCentro(miRol.rol) && <Link href="/centro">Centro de acopio</Link>}
        <form action={logout}>
          <button type="submit">Cerrar sesión</button>
        </form>
      </nav>
      <main>{children}</main>
    </div>
  );
}
