-- FR-E8-07/FR-E8-03: "el operador no tiene visibilidad de todo el
-- nodo como sí lo hacen líder y suplente — su alcance práctico es el
-- centro o los centros de los que sea responsable". Las policies
-- originales le daban al operador acceso a TODO el nodo (mismo
-- alcance que líder/suplente) porque solo chequeaban nodo_id, no
-- responsable_user_id. Con un centro por ciudad no se notaba; con más
-- de uno, un operador del Centro A podía operar el Centro B.
-- Decisión Gregorio Quintero, 24 ago 2026: corregir ahora.
--
-- Líder/suplente/admin_nacional mantienen el alcance de todo el nodo
-- (correcto, sin cambios) — solo se restringe la rama de "operador".

drop policy donaciones_select_nodo on public.donaciones;
create policy donaciones_select_nodo on public.donaciones
  for select to authenticated
  using (
    exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on (
        mr.rol = 'admin_nacional'
        or (mr.rol in ('lider', 'suplente') and mr.nodo_id = c.nodo_id)
        or (mr.rol = 'operador' and c.responsable_user_id = auth.uid())
      )
      where c.id = donaciones.centro_id
    )
  );

drop policy donaciones_update_recepcion on public.donaciones;
create policy donaciones_update_recepcion on public.donaciones
  for update to authenticated
  using (
    exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on (
        (mr.rol in ('lider', 'suplente') and mr.nodo_id = c.nodo_id)
        or (mr.rol = 'operador' and c.responsable_user_id = auth.uid())
      )
      where c.id = donaciones.centro_id
    )
  );

drop policy inventario_select_nodo on public.inventario_movimientos;
create policy inventario_select_nodo on public.inventario_movimientos
  for select to authenticated
  using (
    exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on (
        mr.rol = 'admin_nacional'
        or (mr.rol in ('lider', 'suplente') and mr.nodo_id = c.nodo_id)
        or (mr.rol = 'operador' and c.responsable_user_id = auth.uid())
      )
      where c.id = inventario_movimientos.centro_id
    )
  );

drop policy inventario_insert_operador on public.inventario_movimientos;
create policy inventario_insert_operador on public.inventario_movimientos
  for insert to authenticated
  with check (
    exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on (
        (mr.rol in ('lider', 'suplente') and mr.nodo_id = c.nodo_id)
        or (mr.rol = 'operador' and c.responsable_user_id = auth.uid())
      )
      where c.id = centro_id
    )
  );
