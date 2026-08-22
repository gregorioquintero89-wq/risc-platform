import { describe, expect, it } from "vitest";
import { compararPublicadas, validarMotivoDescarte } from "./transiciones";

describe("validarMotivoDescarte", () => {
  it("rejects an empty motivo", () => {
    expect(validarMotivoDescarte("")).toEqual({
      ok: false,
      error: expect.any(String),
    });
  });

  it("rejects a motivo that is only whitespace", () => {
    expect(validarMotivoDescarte("   ")).toEqual({
      ok: false,
      error: expect.any(String),
    });
  });

  it("accepts a non-empty motivo and trims it", () => {
    expect(validarMotivoDescarte("  duplicada  ")).toEqual({
      ok: true,
      motivo: "duplicada",
    });
  });
});

describe("compararPublicadas", () => {
  const base = { fecha_limite: "2026-09-01", faltante: 5 };

  it("orders the sooner fecha_limite first", () => {
    const a = { ...base, fecha_limite: "2026-09-01" };
    const b = { ...base, fecha_limite: "2026-09-10" };
    expect(compararPublicadas(a, b)).toBeLessThan(0);
  });

  it("breaks a fecha_limite tie by the larger faltante first", () => {
    const a = { ...base, faltante: 10 };
    const b = { ...base, faltante: 3 };
    expect(compararPublicadas(a, b)).toBeLessThan(0);
  });

  it("treats a null faltante as 0", () => {
    const a = { ...base, faltante: null };
    const b = { ...base, faltante: 1 };
    expect(compararPublicadas(a, b)).toBeGreaterThan(0);
  });
});
