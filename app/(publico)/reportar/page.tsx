import { createClient } from "@/lib/supabase/server";
import { ReportarNecesidadForm } from "./reportar-necesidad-form";

/**
 * Reportar necesidad (regla de oro — BR-01, US-E1-01). Público, sin
 * cuenta: cualquiera puede reportar, siempre entra en estado
 * `reportada` y no es visible hasta que un líder la verifique
 * (FR-E1-02, FR-E1-03) — eso pasa en el panel autenticado, no acá.
 */
export default async function ReportarNecesidadPage() {
  const supabase = await createClient();
  const { data: nodos } = await supabase
    .from("nodos")
    .select("id, municipio, departamento")
    .eq("activo", true)
    .order("municipio");

  return (
    <div className="pagina">
      <h1>Reportar una necesidad</h1>
      <p>
        Completá responsable, cantidad, ciudad y fecha límite — son los
        cuatro datos mínimos para que la necesidad quede registrada. Un
        líder de la ciudad la revisa antes de publicarla.
      </p>
      <div className="tarjeta">
        <ReportarNecesidadForm nodos={nodos ?? []} />
      </div>
    </div>
  );
}
