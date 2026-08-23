import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { rolesAsignablesPor } from "@/lib/roles/resolve-mi-rol";
import { AsignarRolForm } from "./asignar-rol-form";

export default async function RolesPage() {
  const miRol = await getMiRol();
  const rolesDisponibles = miRol ? rolesAsignablesPor(miRol.rol) : [];

  if (!miRol || rolesDisponibles.length === 0) {
    return (
      <main className="pagina">
        <p role="alert" className="mensaje-error">
          Tu rol no puede asignar roles.
        </p>
      </main>
    );
  }

  const requiereSelectorNodo = miRol.rol === "admin_nacional";
  let nodos: { id: string; municipio: string; departamento: string }[] = [];
  if (requiereSelectorNodo) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("nodos")
      .select("id, municipio, departamento")
      .eq("activo", true)
      .order("municipio");
    nodos = data ?? [];
  }

  return (
    <div className="pagina">
      <h1>Asignar rol</h1>
      <p>
        {miRol.rol === "admin_nacional"
          ? "Asigná líder, suplente, operador o administrador nacional en cualquier ciudad."
          : "Asigná suplente u operador de centro de acopio en tu ciudad."}
      </p>
      <AsignarRolForm
        rolesDisponibles={rolesDisponibles}
        requiereSelectorNodo={requiereSelectorNodo}
        nodos={nodos}
      />
    </div>
  );
}
