import { afterEach, describe, expect, it, vi } from "vitest";
import {
  calcularDiasHastaVencimiento,
  calcularUrgenciaVencimiento,
  textoVencimiento,
} from "./vencimiento";

describe("calcularDiasHastaVencimiento", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 when fecha_limite is today, regardless of current time of day", () => {
    vi.setSystemTime(new Date("2026-08-22T23:59:00Z"));
    expect(calcularDiasHastaVencimiento("2026-08-22")).toBe(0);
  });

  it("returns positive days for a future date", () => {
    vi.setSystemTime(new Date("2026-08-22T00:00:00Z"));
    expect(calcularDiasHastaVencimiento("2026-08-24")).toBe(2);
  });

  it("returns negative days for a past date", () => {
    vi.setSystemTime(new Date("2026-08-22T00:00:00Z"));
    expect(calcularDiasHastaVencimiento("2026-08-20")).toBe(-2);
  });
});

describe("calcularUrgenciaVencimiento", () => {
  it("is urgente at 2 days or fewer, including overdue", () => {
    expect(calcularUrgenciaVencimiento(2)).toBe("urgente");
    expect(calcularUrgenciaVencimiento(0)).toBe("urgente");
    expect(calcularUrgenciaVencimiento(-3)).toBe("urgente");
  });

  it("is medio between 3 and 7 days", () => {
    expect(calcularUrgenciaVencimiento(3)).toBe("medio");
    expect(calcularUrgenciaVencimiento(7)).toBe("medio");
  });

  it("is null beyond 7 days", () => {
    expect(calcularUrgenciaVencimiento(8)).toBe(null);
  });
});

describe("textoVencimiento", () => {
  it("labels today and tomorrow specially", () => {
    expect(textoVencimiento(0)).toBe("Vence hoy");
    expect(textoVencimiento(1)).toBe("Vence mañana");
  });

  it("labels a future day count", () => {
    expect(textoVencimiento(5)).toBe("Vence en 5 días");
  });

  it("labels an overdue date with correct pluralization", () => {
    expect(textoVencimiento(-1)).toBe("Venció hace 1 día");
    expect(textoVencimiento(-3)).toBe("Venció hace 3 días");
  });
});
