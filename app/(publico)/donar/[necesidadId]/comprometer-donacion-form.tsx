"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  comprometerDonacion,
  estadoInicialCompromisoDonacion,
} from "./actions";

type Centro = {
  id: string;
  nombre: string;
  ubicacion: string;
  horario: string;
};

export function ComprometerDonacionForm({
  necesidadId,
  centros,
}: {
  necesidadId: string;
  centros: Centro[];
}) {
  const comprometerParaEstaNecesidad = comprometerDonacion.bind(
    null,
    necesidadId,
  );
  const [estado, accion, pendiente] = useActionState(
    comprometerParaEstaNecesidad,
    estadoInicialCompromisoDonacion,
  );

  if (estado.resultado) {
    const { codigo, centroNombre } = estado.resultado;
    return (
      <section aria-live="polite">
        <h2>Tu donación quedó registrada</h2>
        <p>
          Código: <strong>{codigo}</strong>
        </p>
        <p>
          Entregala en <strong>{centroNombre ?? "el centro elegido"}</strong>.
          Presentá este código en el centro para que puedan confirmar la
          entrega.
        </p>
        <p>
          <Link href={`/donaciones/${codigo}`}>Consultar el estado de mi donación</Link>
        </p>
        <p>
          <Link href="/">Volver a las necesidades</Link>
        </p>
      </section>
    );
  }

  if (centros.length === 0) {
    return (
      <p role="alert">
        Todavía no hay centros de acopio disponibles en esta ciudad. Volvé a
        intentar más tarde.
      </p>
    );
  }

  return (
    <form action={accion}>
      <label htmlFor="cantidad">Cantidad que vas a donar</label>
      <input
        id="cantidad"
        name="cantidad"
        type="number"
        min="1"
        defaultValue={estado.valores.cantidad}
        required
      />
      {estado.errores.cantidad && <p role="alert">{estado.errores.cantidad}</p>}

      <label htmlFor="contactoNombre">Tu nombre</label>
      <input
        id="contactoNombre"
        name="contactoNombre"
        defaultValue={estado.valores.contactoNombre}
        required
      />
      {estado.errores.contactoNombre && (
        <p role="alert">{estado.errores.contactoNombre}</p>
      )}

      <label htmlFor="contactoTelefono">Tu teléfono</label>
      <input
        id="contactoTelefono"
        name="contactoTelefono"
        type="tel"
        defaultValue={estado.valores.contactoTelefono}
        required
      />
      {estado.errores.contactoTelefono && (
        <p role="alert">{estado.errores.contactoTelefono}</p>
      )}

      <label htmlFor="centroId">Centro de acopio de entrega</label>
      <select
        id="centroId"
        name="centroId"
        defaultValue={estado.valores.centroId}
        required
      >
        <option value="">Elegí un centro de acopio</option>
        {centros.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre} — {c.ubicacion}
          </option>
        ))}
      </select>
      {estado.errores.centroId && <p role="alert">{estado.errores.centroId}</p>}

      {estado.errorEnvio && <p role="alert">{estado.errorEnvio}</p>}

      <button type="submit" disabled={pendiente}>
        {pendiente ? "Enviando..." : "Comprometer donación"}
      </button>
    </form>
  );
}
