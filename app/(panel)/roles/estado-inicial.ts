export type EstadoAsignarRol = {
  ok: boolean;
  error?: string;
  passwordTemporal?: string;
  emailCreado?: string;
};

/**
 * Separado de actions.ts a propósito: un archivo "use server" solo
 * puede exportar funciones async, ver reportar/estado-inicial.ts.
 */
export const estadoInicialAsignarRol: EstadoAsignarRol = { ok: false };
