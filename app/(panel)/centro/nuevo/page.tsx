import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarCentros } from "@/lib/roles/resolve-mi-rol";
import { CrearCentroForm } from "./crear-centro-form";

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

  return (
    <div className="pagina">
      <h1>Nuevo centro de acopio</h1>
      <CrearCentroForm nodos={nodos} requiereSelectorNodo={requiereSelectorNodo} />
    </div>
  );
}
