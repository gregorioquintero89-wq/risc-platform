-- Fix: comprometer una donación pública necesitaba leer el código
-- generado por la base para mostrárselo al donante, pero donaciones no
-- tiene (a propósito) SELECT policy para anon — con RETURNING, Postgres
-- exige SELECT policy sobre la fila insertada o revierte el INSERT
-- entero (ver docs de CREATE POLICY). Encontrado por el agente que
-- implementó el portal público, 22 ago 2026.
--
-- Fix: la inserción pública pasa por una función security definer que
-- devuelve el código directamente, mismo patrón que
-- buscar_donacion_por_codigo(). Se retira el INSERT directo de anon
-- para no tener dos caminos que validan lo mismo distinto.

drop policy if exists donaciones_insert_publico on public.donaciones;

create function public.crear_donacion_publica(
  p_necesidad_id uuid,
  p_centro_id uuid,
  p_cantidad integer,
  p_contacto_nombre text,
  p_contacto_telefono text
)
returns table (codigo text, centro_nombre text)
language plpgsql security definer set search_path = public as $$
declare
  v_codigo text;
  v_centro_nombre text;
begin
  if p_cantidad is null or p_cantidad <= 0 then
    raise exception 'La cantidad debe ser mayor a 0';
  end if;
  if p_contacto_nombre is null or p_contacto_telefono is null then
    raise exception 'Contacto obligatorio para donaciones en línea (FR-E2-02)';
  end if;
  if not exists (select 1 from public.necesidades where id = p_necesidad_id and estado = 'publicada') then
    raise exception 'La necesidad no está publicada';
  end if;

  insert into public.donaciones (necesidad_id, centro_id, cantidad, contacto_nombre, contacto_telefono, origen, estado)
  values (p_necesidad_id, p_centro_id, p_cantidad, p_contacto_nombre, p_contacto_telefono, 'online', 'comprometida')
  returning donaciones.codigo into v_codigo;

  select c.nombre into v_centro_nombre from public.centros_acopio c where c.id = p_centro_id;

  return query select v_codigo, v_centro_nombre;
end;
$$;

comment on function public.crear_donacion_publica is 'Único camino de inserción pública de donaciones — reemplaza donaciones_insert_publico, evita el problema de RETURNING sin SELECT policy para anon.';

grant execute on function public.crear_donacion_publica to anon, authenticated;
