import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeOperarCentro } from "@/lib/roles/resolve-mi-rol";
import { normalizarCodigo, puedeConfirmarRecepcion } from "@/lib/donaciones/recepcion";
import { confirmarRecepcion } from "./actions";

export default async function CentroPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>;
}) {
  const miRol = await getMiRol();

  if (!miRol || !puedeOperarCentro(miRol.rol)) {
    return (
      <main>
        <p role="alert">Tu rol no tiene acceso al centro de acopio.</p>
      </main>
    );
  }

  const { codigo: codigoParam } = await searchParams;
  const codigo = codigoParam ? normalizarCodigo(codigoParam) : null;

  let donacion: {
    codigo: string;
    cantidad: number;
    estado: "comprometida" | "recibida";
    centro_nombre: string;
  } | null = null;

  if (codigo) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("buscar_donacion_por_codigo", { p_codigo: codigo });
    donacion = data?.[0] ?? null;
  }

  return (
    <main>
      <h1>Centro de acopio</h1>
      <form method="GET">
        <label htmlFor="codigo">Código de la donación</label>
        <input id="codigo" name="codigo" defaultValue={codigoParam ?? ""} required />
        <button type="submit">Buscar</button>
      </form>

      {codigo && !donacion && (
        <p role="alert">No se encontró ninguna donación con ese código.</p>
      )}

      {donacion && (
        <section>
          <p>Código: {donacion.codigo}</p>
          <p>Centro: {donacion.centro_nombre}</p>
          <p>Cantidad: {donacion.cantidad}</p>
          <p>Estado: {donacion.estado}</p>
          {puedeConfirmarRecepcion(donacion.estado) ? (
            <form action={confirmarRecepcion}>
              <input type="hidden" name="codigo" value={donacion.codigo} />
              <button type="submit">Confirmar recepción</button>
            </form>
          ) : (
            <p>Esta donación ya fue recibida.</p>
          )}
        </section>
      )}
    </main>
  );
}
