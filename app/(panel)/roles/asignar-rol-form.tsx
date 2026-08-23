"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { asignarRol } from "./actions";
import { estadoInicialAsignarRol } from "./estado-inicial";
import type { Enums } from "@/lib/supabase/database.types";

type RolRisc = Enums<"rol_risc">;

const ETIQUETA: Record<RolRisc, string> = {
  lider: "Líder",
  suplente: "Suplente",
  operador: "Operador de centro de acopio",
  admin_nacional: "Administrador nacional",
};

type Nodo = { id: string; municipio: string; departamento: string };

export function AsignarRolForm({
  rolesDisponibles,
  requiereSelectorNodo,
  nodos,
}: {
  rolesDisponibles: RolRisc[];
  requiereSelectorNodo: boolean;
  nodos: Nodo[];
}) {
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(asignarRol, estadoInicialAsignarRol);

  useEffect(() => {
    if (estado.ok && !estado.passwordTemporal) router.refresh();
  }, [estado.ok, estado.passwordTemporal, router]);

  if (estado.ok && estado.passwordTemporal) {
    return (
      <section className="tarjeta" role="status">
        <h2>Cuenta creada y rol asignado</h2>
        <p>
          <strong>{estado.emailCreado}</strong> no tenía cuenta — se creó una con esta
          contraseña temporal. Compartísela por un canal seguro; no se vuelve a mostrar.
        </p>
        <p className="codigo-destacado">{estado.passwordTemporal}</p>
        <button type="button" onClick={() => router.refresh()}>
          Listo
        </button>
      </section>
    );
  }

  if (estado.ok) {
    return (
      <p className="mensaje-vacio" role="status">
        Rol asignado.
      </p>
    );
  }

  return (
    <form action={accion} className="tarjeta">
      <label htmlFor="email">Correo de la persona</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="rol">Rol</label>
      <select id="rol" name="rol" required>
        <option value="">Elegí un rol</option>
        {rolesDisponibles.map((r) => (
          <option key={r} value={r}>
            {ETIQUETA[r]}
          </option>
        ))}
      </select>

      {requiereSelectorNodo && (
        <>
          <label htmlFor="nodoId">Ciudad (no aplica para administrador nacional)</label>
          <select id="nodoId" name="nodoId">
            <option value="">Elegí una ciudad</option>
            {nodos.map((n) => (
              <option key={n.id} value={n.id}>
                {n.municipio} — {n.departamento}
              </option>
            ))}
          </select>
        </>
      )}

      {estado.error && (
        <p role="alert" className="mensaje-error">
          {estado.error}
        </p>
      )}

      <button type="submit" disabled={pendiente} className="boton--bloque">
        {pendiente ? "Asignando..." : "Asignar rol"}
      </button>
    </form>
  );
}
