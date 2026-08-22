import type {
  ErroresReporteNecesidad,
  ReporteNecesidadInput,
} from "@/lib/necesidades/validar-reporte";

export type EstadoReporteNecesidad = {
  errores: ErroresReporteNecesidad;
  valores: ReporteNecesidadInput;
  errorEnvio?: string;
};

/**
 * Separado de actions.ts a propósito: un archivo "use server" solo
 * puede exportar funciones async — una const exportada ahí queda
 * reemplazada en el build de producción, rompiendo el render inicial
 * del formulario (bug encontrado en producción, 22 ago 2026).
 */
export const estadoInicialReporteNecesidad: EstadoReporteNecesidad = {
  errores: {},
  valores: {
    titulo: "",
    categoria: "",
    responsable: "",
    cantidadNecesaria: "",
    fechaLimite: "",
    nodoId: "",
    albergue: "",
  },
};
