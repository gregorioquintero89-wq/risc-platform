-- Da soporte a: cambiar mi contraseña, eliminar asignaciones de rol,
-- editar/desactivar centros de acopio, activar/desactivar ciudades.
-- Decisión Gregorio Quintero, 24 ago 2026.

-- ============================================================
-- 1. Eliminar roles — espejo exacto de las policies de INSERT
-- ============================================================
create policy roles_admin_elimina on public.usuario_roles
  for delete to authenticated
  using (exists (select 1 from public.mi_rol() where rol = 'admin_nacional'));

create policy roles_lider_elimina_en_su_nodo on public.usuario_roles
  for delete to authenticated
  using (
    rol in ('suplente', 'operador')
    and exists (
      select 1 from public.mi_rol() mr
      where mr.rol in ('lider', 'suplente') and mr.nodo_id = usuario_roles.nodo_id
    )
  );

-- ============================================================
-- 2. Centros de acopio: soft-delete via `activo`, nunca DELETE real
--    (donaciones/inventario_movimientos referencian centro_id — un
--    DELETE real fallaría igual por la FK, o peor, se perdería
--    historial si alguna vez se agrega CASCADE. FR-E9: nada se pierde
--    sin dejar rastro).
-- ============================================================
alter table public.centros_acopio add column activo boolean not null default true;

comment on column public.centros_acopio.activo is
  'Desactivar reemplaza a borrar — preserva el historial de donaciones e inventario ya asociado a este centro.';

-- El portal público y el selector de "dónde donar" solo deben ofrecer
-- centros activos; centros_gestiona_lider (INSERT/UPDATE/DELETE) ya
-- cubre editar/desactivar, no hace falta una policy nueva ahí.
drop policy centros_select_publico on public.centros_acopio;
create policy centros_select_publico on public.centros_acopio
  for select to anon, authenticated using (activo);

-- Pero el líder/suplente/admin que gestiona centros SÍ debe poder ver
-- los propios aunque estén desactivados (para poder reactivarlos).
create policy centros_select_gestor on public.centros_acopio
  for select to authenticated
  using (
    exists (
      select 1 from public.mi_rol() mr
      where (mr.rol in ('lider', 'suplente') and mr.nodo_id = centros_acopio.nodo_id)
         or mr.rol = 'admin_nacional'
    )
  );

-- ============================================================
-- 3. Roster de roles con nombre/email — join a auth.users, por eso
--    necesita security definer (mismo patrón que mi_rol() y
--    buscar_donacion_por_codigo()). El WHERE reproduce exactamente
--    quién puede ver qué: propia fila, todo el nodo si sos
--    líder/suplente de ese nodo, o todo si sos admin_nacional.
-- ============================================================
create function public.listar_roles_visibles()
returns table (
  id uuid,
  user_id uuid,
  email text,
  nombre text,
  rol public.rol_risc,
  nodo_id uuid,
  nodo_nombre text
)
language sql security definer stable set search_path = public as $$
  select
    ur.id,
    ur.user_id,
    u.email,
    coalesce(u.raw_user_meta_data->>'full_name', '') as nombre,
    ur.rol,
    ur.nodo_id,
    n.municipio as nodo_nombre
  from public.usuario_roles ur
  join auth.users u on u.id = ur.user_id
  left join public.nodos n on n.id = ur.nodo_id
  where
    ur.user_id = auth.uid()
    or exists (
      select 1 from public.mi_rol() mr
      where mr.rol = 'admin_nacional'
         or (mr.rol in ('lider', 'suplente') and mr.nodo_id = ur.nodo_id)
    )
  order by n.municipio, ur.rol;
$$;
