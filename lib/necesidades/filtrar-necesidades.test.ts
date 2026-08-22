import { describe, expect, it } from "vitest";
import { filtrarYOrdenarNecesidades } from "./filtrar-necesidades";
import type { NecesidadListada } from "./types";

function necesidad(overrides: Partial<NecesidadListada>): NecesidadListada {
  return {
    id: "id-default",
    titulo: "Título",
    categoria: "agua",
    albergue: null,
    cantidad_necesaria: 100,
    cantidad_recibida: 0,
    faltante: 100,
    fecha_limite: "2026-09-01",
    nodo: { id: "nodo-cali", municipio: "Cali", departamento: "Valle del Cauca" },
    ...overrides,
  };
}

describe("filtrarYOrdenarNecesidades", () => {
  it("excludes needs whose faltante is 0 (FR-E1-04/05 — resuelta, not actionable)", () => {
    const resultado = filtrarYOrdenarNecesidades([
      necesidad({ id: "a", faltante: 0 }),
      necesidad({ id: "b", faltante: 5 }),
    ]);

    expect(resultado.map((n) => n.id)).toEqual(["b"]);
  });

  it("filters by nodoId when provided", () => {
    const resultado = filtrarYOrdenarNecesidades(
      [
        necesidad({ id: "cali", nodo: { id: "nodo-cali", municipio: "Cali", departamento: "Valle del Cauca" } }),
        necesidad({ id: "ibague", nodo: { id: "nodo-ibague", municipio: "Ibagué", departamento: "Tolima" } }),
      ],
      { nodoId: "nodo-cali" },
    );

    expect(resultado.map((n) => n.id)).toEqual(["cali"]);
  });

  it("filters by categoria when provided", () => {
    const resultado = filtrarYOrdenarNecesidades(
      [
        necesidad({ id: "agua", categoria: "agua" }),
        necesidad({ id: "ropa", categoria: "ropa" }),
      ],
      { categoria: "ropa" },
    );

    expect(resultado.map((n) => n.id)).toEqual(["ropa"]);
  });

  it("combines nodoId and categoria filters", () => {
    const resultado = filtrarYOrdenarNecesidades(
      [
        necesidad({
          id: "match",
          categoria: "agua",
          nodo: { id: "nodo-cali", municipio: "Cali", departamento: "Valle del Cauca" },
        }),
        necesidad({
          id: "wrong-categoria",
          categoria: "ropa",
          nodo: { id: "nodo-cali", municipio: "Cali", departamento: "Valle del Cauca" },
        }),
        necesidad({
          id: "wrong-nodo",
          categoria: "agua",
          nodo: { id: "nodo-ibague", municipio: "Ibagué", departamento: "Tolima" },
        }),
      ],
      { nodoId: "nodo-cali", categoria: "agua" },
    );

    expect(resultado.map((n) => n.id)).toEqual(["match"]);
  });

  it("returns every need with faltante > 0 when no filter is given", () => {
    const resultado = filtrarYOrdenarNecesidades([
      necesidad({ id: "a" }),
      necesidad({ id: "b" }),
    ]);

    expect(resultado).toHaveLength(2);
  });

  it("sorts by fecha_limite ascending first (FR-E1-06 — no priority field)", () => {
    const resultado = filtrarYOrdenarNecesidades([
      necesidad({ id: "later", fecha_limite: "2026-12-01" }),
      necesidad({ id: "sooner", fecha_limite: "2026-09-01" }),
    ]);

    expect(resultado.map((n) => n.id)).toEqual(["sooner", "later"]);
  });

  it("breaks a fecha_limite tie by faltante descending", () => {
    const resultado = filtrarYOrdenarNecesidades([
      necesidad({ id: "menos-falta", fecha_limite: "2026-09-01", faltante: 10 }),
      necesidad({ id: "mas-falta", fecha_limite: "2026-09-01", faltante: 90 }),
    ]);

    expect(resultado.map((n) => n.id)).toEqual(["mas-falta", "menos-falta"]);
  });
});
