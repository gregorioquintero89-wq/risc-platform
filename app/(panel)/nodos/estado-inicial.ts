export type EstadoCrearNodo = { ok: boolean; error?: string };

/**
 * Separado de actions.ts a propósito: un archivo "use server" solo
 * puede exportar funciones async, ver reportar/estado-inicial.ts.
 */
export const estadoInicialCrearNodo: EstadoCrearNodo = { ok: false };
