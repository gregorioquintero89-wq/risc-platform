"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { crearCentro } from "./actions";
import { estadoInicialCrearCentro } from "./estado-inicial";

type Nodo = { id: string; municipio: string; departamento: string };

export function CrearCentroForm({
  nodos,
  requiereSelectorNodo,
}: {
  nodos: Nodo[];
  requiereSelectorNodo: boolean;
}) {
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(crearCentro, estadoInicialCrearCentro);

  useEffect(() => {
    if (estado.ok) router.refresh();
  }, [estado.ok, router]);

  if (estado.ok) {
    return (
      <p className="mensaje-vacio" role="status">
        Centro creado. Ya está disponible para recibir donaciones.
      </p>
    );
  }

  return (
    <form action={accion} className="tarjeta">
      {requiereSelectorNodo && (
        <>
          <label htmlFor="nodoId">Ciudad</label>
          <select id="nodoId" name="nodoId" required>
            <option value="">Elegí una ciudad</option>
            {nodos.map((n) => (
              <option key={n.id} value={n.id}>
                {n.municipio} — {n.departamento}
              </option>
            ))}
          </select>
        </>
      )}

      <label htmlFor="nombre">Nombre del centro</label>
      <input id="nombre" name="nombre" required />

      <label htmlFor="ubicacion">Ubicación</label>
      <input id="ubicacion" name="ubicacion" required />

      <label htmlFor="horario">Horario</label>
      <input id="horario" name="horario" required />

      <label htmlFor="responsableEmail">Correo del responsable</label>
      <input id="responsableEmail" name="responsableEmail" type="email" required />
      <p className="mensaje-vacio">
        Esa persona ya debe tener un rol asignado en esta ciudad (líder, suplente u
        operador) — si no, asignáselo primero en Roles.
      </p>

      {estado.error && (
        <p role="alert" className="mensaje-error">
          {estado.error}
        </p>
      )}

      <button type="submit" disabled={pendiente} className="boton--bloque">
        {pendiente ? "Creando..." : "Crear centro"}
      </button>
    </form>
  );
}
