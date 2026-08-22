import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ComprometerDonacionForm } from "./comprometer-donacion-form";

/**
 * Comprometer una donación (FR-E2-02/03, US-E2-02). Solo se puede
 * donar contra una necesidad `publicada` — si no existe o ya no está
 * publicada (resuelta, descartada, o el id es inválido), 404: el
 * portal público nunca linkea acá a otra cosa (FR-E1-02, US-E2-01).
 */
export default async function DonarPage({
  params,
}: {
  params: Promise<{ necesidadId: string }>;
}) {
  const { necesidadId } = await params;
  const supabase = await createClient();

  const { data: necesidad } = await supabase
    .from("necesidades")
    .select("id, titulo, faltante, nodo_id")
    .eq("id", necesidadId)
    .eq("estado", "publicada")
    .maybeSingle();

  if (!necesidad) {
    notFound();
  }

  const { data: centros } = await supabase
    .from("centros_acopio")
    .select("id, nombre, ubicacion, horario")
    .eq("nodo_id", necesidad.nodo_id)
    .order("nombre");

  return (
    <div className="pagina">
      <h1>Donar para: {necesidad.titulo}</h1>
      <p>Todavía faltan {necesidad.faltante} unidades.</p>
      <div className="tarjeta">
        <ComprometerDonacionForm
          necesidadId={necesidad.id}
          centros={centros ?? []}
        />
      </div>
    </div>
  );
}
