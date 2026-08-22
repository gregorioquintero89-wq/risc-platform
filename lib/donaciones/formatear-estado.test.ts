import { describe, expect, it } from "vitest";
import { formatearEstadoDonacion } from "./formatear-estado";

describe("formatearEstadoDonacion (US-E2-05)", () => {
  it("describes a comprometida donation as not yet arrived", () => {
    expect(formatearEstadoDonacion("comprometida")).toMatch(/comprometida/i);
  });

  it("describes a recibida donation as confirmed at the center", () => {
    expect(formatearEstadoDonacion("recibida")).toMatch(/recibida/i);
  });

  it("returns different text for each state", () => {
    expect(formatearEstadoDonacion("comprometida")).not.toBe(
      formatearEstadoDonacion("recibida"),
    );
  });
});
