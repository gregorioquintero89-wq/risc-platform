"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  publicarNecesidad,
  descartarNecesidad,
  type EstadoAccionNecesidad,
} from "./actions";
import styles from "./necesidades.module.css";

const estadoInicial: EstadoAccionNecesidad = { ok: false };

export function PublicarDescartarForm({ id }: { id: string }) {
  const router = useRouter();
  const [estadoPublicar, accionPublicar, publicando] = useActionState(
    publicarNecesidad,
    estadoInicial,
  );
  const [estadoDescartar, accionDescartar, descartando] = useActionState(
    descartarNecesidad,
    estadoInicial,
  );

  useEffect(() => {
    if (estadoPublicar.ok || estadoDescartar.ok) router.refresh();
  }, [estadoPublicar.ok, estadoDescartar.ok, router]);

  return (
    <>
      <form action={accionPublicar} className={styles.accionPublicar}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" disabled={publicando}>
          {publicando ? "Publicando..." : "Publicar"}
        </button>
        {estadoPublicar.error && <p role="alert">{estadoPublicar.error}</p>}
      </form>
      <form action={accionDescartar} className={styles.formDescarte}>
        <input type="hidden" name="id" value={id} />
        <label htmlFor={`motivo-${id}`}>Motivo del descarte</label>
        <input id={`motivo-${id}`} name="motivo" required />
        <button type="submit" className="secundario" disabled={descartando}>
          {descartando ? "Descartando..." : "Descartar"}
        </button>
        {estadoDescartar.error && <p role="alert">{estadoDescartar.error}</p>}
      </form>
    </>
  );
}
