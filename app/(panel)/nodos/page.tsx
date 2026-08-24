import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarNodos } from "@/lib/roles/resolve-mi-rol";
import { CrearNodoForm } from "./crear-nodo-form";
import { NodoRosterItem } from "./nodo-roster-item";

export default async function NodosPage() {
  const miRol = await getMiRol();

  if (!miRol || !puedeGestionarNodos(miRol.rol)) {
    return (
      <main className="pagina">
        <p role="alert" className="mensaje-error">
          Solo un administrador nacional puede crear ciudades.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: nodos } = await supabase
    .from("nodos")
    .select("id, municipio, departamento, activo")
    .order("municipio");

  return (
    <div className="pagina">
      <h1>Ciudades de RISC</h1>

      <CrearNodoForm />

      <h2 style={{ marginTop: 32 }}>Ciudades</h2>
      {(nodos ?? []).length === 0 ? (
        <p className="mensaje-vacio">Todavía no hay ciudades registradas.</p>
      ) : (
        <ul className="lista-necesidades">
          {(nodos ?? []).map((n) => (
            <NodoRosterItem key={n.id} nodo={n} />
          ))}
        </ul>
      )}
    </div>
  );
}
