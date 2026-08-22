import { describe, expect, it } from "vitest";
import {
  puedeGestionarNecesidades,
  puedeOperarCentro,
  resolveMiRol,
} from "./resolve-mi-rol";

describe("resolveMiRol", () => {
  it("returns null when mi_rol() returns no rows (sin rol asignado, fail-closed)", () => {
    expect(resolveMiRol([])).toBeNull();
  });

  it("resolves the single row to { rol, nodoId }", () => {
    expect(resolveMiRol([{ rol: "lider", nodo_id: "nodo-1" }])).toEqual({
      rol: "lider",
      nodoId: "nodo-1",
    });
  });

  it("resolves admin_nacional with a null nodoId (FR-E8-04: no cuelga de un nodo)", () => {
    expect(resolveMiRol([{ rol: "admin_nacional", nodo_id: null }])).toEqual({
      rol: "admin_nacional",
      nodoId: null,
    });
  });

  it("falls back to the first row if more than one is ever returned (BR-11 says this shouldn't happen)", () => {
    expect(
      resolveMiRol([
        { rol: "lider", nodo_id: "nodo-1" },
        { rol: "operador", nodo_id: "nodo-2" },
      ]),
    ).toEqual({ rol: "lider", nodoId: "nodo-1" });
  });
});

describe("puedeGestionarNecesidades", () => {
  it("allows lider and suplente (FR-E8-06: mismos permisos que el lider)", () => {
    expect(puedeGestionarNecesidades("lider")).toBe(true);
    expect(puedeGestionarNecesidades("suplente")).toBe(true);
  });

  it("blocks operador and admin_nacional", () => {
    expect(puedeGestionarNecesidades("operador")).toBe(false);
    expect(puedeGestionarNecesidades("admin_nacional")).toBe(false);
  });
});

describe("puedeOperarCentro", () => {
  it("allows lider, suplente and operador (matches donaciones_update_recepcion)", () => {
    expect(puedeOperarCentro("lider")).toBe(true);
    expect(puedeOperarCentro("suplente")).toBe(true);
    expect(puedeOperarCentro("operador")).toBe(true);
  });

  it("blocks admin_nacional", () => {
    expect(puedeOperarCentro("admin_nacional")).toBe(false);
  });
});
