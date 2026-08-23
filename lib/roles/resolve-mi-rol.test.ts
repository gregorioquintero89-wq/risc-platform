import { describe, expect, it } from "vitest";
import {
  actorPuedeAsignar,
  puedeGestionarNecesidades,
  puedeGestionarCentros,
  puedeGestionarNodos,
  puedeOperarCentro,
  resolveMiRol,
  rolesAsignablesPor,
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

describe("rolesAsignablesPor", () => {
  it("admin_nacional puede asignar los 4 roles (roles_admin_asigna, sin restricción)", () => {
    expect(rolesAsignablesPor("admin_nacional")).toEqual([
      "lider",
      "suplente",
      "operador",
      "admin_nacional",
    ]);
  });

  it("lider solo puede asignar suplente u operador — nunca lider (roles_lider_asigna_en_su_nodo)", () => {
    expect(rolesAsignablesPor("lider")).toEqual(["suplente", "operador"]);
  });

  it("suplente tiene el mismo alcance que lider para asignar roles (FR-E8-06)", () => {
    expect(rolesAsignablesPor("suplente")).toEqual(["suplente", "operador"]);
  });

  it("operador no puede asignar ningún rol", () => {
    expect(rolesAsignablesPor("operador")).toEqual([]);
  });
});

describe("puedeGestionarCentros", () => {
  it("allows lider, suplente y admin_nacional (matches centros_gestiona_lider)", () => {
    expect(puedeGestionarCentros("lider")).toBe(true);
    expect(puedeGestionarCentros("suplente")).toBe(true);
    expect(puedeGestionarCentros("admin_nacional")).toBe(true);
  });

  it("blocks operador", () => {
    expect(puedeGestionarCentros("operador")).toBe(false);
  });
});

describe("puedeGestionarNodos", () => {
  it("solo admin_nacional (matches nodos_admin_gestiona)", () => {
    expect(puedeGestionarNodos("admin_nacional")).toBe(true);
    expect(puedeGestionarNodos("lider")).toBe(false);
    expect(puedeGestionarNodos("suplente")).toBe(false);
    expect(puedeGestionarNodos("operador")).toBe(false);
  });
});

describe("actorPuedeAsignar", () => {
  it("admin_nacional puede asignar lider en cualquier nodo", () => {
    expect(
      actorPuedeAsignar({ rol: "admin_nacional", nodoId: null }, "lider", "nodo-x"),
    ).toBe(true);
  });

  it("admin_nacional puede asignar admin_nacional (sin nodo)", () => {
    expect(
      actorPuedeAsignar({ rol: "admin_nacional", nodoId: null }, "admin_nacional", null),
    ).toBe(true);
  });

  it("lider puede asignar suplente/operador en SU propio nodo", () => {
    expect(
      actorPuedeAsignar({ rol: "lider", nodoId: "nodo-1" }, "operador", "nodo-1"),
    ).toBe(true);
  });

  it("lider NO puede asignar en un nodo ajeno", () => {
    expect(
      actorPuedeAsignar({ rol: "lider", nodoId: "nodo-1" }, "operador", "nodo-2"),
    ).toBe(false);
  });

  it("lider NO puede asignar rol de lider (escalada de privilegios bloqueada)", () => {
    expect(
      actorPuedeAsignar({ rol: "lider", nodoId: "nodo-1" }, "lider", "nodo-1"),
    ).toBe(false);
  });

  it("operador no puede asignar nada", () => {
    expect(
      actorPuedeAsignar({ rol: "operador", nodoId: "nodo-1" }, "operador", "nodo-1"),
    ).toBe(false);
  });
});
