import type {
  CompromisoDonacionInput,
  ErroresCompromisoDonacion,
} from "@/lib/donaciones/validar-compromiso";

export type EstadoCompromisoDonacion = {
  errores: ErroresCompromisoDonacion;
  valores: CompromisoDonacionInput;
  errorEnvio?: string;
  resultado?: { codigo: string; centroNombre: string | null };
};

/**
 * Separado de actions.ts a propósito: un archivo "use server" solo
 * puede exportar funciones async — una const exportada ahí queda
 * reemplazada en el build de producción, rompiendo el render inicial
 * del formulario (mismo bug que reportar/, encontrado en producción,
 * 22 ago 2026).
 */
export const estadoInicialCompromisoDonacion: EstadoCompromisoDonacion = {
  errores: {},
  valores: {
    cantidad: "",
    contactoNombre: "",
    contactoTelefono: "",
    centroId: "",
  },
};
