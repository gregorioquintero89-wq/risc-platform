/**
 * Raw (string) form values for committing a donation (FR-E2-02).
 *
 * Deliberately does NOT take the need's faltante as input and never
 * checks cantidad against it — comprometer una donación no reserva ni
 * limita el faltante (decisión cerrada 20 ago 2026, OpenSpec sección
 * 6). Introducing that check here would silently reintroduce the
 * reservation mechanism the business explicitly rejected.
 */
export type CompromisoDonacionInput = {
  cantidad: string;
  contactoNombre: string;
  contactoTelefono: string;
  centroId: string;
};

export type ErroresCompromisoDonacion = Partial<
  Record<keyof CompromisoDonacionInput, string>
>;

export function validarCompromisoDonacion(
  input: CompromisoDonacionInput,
): ErroresCompromisoDonacion {
  const errores: ErroresCompromisoDonacion = {};

  const cantidad = Number(input.cantidad);
  if (!input.cantidad?.trim() || !Number.isFinite(cantidad) || cantidad <= 0) {
    errores.cantidad = "La cantidad debe ser un número mayor a 0.";
  }
  if (!input.contactoNombre?.trim()) {
    errores.contactoNombre = "Tu nombre es obligatorio.";
  }
  if (!input.contactoTelefono?.trim()) {
    errores.contactoTelefono = "Tu teléfono es obligatorio.";
  }
  if (!input.centroId?.trim()) {
    errores.centroId = "Elegí un centro de acopio para la entrega.";
  }

  return errores;
}

export function esCompromisoValido(errores: ErroresCompromisoDonacion): boolean {
  return Object.keys(errores).length === 0;
}
