import Link from "next/link";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarNecesidades, puedeOperarCentro } from "@/lib/roles/resolve-mi-rol";
import { logout } from "./actions";
import styles from "./panel.module.css";

const ETIQUETA_ROL: Record<string, string> = {
  lider: "Líder",
  suplente: "Suplente",
  operador: "Operador",
  admin_nacional: "Admin nacional",
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const miRol = await getMiRol();

  if (!miRol) {
    return (
      <main className="pagina">
        <p role="alert" className="mensaje-error">
          Tu cuenta no tiene un rol asignado todavía. Contactá a un administrador nacional
          para que te registre en un nodo.
        </p>
      </main>
    );
  }

  return (
    <div className={styles.contenedor}>
      <header className={styles.header}>
        <div className={styles.headerFila}>
          <span className={styles.marca}>RISC</span>
          <span className={`chip ${styles.chipRol}`}>
            {ETIQUETA_ROL[miRol.rol] ?? miRol.rol}
          </span>
        </div>
        <nav className={styles.nav}>
          {puedeGestionarNecesidades(miRol.rol) && (
            <Link href="/necesidades" className={styles.navLink}>
              Necesidades
            </Link>
          )}
          {puedeOperarCentro(miRol.rol) && (
            <Link href="/centro" className={styles.navLink}>
              Centro de acopio
            </Link>
          )}
          <form action={logout} className={styles.logoutForm}>
            <button type="submit" className={styles.logoutBtn}>
              Cerrar sesión
            </button>
          </form>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
