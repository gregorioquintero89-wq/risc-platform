"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { eliminarRol, type EstadoEliminarRol } from "./eliminar-rol-actions";

const estadoInicial: EstadoEliminarRol = { ok: false };

export function EliminarRolBoton({ id }: { id: string }) {
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(eliminarRol, estadoInicial);

  useEffect(() => {
    if (estado.ok) router.refresh();
  }, [estado.ok, router]);

  return (
    <form action={accion}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="secundario" disabled={pendiente}>
        {pendiente ? "Quitando..." : "Quitar rol"}
      </button>
      {estado.error && (
        <p role="alert" className="mensaje-error">
          {estado.error}
        </p>
      )}
    </form>
  );
}
