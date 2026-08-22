import { createClient } from "@/lib/supabase/server";
import { formatearEstadoDonacion } from "@/lib/donaciones/formatear-estado";
import { BuscarOtroCodigo } from "./buscar-otro-codigo";

/**
 * Consultar estado de una donación por código (FR-E2-06, US-E2-05).
 *
 * Va por la función RPC buscar_donacion_por_codigo(), nunca por la
 * tabla `donaciones` directo: esa tabla no tiene ninguna policy de
 * SELECT para anon (a propósito — protege datos de otros donantes,
 * ver comentario en donaciones_select_nodo, RLS migration). La función
 * es security definer y devuelve solo las cuatro columnas públicas
 * (codigo, cantidad, estado, centro_nombre), nunca contacto_nombre ni
 * contacto_telefono.
 */
export default async function ConsultarDonacionPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("buscar_donacion_por_codigo", {
    p_codigo: codigo.trim(),
  });

  const donacion = data?.[0];

  return (
    <main>
      <h1>Estado de tu donación</h1>

      {error || !donacion ? (
        <p role="alert">
          No encontramos una donación con el código {codigo.toUpperCase()}.
          Revisá que esté bien escrito.
        </p>
      ) : (
        <dl>
          <dt>Código</dt>
          <dd>{donacion.codigo}</dd>
          <dt>Cantidad</dt>
          <dd>{donacion.cantidad}</dd>
          <dt>Estado</dt>
          <dd>{formatearEstadoDonacion(donacion.estado)}</dd>
          <dt>Centro de acopio</dt>
          <dd>{donacion.centro_nombre}</dd>
        </dl>
      )}

      <BuscarOtroCodigo />
    </main>
  );
}
