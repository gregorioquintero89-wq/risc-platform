import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarNecesidades } from "@/lib/roles/resolve-mi-rol";
import { compararPublicadas } from "@/lib/necesidades/transiciones";
import { descartarNecesidad, publicarNecesidad } from "./actions";

export default async function NecesidadesPage() {
  const miRol = await getMiRol();

  if (!miRol || !puedeGestionarNecesidades(miRol.rol) || !miRol.nodoId) {
    return (
      <main>
        <p role="alert">Tu rol no tiene acceso a la gestión de necesidades.</p>
      </main>
    );
  }

  const supabase = await createClient();

  const { data: reportadas } = await supabase
    .from("necesidades")
    .select("*")
    .eq("nodo_id", miRol.nodoId)
    .eq("estado", "reportada")
    .order("created_at", { ascending: true });

  const { data: publicadas } = await supabase
    .from("necesidades")
    .select("*")
    .eq("nodo_id", miRol.nodoId)
    .eq("estado", "publicada");

  const publicadasOrdenadas = [...(publicadas ?? [])].sort(compararPublicadas);

  return (
    <main>
      <h1>Necesidades reportadas</h1>
      {(reportadas ?? []).length === 0 && <p>No hay necesidades pendientes de verificar.</p>}
      <ul>
        {(reportadas ?? []).map((n) => (
          <li key={n.id}>
            <p>
              {n.titulo} — {n.categoria} — necesita {n.cantidad_necesaria}
            </p>
            <p>
              Responsable: {n.responsable} — fecha límite: {n.fecha_limite}
            </p>
            <form action={publicarNecesidad}>
              <input type="hidden" name="id" value={n.id} />
              <button type="submit">Publicar</button>
            </form>
            <form action={descartarNecesidad}>
              <input type="hidden" name="id" value={n.id} />
              <label htmlFor={`motivo-${n.id}`}>Motivo del descarte</label>
              <input id={`motivo-${n.id}`} name="motivo" required />
              <button type="submit">Descartar</button>
            </form>
          </li>
        ))}
      </ul>

      <h2>Necesidades publicadas</h2>
      {publicadasOrdenadas.length === 0 && <p>No hay necesidades publicadas en tu nodo.</p>}
      <ul>
        {publicadasOrdenadas.map((n) => (
          <li key={n.id}>
            {n.titulo} — faltante: {n.faltante} — fecha límite: {n.fecha_limite}
          </li>
        ))}
      </ul>
    </main>
  );
}
