import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { actorPuedeAsignar, rolesAsignablesPor } from "@/lib/roles/resolve-mi-rol";
import type { Enums } from "@/lib/supabase/database.types";
import { AsignarRolForm } from "./asignar-rol-form";
import { EliminarRolBoton } from "./eliminar-rol-boton";

type FilaRoster = {
  id: string;
  user_id: string;
  email: string;
  nombre: string;
  rol: Enums<"rol_risc">;
  nodo_id: string | null;
  nodo_nombre: string | null;
};

const ETIQUETA_ROL: Record<string, string> = {
  lider: "Líder",
  suplente: "Suplente",
  operador: "Operador",
  admin_nacional: "Admin nacional",
};

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

  const supabase = await createClient();
  const { data } = await supabase.rpc("listar_roles_visibles");
  const roster: FilaRoster[] = data ?? [];

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

      <h2 style={{ marginTop: 32 }}>Roles asignados</h2>
      {roster.length === 0 ? (
        <p className="mensaje-vacio">No hay roles para mostrar.</p>
      ) : (
        <ul className="lista-necesidades">
          {roster.map((r) => (
            <li key={r.id} className="tarjeta">
              <strong>{r.nombre || r.email}</strong>
              <p className="mensaje-vacio" style={{ margin: "2px 0 10px" }}>
                {r.email} — {ETIQUETA_ROL[r.rol] ?? r.rol}
                {r.nodo_nombre ? ` — ${r.nodo_nombre}` : ""}
              </p>
              {actorPuedeAsignar(miRol, r.rol, r.nodo_id) && (
                <EliminarRolBoton id={r.id} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
