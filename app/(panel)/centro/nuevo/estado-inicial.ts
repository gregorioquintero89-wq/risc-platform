export type EstadoCrearCentro = { ok: boolean; error?: string };

/**
 * Separado de actions.ts a propósito: un archivo "use server" solo
 * puede exportar funciones async, ver reportar/estado-inicial.ts.
 */
export const estadoInicialCrearCentro: EstadoCrearCentro = { ok: false };
