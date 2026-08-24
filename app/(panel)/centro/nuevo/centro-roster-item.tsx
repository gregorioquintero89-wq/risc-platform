"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { actualizarCentro, toggleActivoCentro } from "./editar-actions";
import type { EstadoEditarCentro } from "./editar-actions";

const estadoInicial: EstadoEditarCentro = { ok: false };

type Centro = {
  id: string;
  nombre: string;
  ubicacion: string;
  horario: string;
  activo: boolean;
};

export function CentroRosterItem({ centro }: { centro: Centro }) {
  const router = useRouter();
  const [estadoEditar, accionEditar, editando] = useActionState(
    actualizarCentro,
    estadoInicial,
  );
  const [estadoToggle, accionToggle, cambiandoEstado] = useActionState(
    toggleActivoCentro,
    estadoInicial,
  );

  useEffect(() => {
    if (estadoEditar.ok || estadoToggle.ok) router.refresh();
  }, [estadoEditar.ok, estadoToggle.ok, router]);

  return (
    <li className="tarjeta">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <strong>{centro.nombre}</strong>
        <span className={`chip ${centro.activo ? "chip--resuelto" : "chip--urgente"}`}>
          {centro.activo ? "Activo" : "Desactivado"}
        </span>
      </div>

      <form action={accionEditar} style={{ marginTop: 10 }}>
        <input type="hidden" name="id" value={centro.id} />
        <label htmlFor={`nombre-${centro.id}`}>Nombre</label>
        <input id={`nombre-${centro.id}`} name="nombre" defaultValue={centro.nombre} required />
        <label htmlFor={`ubicacion-${centro.id}`}>Ubicación</label>
        <input id={`ubicacion-${centro.id}`} name="ubicacion" defaultValue={centro.ubicacion} required />
        <label htmlFor={`horario-${centro.id}`}>Horario</label>
        <input id={`horario-${centro.id}`} name="horario" defaultValue={centro.horario} required />
        <label htmlFor={`responsable-${centro.id}`}>Cambiar responsable (opcional)</label>
        <input id={`responsable-${centro.id}`} name="responsableEmail" type="email" placeholder="correo nuevo responsable" />
        {estadoEditar.error && (
          <p role="alert" className="mensaje-error">
            {estadoEditar.error}
          </p>
        )}
        <button type="submit" disabled={editando}>
          {editando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      <form action={accionToggle} style={{ marginTop: 10 }}>
        <input type="hidden" name="id" value={centro.id} />
        <input type="hidden" name="activo" value={String(centro.activo)} />
        <button type="submit" className="secundario" disabled={cambiandoEstado}>
          {cambiandoEstado ? "..." : centro.activo ? "Desactivar" : "Activar"}
        </button>
        {estadoToggle.error && (
          <p role="alert" className="mensaje-error">
            {estadoToggle.error}
          </p>
        )}
      </form>
    </li>
  );
}
