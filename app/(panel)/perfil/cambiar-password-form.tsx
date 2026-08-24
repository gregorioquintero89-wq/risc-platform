"use client";

import { useActionState } from "react";
import { cambiarPassword } from "./actions";
import { estadoInicialCambiarPassword } from "./estado-inicial";

export function CambiarPasswordForm() {
  const [estado, accion, pendiente] = useActionState(
    cambiarPassword,
    estadoInicialCambiarPassword,
  );

  if (estado.ok) {
    return (
      <p className="mensaje-vacio" role="status">
        Contraseña actualizada.
      </p>
    );
  }

  return (
    <form action={accion} className="tarjeta">
      <label htmlFor="nueva">Nueva contraseña</label>
      <input id="nueva" name="nueva" type="password" minLength={8} required />

      <label htmlFor="confirmar">Confirmá la contraseña</label>
      <input id="confirmar" name="confirmar" type="password" minLength={8} required />

      {estado.error && (
        <p role="alert" className="mensaje-error">
          {estado.error}
        </p>
      )}

      <button type="submit" disabled={pendiente} className="boton--bloque">
        {pendiente ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
