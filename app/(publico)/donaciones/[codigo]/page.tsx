import type { Enums } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { formatearEstadoDonacion } from "@/lib/donaciones/formatear-estado";
import { BuscarOtroCodigo } from "./buscar-otro-codigo";

/** Chip variant for a donation's estado — recibida is green, comprometida is amber. */
function chipEstadoDonacion(estado: Enums<"estado_donacion">) {
  return estado === "recibida" ? "chip--resuelto" : "chip--medio";
}

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
    <div className="pagina">
      <h1>Estado de tu donación</h1>

      {error || !donacion ? (
        <p role="alert" className="mensaje-error">
          No encontramos una donación con el código {codigo.toUpperCase()}.
          Revisá que esté bien escrito.
        </p>
      ) : (
        <div className="tarjeta">
          <span className={`chip ${chipEstadoDonacion(donacion.estado)}`}>
            {formatearEstadoDonacion(donacion.estado)}
          </span>
          <dl className="ficha">
            <dt>Código</dt>
            <dd className="codigo-destacado">{donacion.codigo}</dd>
            <dt>Cantidad</dt>
            <dd>{donacion.cantidad}</dd>
            <dt>Centro de acopio</dt>
            <dd>{donacion.centro_nombre}</dd>
          </dl>
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        <BuscarOtroCodigo />
      </div>
    </div>
  );
}
