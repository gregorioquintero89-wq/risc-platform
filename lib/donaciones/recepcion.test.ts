import { describe, expect, it } from "vitest";
import { normalizarCodigo, puedeConfirmarRecepcion } from "./recepcion";

describe("normalizarCodigo", () => {
  it("trims whitespace and uppercases", () => {
    expect(normalizarCodigo("  ab12cd34  ")).toBe("AB12CD34");
  });
});

describe("puedeConfirmarRecepcion", () => {
  it("allows confirming a donation that is still comprometida", () => {
    expect(puedeConfirmarRecepcion("comprometida")).toBe(true);
  });

  it("blocks confirming a donation that was already recibida (trigger only fires comprometida -> recibida)", () => {
    expect(puedeConfirmarRecepcion("recibida")).toBe(false);
  });
});
