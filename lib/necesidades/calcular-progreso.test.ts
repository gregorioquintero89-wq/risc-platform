import { describe, expect, it } from "vitest";
import { calcularProgresoDonacion } from "./calcular-progreso";

describe("calcularProgresoDonacion", () => {
  it("returns 0 when nothing has been received", () => {
    expect(calcularProgresoDonacion(100, 0)).toBe(0);
  });

  it("returns 100 when recibida equals necesaria", () => {
    expect(calcularProgresoDonacion(100, 100)).toBe(100);
  });

  it("rounds a partial percentage", () => {
    expect(calcularProgresoDonacion(100, 30)).toBe(30);
    expect(calcularProgresoDonacion(3, 1)).toBe(33);
  });

  it("clamps at 100 when recibida exceeds necesaria (concurrent-donation surplus, OpenSpec sección 6)", () => {
    expect(calcularProgresoDonacion(100, 150)).toBe(100);
  });

  it("returns 0 for a non-positive cantidad_necesaria instead of dividing by zero", () => {
    expect(calcularProgresoDonacion(0, 0)).toBe(0);
  });
});
