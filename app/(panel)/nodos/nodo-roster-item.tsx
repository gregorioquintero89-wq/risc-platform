"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toggleActivoNodo } from "./actions";
import { estadoInicialCrearNodo } from "./estado-inicial";

type Nodo = { id: string; municipio: string; departamento: string; activo: boolean };

export function NodoRosterItem({ nodo }: { nodo: Nodo }) {
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(toggleActivoNodo, estadoInicialCrearNodo);

  useEffect(() => {
    if (estado.ok) router.refresh();
  }, [estado.ok, router]);

  return (
    <li className="tarjeta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
      <span>
        {nodo.municipio} — {nodo.departamento}{" "}
        <span className={`chip ${nodo.activo ? "chip--resuelto" : "chip--urgente"}`}>
          {nodo.activo ? "Activa" : "Desactivada"}
        </span>
      </span>
      <form action={accion}>
        <input type="hidden" name="id" value={nodo.id} />
        <input type="hidden" name="activo" value={String(nodo.activo)} />
        <button type="submit" className="secundario" disabled={pendiente}>
          {pendiente ? "..." : nodo.activo ? "Desactivar" : "Activar"}
        </button>
      </form>
    </li>
  );
}
