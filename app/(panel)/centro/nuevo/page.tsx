import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarCentros } from "@/lib/roles/resolve-mi-rol";
import { CrearCentroForm } from "./crear-centro-form";
import { CentroRosterItem } from "./centro-roster-item";

export default async function NuevoCentroPage() {
  const miRol = await getMiRol();

  if (!miRol || !puedeGestionarCentros(miRol.rol)) {
    return (
      <main className="pagina">
        <p role="alert" className="mensaje-error">
          Tu rol no puede crear centros de acopio.
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

  const supabase2 = await createClient();
  const { data: centros } = await supabase2
    .from("centros_acopio")
    .select("id, nombre, ubicacion, horario, activo")
    .order("nombre");

  return (
    <div className="pagina">
      <h1>Nuevo centro de acopio</h1>
      <CrearCentroForm nodos={nodos} requiereSelectorNodo={requiereSelectorNodo} />

      <h2 style={{ marginTop: 32 }}>Centros existentes</h2>
      {(centros ?? []).length === 0 ? (
        <p className="mensaje-vacio">Todavía no hay centros de acopio.</p>
      ) : (
        <ul className="lista-necesidades">
          {(centros ?? []).map((c) => (
            <CentroRosterItem key={c.id} centro={c} />
          ))}
        </ul>
      )}
    </div>
  );
}
