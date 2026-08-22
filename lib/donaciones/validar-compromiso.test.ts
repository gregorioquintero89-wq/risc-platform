import { describe, expect, it } from "vitest";
import {
  esCompromisoValido,
  validarCompromisoDonacion,
  type CompromisoDonacionInput,
} from "./validar-compromiso";

function compromisoValido(
  overrides: Partial<CompromisoDonacionInput> = {},
): CompromisoDonacionInput {
  return {
    cantidad: "10",
    contactoNombre: "Juan Gómez",
    contactoTelefono: "3001234567",
    centroId: "centro-1",
    ...overrides,
  };
}

describe("validarCompromisoDonacion (FR-E2-02)", () => {
  it("returns no errors for a complete commitment", () => {
    const errores = validarCompromisoDonacion(compromisoValido());

    expect(esCompromisoValido(errores)).toBe(true);
  });

  it.each([
    ["contactoNombre", { contactoNombre: "" }],
    ["contactoTelefono", { contactoTelefono: "  " }],
    ["centroId", { centroId: "" }],
  ] as const)("blocks submission when %s is missing", (campo, overrides) => {
    const errores = validarCompromisoDonacion(compromisoValido(overrides));

    expect(errores[campo]).toBeTruthy();
    expect(esCompromisoValido(errores)).toBe(false);
  });

  it("rejects a non-numeric cantidad", () => {
    const errores = validarCompromisoDonacion(compromisoValido({ cantidad: "diez" }));

    expect(errores.cantidad).toBeTruthy();
  });

  it("rejects a cantidad that is zero or negative", () => {
    expect(esCompromisoValido(validarCompromisoDonacion(compromisoValido({ cantidad: "0" })))).toBe(false);
    expect(esCompromisoValido(validarCompromisoDonacion(compromisoValido({ cantidad: "-1" })))).toBe(false);
  });

  it("does not cap cantidad against any faltante — no reservation mechanism (OpenSpec sección 6, decisión 20 ago 2026)", () => {
    // Comprometer no conoce ni valida el faltante — es una regla de negocio
    // deliberada, no un olvido. Una cantidad grande sigue siendo válida.
    const errores = validarCompromisoDonacion(compromisoValido({ cantidad: "999999" }));

    expect(esCompromisoValido(errores)).toBe(true);
  });
});
