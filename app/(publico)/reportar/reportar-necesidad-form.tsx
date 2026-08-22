"use client";

import { useActionState } from "react";
import { reportarNecesidad } from "./actions";
import { estadoInicialReporteNecesidad } from "./estado-inicial";

type Nodo = { id: string; municipio: string; departamento: string };

export function ReportarNecesidadForm({ nodos }: { nodos: Nodo[] }) {
  const [estado, accion, pendiente] = useActionState(
    reportarNecesidad,
    estadoInicialReporteNecesidad,
  );

  return (
    <form action={accion}>
      <label htmlFor="titulo">Título</label>
      <input
        id="titulo"
        name="titulo"
        defaultValue={estado.valores.titulo}
        required
      />
      {estado.errores.titulo && <p role="alert">{estado.errores.titulo}</p>}

      <label htmlFor="categoria">Categoría</label>
      <input
        id="categoria"
        name="categoria"
        defaultValue={estado.valores.categoria}
        required
      />
      {estado.errores.categoria && (
        <p role="alert">{estado.errores.categoria}</p>
      )}

      <label htmlFor="responsable">Responsable</label>
      <input
        id="responsable"
        name="responsable"
        defaultValue={estado.valores.responsable}
        required
      />
      {estado.errores.responsable && (
        <p role="alert">{estado.errores.responsable}</p>
      )}

      <label htmlFor="cantidadNecesaria">Cantidad necesaria</label>
      <input
        id="cantidadNecesaria"
        name="cantidadNecesaria"
        type="number"
        min="1"
        defaultValue={estado.valores.cantidadNecesaria}
        required
      />
      {estado.errores.cantidadNecesaria && (
        <p role="alert">{estado.errores.cantidadNecesaria}</p>
      )}

      <label htmlFor="fechaLimite">Fecha límite</label>
      <input
        id="fechaLimite"
        name="fechaLimite"
        type="date"
        defaultValue={estado.valores.fechaLimite}
        required
      />
      {estado.errores.fechaLimite && (
        <p role="alert">{estado.errores.fechaLimite}</p>
      )}

      <label htmlFor="nodoId">Ciudad</label>
      <select
        id="nodoId"
        name="nodoId"
        defaultValue={estado.valores.nodoId}
        required
      >
        <option value="">Elegí una ciudad</option>
        {nodos.map((n) => (
          <option key={n.id} value={n.id}>
            {n.municipio}
          </option>
        ))}
      </select>
      {estado.errores.nodoId && <p role="alert">{estado.errores.nodoId}</p>}

      <label htmlFor="albergue">Albergue (opcional)</label>
      <input
        id="albergue"
        name="albergue"
        defaultValue={estado.valores.albergue}
      />

      {estado.errorEnvio && (
        <p role="alert" className="mensaje-error">
          {estado.errorEnvio}
        </p>
      )}

      <button type="submit" disabled={pendiente} className="boton--bloque">
        {pendiente ? "Enviando..." : "Reportar necesidad"}
      </button>
    </form>
  );
}
