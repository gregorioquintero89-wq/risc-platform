-- Fix FR-E1-05 (resolución automática): resolver_necesidad_si_corresponde()
-- leía NEW.faltante dentro de un trigger BEFORE UPDATE — pero `faltante`
-- es GENERATED ALWAYS AS (...) STORED, y Postgres recalcula columnas
-- generadas DESPUÉS de que corren los triggers BEFORE ROW, no antes. El
-- trigger veía el valor viejo de faltante, nunca el que resultaría de
-- este mismo UPDATE, así que una necesidad nunca pasaba a `resuelta`
-- sola. Reproducido con datos reales el 23 ago 2026 (loop completo:
-- reportar → publicar → donar → confirmar recepción 10/10 → estado
-- quedaba en `publicada` con faltante=0 en vez de `resuelta`).
--
-- Fix: calcular la condición directo de las columnas base (las mismas
-- que ya definen la fórmula de la columna generada), no de la columna
-- generada en sí.

create or replace function public.resolver_necesidad_si_corresponde()
returns trigger language plpgsql as $$
begin
  if new.estado = 'publicada' and (new.cantidad_necesaria - new.cantidad_recibida) <= 0 then
    new.estado := 'resuelta';
  end if;
  return new;
end;
$$;

-- Reconciliación de datos: la necesidad de prueba quedó stuck en
-- `publicada` con faltante=0 por este bug — la corrige el mismo
-- criterio que ahora aplica el trigger, no una excepción.
update public.necesidades
set estado = 'resuelta'
where estado = 'publicada' and (cantidad_necesaria - cantidad_recibida) <= 0;
