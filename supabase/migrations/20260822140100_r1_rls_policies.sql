-- RISC — RLS. Fail-closed por defecto (BR-06, FR-E8-03): habilitar RLS sin
-- policy es negar todo; cada acceso se otorga explícitamente acá, nunca
-- por omisión.

alter table public.nodos enable row level security;
alter table public.usuario_roles enable row level security;
alter table public.necesidades enable row level security;
alter table public.centros_acopio enable row level security;
alter table public.donaciones enable row level security;
alter table public.inventario_movimientos enable row level security;
alter table public.auditoria enable row level security;

-- ============================================================
-- NODOS — lectura pública (portal de donante necesita listar ciudades)
-- ============================================================
create policy nodos_select_publico on public.nodos
  for select to anon, authenticated using (activo);

create policy nodos_admin_gestiona on public.nodos
  for all to authenticated
  using (exists (select 1 from public.mi_rol() where rol = 'admin_nacional'))
  with check (exists (select 1 from public.mi_rol() where rol = 'admin_nacional'));

-- ============================================================
-- USUARIO_ROLES
-- ============================================================
create policy roles_ver_propio on public.usuario_roles
  for select to authenticated using (user_id = auth.uid());

create policy roles_admin_ve_todo on public.usuario_roles
  for select to authenticated
  using (exists (select 1 from public.mi_rol() where rol = 'admin_nacional'));

create policy roles_admin_asigna on public.usuario_roles
  for insert to authenticated
  with check (exists (select 1 from public.mi_rol() where rol = 'admin_nacional'));

-- Líder asigna suplente/operador SOLO en su propio nodo (FR-E8-02/06/07)
create policy roles_lider_asigna_en_su_nodo on public.usuario_roles
  for insert to authenticated
  with check (
    rol in ('suplente', 'operador')
    and exists (
      select 1 from public.mi_rol() mr
      where mr.rol in ('lider', 'suplente') and mr.nodo_id = usuario_roles.nodo_id
    )
  );

-- ============================================================
-- NECESIDADES (FR-E1)
-- ============================================================
-- Público: solo lo ya verificado (FR-E1-02). Nada de 'reportada'/'descartada' sale del nodo.
create policy necesidades_select_publico on public.necesidades
  for select to anon, authenticated
  using (estado in ('publicada', 'resuelta'));

-- Líder/suplente/operador/admin ven también lo pendiente de verificar de SU nodo
create policy necesidades_select_nodo on public.necesidades
  for select to authenticated
  using (
    exists (
      select 1 from public.mi_rol() mr
      where mr.rol = 'admin_nacional' or mr.nodo_id = necesidades.nodo_id
    )
  );

-- Reportar es público (FR-E1-01) — entra siempre como 'reportada'
create policy necesidades_insert_publico on public.necesidades
  for insert to anon, authenticated
  with check (estado = 'reportada');

-- Verificar/publicar/descartar: solo líder o suplente de ese nodo (FR-E1-03)
create policy necesidades_update_lider on public.necesidades
  for update to authenticated
  using (
    exists (
      select 1 from public.mi_rol() mr
      where mr.rol in ('lider', 'suplente') and mr.nodo_id = necesidades.nodo_id
    )
  );

-- ============================================================
-- CENTROS DE ACOPIO (FR-E3-01)
-- ============================================================
create policy centros_select_publico on public.centros_acopio
  for select to anon, authenticated using (true);

create policy centros_gestiona_lider on public.centros_acopio
  for all to authenticated
  using (
    exists (
      select 1 from public.mi_rol() mr
      where (mr.rol in ('lider', 'suplente') and mr.nodo_id = centros_acopio.nodo_id)
         or mr.rol = 'admin_nacional'
    )
  )
  with check (
    exists (
      select 1 from public.mi_rol() mr
      where (mr.rol in ('lider', 'suplente') and mr.nodo_id = centros_acopio.nodo_id)
         or mr.rol = 'admin_nacional'
    )
  );

-- ============================================================
-- DONACIONES (FR-E2) — sin SELECT directo para anon: la consulta pública
-- por código pasa por buscar_donacion_por_codigo(), no por la tabla.
-- ============================================================
create policy donaciones_insert_publico on public.donaciones
  for insert to anon, authenticated
  with check (
    estado = 'comprometida'
    and origen = 'online'
    and exists (select 1 from public.necesidades n where n.id = necesidad_id and n.estado = 'publicada')
  );

-- Walk-in (E3-US-06): solo lo registra un operador/líder/suplente del nodo del centro
create policy donaciones_insert_presencial on public.donaciones
  for insert to authenticated
  with check (
    origen = 'presencial'
    and estado = 'recibida'
    and exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on mr.nodo_id = c.nodo_id
      where c.id = centro_id and mr.rol in ('lider', 'suplente', 'operador')
    )
  );

create policy donaciones_select_nodo on public.donaciones
  for select to authenticated
  using (
    exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on (mr.nodo_id = c.nodo_id or mr.rol = 'admin_nacional')
      where c.id = donaciones.centro_id
    )
  );

-- Confirmar recepción (FR-E2-04): operador/líder/suplente del nodo del centro
create policy donaciones_update_recepcion on public.donaciones
  for update to authenticated
  using (
    exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on mr.nodo_id = c.nodo_id
      where c.id = donaciones.centro_id and mr.rol in ('lider', 'suplente', 'operador')
    )
  );

-- ============================================================
-- INVENTARIO_MOVIMIENTOS (FR-E3-03/04/05)
-- ============================================================
create policy inventario_select_nodo on public.inventario_movimientos
  for select to authenticated
  using (
    exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on (mr.nodo_id = c.nodo_id or mr.rol = 'admin_nacional')
      where c.id = inventario_movimientos.centro_id
    )
  );

create policy inventario_insert_operador on public.inventario_movimientos
  for insert to authenticated
  with check (
    exists (
      select 1 from public.centros_acopio c
      join public.mi_rol() mr on mr.nodo_id = c.nodo_id
      where c.id = centro_id and mr.rol in ('lider', 'suplente', 'operador')
    )
  );

-- ============================================================
-- AUDITORÍA (FR-E9-02) — insert solo vía función security definer,
-- nunca directo desde el cliente.
-- ============================================================
create policy auditoria_select_lider_admin on public.auditoria
  for select to authenticated
  using (
    exists (select 1 from public.mi_rol() where rol in ('lider', 'suplente', 'admin_nacional'))
  );
