import { createClient } from "@/lib/supabase/server";
import { getMiRol } from "@/lib/roles/get-mi-rol";
import { puedeGestionarNecesidades } from "@/lib/roles/resolve-mi-rol";
import { compararPublicadas } from "@/lib/necesidades/transiciones";
import { calcularProgresoDonacion } from "@/lib/necesidades/calcular-progreso";
import { descartarNecesidad, publicarNecesidad } from "./actions";
import styles from "./necesidades.module.css";

/**
 * Chip de vencimiento puramente presentacional (no altera datos ni
 * reglas de negocio): rojo a 2 días o menos, ámbar a 7 días o menos,
 * sin chip más allá de eso.
 */
function diasParaVencer(fechaLimite: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limite = new Date(`${fechaLimite}T00:00:00`);
  return Math.ceil((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

function chipVencimiento(fechaLimite: string): { texto: string; variante: "urgente" | "medio" } | null {
  const dias = diasParaVencer(fechaLimite);
  if (dias <= 2) {
    const texto = dias < 0 ? "Vencida" : dias === 0 ? "Vence hoy" : `Vence en ${dias}d`;
    return { texto, variante: "urgente" };
  }
  if (dias <= 7) {
    return { texto: `Vence en ${dias}d`, variante: "medio" };
  }
  return null;
}

export default async function NecesidadesPage() {
  const miRol = await getMiRol();

  if (!miRol || !puedeGestionarNecesidades(miRol.rol) || !miRol.nodoId) {
    return (
      <main className="pagina">
        <p role="alert" className="mensaje-error">
          Tu rol no tiene acceso a la gestión de necesidades.
        </p>
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
    <div className="pagina">
      <h1>Necesidades reportadas</h1>

      <section className={styles.seccion}>
        <h2 className={styles.tituloSeccion}>Por verificar</h2>
        {(reportadas ?? []).length === 0 ? (
          <p className="mensaje-vacio">No hay necesidades pendientes de verificar.</p>
        ) : (
          <ul className={styles.lista}>
            {(reportadas ?? []).map((n) => (
              <li key={n.id} className="tarjeta">
                <h3 className={styles.itemTitulo}>{n.titulo}</h3>
                <p className={styles.itemMeta}>
                  {n.categoria} — necesita {n.cantidad_necesaria}
                </p>
                <p className={styles.itemMeta}>
                  Responsable: {n.responsable} — fecha límite: {n.fecha_limite}
                </p>
                <form action={publicarNecesidad} className={styles.accionPublicar}>
                  <input type="hidden" name="id" value={n.id} />
                  <button type="submit">Publicar</button>
                </form>
                <form action={descartarNecesidad} className={styles.formDescarte}>
                  <input type="hidden" name="id" value={n.id} />
                  <label htmlFor={`motivo-${n.id}`}>Motivo del descarte</label>
                  <input id={`motivo-${n.id}`} name="motivo" required />
                  <button type="submit" className="secundario">
                    Descartar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.seccion}>
        <h2 className={styles.tituloSeccion}>Publicadas</h2>
        {publicadasOrdenadas.length === 0 ? (
          <p className="mensaje-vacio">No hay necesidades publicadas en tu nodo.</p>
        ) : (
          <ul className={styles.lista}>
            {publicadasOrdenadas.map((n) => {
              const progreso = calcularProgresoDonacion(n.cantidad_necesaria, n.cantidad_recibida);
              const vencimiento = chipVencimiento(n.fecha_limite);
              return (
                <li key={n.id} className="tarjeta">
                  <div className={styles.itemEncabezado}>
                    <h3 className={styles.itemTitulo}>{n.titulo}</h3>
                    {vencimiento && (
                      <span className={`chip chip--${vencimiento.variante}`}>{vencimiento.texto}</span>
                    )}
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={progreso}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${progreso}% recibido`}
                    className={styles.barraFondo}
                  >
                    <div className={styles.barraRelleno} style={{ width: `${progreso}%` }} />
                  </div>
                  <p className={styles.itemMeta}>
                    Faltante: {n.faltante} — fecha límite: {n.fecha_limite}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
