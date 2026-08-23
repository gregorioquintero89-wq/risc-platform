import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { calcularProgresoDonacion } from "@/lib/necesidades/calcular-progreso";
import { filtrarYOrdenarNecesidades } from "@/lib/necesidades/filtrar-necesidades";
import type { NecesidadListada, NodoResumen } from "@/lib/necesidades/types";
import {
  calcularDiasHastaVencimiento,
  calcularUrgenciaVencimiento,
  textoVencimiento,
} from "./vencimiento";

type SearchParams = Promise<{ nodo?: string; categoria?: string }>;

/**
 * Portal público — Home (FR-E2-01, FR-E1-06). Lista necesidades
 * `publicada` con faltante > 0, filtrable por nodo y categoría.
 *
 * The nodo join happens in application code (two flat selects + a
 * Map), not via a Postgrest embed — keeps both queries a plain column
 * list that types cleanly against the generated Database types instead
 * of relying on embed-string type inference.
 */
export default async function PortalPublicoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { nodo: nodoId, categoria } = await searchParams;
  const supabase = await createClient();

  const [{ data: necesidadesRaw, error: necesidadesError }, { data: nodos }] =
    await Promise.all([
      supabase
        .from("necesidades")
        .select(
          "id, titulo, categoria, albergue, cantidad_necesaria, cantidad_recibida, faltante, fecha_limite, nodo_id",
        )
        .eq("estado", "publicada"),
      supabase
        .from("nodos")
        .select("id, municipio, departamento")
        .eq("activo", true)
        .order("municipio"),
    ]);

  const nodosPorId = new Map<string, NodoResumen>(
    (nodos ?? []).map((n) => [n.id, n]),
  );

  const necesidades: NecesidadListada[] = (necesidadesRaw ?? []).map((n) => ({
    id: n.id,
    titulo: n.titulo,
    categoria: n.categoria,
    albergue: n.albergue,
    cantidad_necesaria: n.cantidad_necesaria,
    cantidad_recibida: n.cantidad_recibida,
    faltante: n.faltante,
    fecha_limite: n.fecha_limite,
    nodo: nodosPorId.get(n.nodo_id) ?? null,
  }));

  const listado = filtrarYOrdenarNecesidades(necesidades, { nodoId, categoria });

  const categorias = Array.from(
    new Set(necesidades.map((n) => n.categoria)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="pagina">
      <h1>RISC — Necesidades verificadas</h1>

      <div className="confianza">
        <svg
          className="confianza__icono"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <p>
          Cada necesidad de esta lista ya fue revisada por un líder de su
          ciudad antes de publicarse — RISC no publica nada sin verificar.
        </p>
      </div>

      <form method="get" className="filtro">
        <div>
          <label htmlFor="nodo">Ciudad</label>
          <select id="nodo" name="nodo" defaultValue={nodoId ?? ""}>
            <option value="">Todas las ciudades</option>
            {(nodos ?? []).map((n) => (
              <option key={n.id} value={n.id}>
                {n.municipio}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" name="categoria" defaultValue={categoria ?? ""}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Filtrar</button>
      </form>

      {necesidadesError ? (
        <p role="alert" className="mensaje-error">
          No pudimos cargar las necesidades. Intentá de nuevo más tarde.
        </p>
      ) : listado.length === 0 ? (
        <p className="mensaje-vacio">
          No hay necesidades publicadas para este filtro por ahora.
        </p>
      ) : (
        <ul className="lista-necesidades">
          {listado.map((n) => {
            const progreso = calcularProgresoDonacion(
              n.cantidad_necesaria,
              n.cantidad_recibida,
            );
            const dias = calcularDiasHastaVencimiento(n.fecha_limite);
            const urgencia = calcularUrgenciaVencimiento(dias);
            return (
              <li key={n.id}>
                <article className="tarjeta">
                  {urgencia && (
                    <div className="tarjeta-necesidad__cabecera">
                      <span className={`chip chip--${urgencia}`}>
                        {textoVencimiento(dias)}
                      </span>
                    </div>
                  )}
                  <h2>{n.titulo}</h2>
                  <p>{n.categoria}</p>
                  <p className="tarjeta-necesidad__ubicacion">
                    {n.nodo?.municipio ?? "Ciudad sin confirmar"}
                    {n.albergue ? ` — ${n.albergue}` : ""}
                  </p>
                  <div
                    className="progreso"
                    role="progressbar"
                    aria-valuenow={progreso}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${progreso}% recibido`}
                  >
                    <div
                      className="progreso__relleno"
                      style={{ width: `${progreso}%` }}
                    />
                  </div>
                  <p>
                    Faltan {n.faltante} de {n.cantidad_necesaria}
                  </p>
                  <p>Fecha límite: {n.fecha_limite}</p>
                  <Link href={`/donar/${n.id}`} className="boton">
                    Quiero donar
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
