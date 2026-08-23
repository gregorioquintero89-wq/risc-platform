import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeOperarCentro } from "@/lib/roles/resolve-mi-rol";
import { normalizarCodigo, puedeConfirmarRecepcion } from "@/lib/donaciones/recepcion";
import { ConfirmarRecepcionForm } from "./confirmar-recepcion-form";
import styles from "./centro.module.css";

export default async function CentroPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>;
}) {
  const miRol = await getMiRol();

  if (!miRol || !puedeOperarCentro(miRol.rol)) {
    return (
      <main className="pagina">
        <p role="alert" className="mensaje-error">
          Tu rol no tiene acceso al centro de acopio.
        </p>
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
    <div className="pagina">
      <h1>Centro de acopio</h1>
      <form method="GET" className={styles.busqueda}>
        <div className={styles.campoBusqueda}>
          <label htmlFor="codigo">Código de la donación</label>
          <input id="codigo" name="codigo" defaultValue={codigoParam ?? ""} required />
        </div>
        <button type="submit">Buscar</button>
      </form>

      {codigo && !donacion && (
        <p role="alert" className="mensaje-error">
          No se encontró ninguna donación con ese código.
        </p>
      )}

      {donacion && (
        <section className={`tarjeta ${styles.resultado}`}>
          <div className={styles.encabezado}>
            <p className={styles.codigo}>{donacion.codigo}</p>
            <span className={`chip ${donacion.estado === "comprometida" ? "chip--medio" : "chip--resuelto"}`}>
              {donacion.estado === "comprometida" ? "Comprometida" : "Recibida"}
            </span>
          </div>
          <dl className={styles.detalle}>
            <div>
              <dt>Centro</dt>
              <dd>{donacion.centro_nombre}</dd>
            </div>
            <div>
              <dt>Cantidad</dt>
              <dd>{donacion.cantidad}</dd>
            </div>
          </dl>
          {puedeConfirmarRecepcion(donacion.estado) ? (
            <ConfirmarRecepcionForm codigo={donacion.codigo} />
          ) : (
            <p className={styles.yaRecibida}>Esta donación ya fue recibida.</p>
          )}
        </section>
      )}
    </div>
  );
}
