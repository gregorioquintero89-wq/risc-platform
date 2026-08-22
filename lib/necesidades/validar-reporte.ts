/**
 * Raw (string) form values for reporting a need — regla de oro (BR-01):
 * responsable, cantidad, ubicación (nodo), fecha límite. titulo and
 * categoria are also required by the schema (NOT NULL) even though
 * BR-01's prose only names the four business fields explicitly.
 * albergue is optional (matches necesidades.albergue being nullable).
 */
export type ReporteNecesidadInput = {
  titulo: string;
  categoria: string;
  responsable: string;
  cantidadNecesaria: string;
  fechaLimite: string;
  nodoId: string;
  albergue?: string;
};

export type ErroresReporteNecesidad = Partial<
  Record<keyof ReporteNecesidadInput, string>
>;

export function validarReporteNecesidad(
  input: ReporteNecesidadInput,
): ErroresReporteNecesidad {
  const errores: ErroresReporteNecesidad = {};

  if (!input.titulo?.trim()) {
    errores.titulo = "El título es obligatorio.";
  }
  if (!input.categoria?.trim()) {
    errores.categoria = "La categoría es obligatoria.";
  }
  if (!input.responsable?.trim()) {
    errores.responsable = "El responsable es obligatorio.";
  }
  if (!input.nodoId?.trim()) {
    errores.nodoId = "La ciudad es obligatoria.";
  }
  if (!input.fechaLimite?.trim()) {
    errores.fechaLimite = "La fecha límite es obligatoria.";
  }

  const cantidad = Number(input.cantidadNecesaria);
  if (
    !input.cantidadNecesaria?.trim() ||
    !Number.isFinite(cantidad) ||
    cantidad <= 0
  ) {
    errores.cantidadNecesaria =
      "La cantidad necesaria debe ser un número mayor a 0.";
  }

  return errores;
}

export function esReporteValido(errores: ErroresReporteNecesidad): boolean {
  return Object.keys(errores).length === 0;
}
