"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { crearNodo } from "./actions";
import { estadoInicialCrearNodo } from "./estado-inicial";

export function CrearNodoForm() {
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(crearNodo, estadoInicialCrearNodo);

  useEffect(() => {
    if (estado.ok) router.refresh();
  }, [estado.ok, router]);

  return (
    <form action={accion} className="tarjeta">
      <label htmlFor="municipio">Municipio</label>
      <input id="municipio" name="municipio" required />

      <label htmlFor="departamento">Departamento</label>
      <input id="departamento" name="departamento" required />

      {estado.error && (
        <p role="alert" className="mensaje-error">
          {estado.error}
        </p>
      )}

      <button type="submit" disabled={pendiente} className="boton--bloque">
        {pendiente ? "Creando..." : "Crear ciudad"}
      </button>
    </form>
  );
}
