import { describe, expect, it } from "vitest";
import {
  esReporteValido,
  validarReporteNecesidad,
  type ReporteNecesidadInput,
} from "./validar-reporte";

function reporteValido(overrides: Partial<ReporteNecesidadInput> = {}): ReporteNecesidadInput {
  return {
    titulo: "Agua potable",
    categoria: "agua",
    responsable: "María Pérez",
    cantidadNecesaria: "50",
    fechaLimite: "2026-09-01",
    nodoId: "nodo-cali",
    albergue: "",
    ...overrides,
  };
}

describe("validarReporteNecesidad — regla de oro (BR-01)", () => {
  it("returns no errors for a complete report", () => {
    const errores = validarReporteNecesidad(reporteValido());

    expect(esReporteValido(errores)).toBe(true);
  });

  it("does not require albergue (optional field)", () => {
    const errores = validarReporteNecesidad(reporteValido({ albergue: undefined }));

    expect(esReporteValido(errores)).toBe(true);
  });

  it.each([
    ["titulo", { titulo: "" }],
    ["categoria", { categoria: "  " }],
    ["responsable", { responsable: "" }],
    ["nodoId", { nodoId: "" }],
    ["fechaLimite", { fechaLimite: "" }],
  ] as const)("blocks submission when %s is missing", (campo, overrides) => {
    const errores = validarReporteNecesidad(reporteValido(overrides));

    expect(errores[campo]).toBeTruthy();
    expect(esReporteValido(errores)).toBe(false);
  });

  it("rejects a non-numeric cantidadNecesaria", () => {
    const errores = validarReporteNecesidad(reporteValido({ cantidadNecesaria: "no es un número" }));

    expect(errores.cantidadNecesaria).toBeTruthy();
  });

  it("rejects a cantidadNecesaria that is zero or negative", () => {
    expect(esReporteValido(validarReporteNecesidad(reporteValido({ cantidadNecesaria: "0" })))).toBe(false);
    expect(esReporteValido(validarReporteNecesidad(reporteValido({ cantidadNecesaria: "-5" })))).toBe(false);
  });
});
