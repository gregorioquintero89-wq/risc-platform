"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Small progressive-enhancement helper: lets a donor type a different
 * code and jump straight to /donaciones/[codigo] instead of editing
 * the URL by hand. The page itself works without this (a donor can
 * always navigate directly to their code's URL), so this has no
 * dedicated unit test — it's UI wiring, not business logic.
 */
export function BuscarOtroCodigo() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");

  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        const limpio = codigo.trim();
        if (limpio) {
          router.push(`/donaciones/${encodeURIComponent(limpio)}`);
        }
      }}
    >
      <label htmlFor="buscar-codigo">Consultar otro código</label>
      <input
        id="buscar-codigo"
        name="codigo"
        value={codigo}
        onChange={(evento) => setCodigo(evento.target.value)}
        placeholder="Ej: AB12CD34"
      />
      <button type="submit">Buscar</button>
    </form>
  );
}
