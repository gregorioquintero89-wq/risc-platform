"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { confirmarRecepcion, type EstadoConfirmarRecepcion } from "./actions";
import styles from "./centro.module.css";

const estadoInicial: EstadoConfirmarRecepcion = { ok: false };

export function ConfirmarRecepcionForm({ codigo }: { codigo: string }) {
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(confirmarRecepcion, estadoInicial);

  useEffect(() => {
    if (estado.ok) router.refresh();
  }, [estado.ok, router]);

  return (
    <form action={accion} className={styles.formConfirmar}>
      <input type="hidden" name="codigo" value={codigo} />
      <button type="submit" disabled={pendiente}>
        {pendiente ? "Confirmando..." : "Confirmar recepción"}
      </button>
      {estado.error && (
        <p role="alert" className="mensaje-error">
          {estado.error}
        </p>
      )}
    </form>
  );
}
