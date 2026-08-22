-- RISC — Schema R1 (E1 necesidades, E2 donaciones, E3 centros de acopio,
-- E8 roles/nodos, E9 auditoría). Alcance: loop cerrado del MVP.
-- Fuente de verdad de negocio: docs/vertical-os/02-OpenSpec.md
-- Fuente de verdad de arquitectura: docs/adr/0001-stack-selection.md

-- ============================================================
-- 1. NODOS (FR-E8-01)
-- ============================================================
create table public.nodos (
  id uuid primary key default gen_random_uuid(),
  municipio text not null,
  departamento text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  unique (municipio, departamento)
);

comment on table public.nodos is 'Un nodo RISC cuelga siempre de un municipio, nunca de un departamento (FR-E8-01).';

-- ============================================================
-- 2. ROLES (FR-E8-02/04/06/07, BR-11: un rol por persona)
-- ============================================================
create type public.rol_risc as enum ('lider', 'suplente', 'operador', 'admin_nacional');

create table public.usuario_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rol public.rol_risc not null,
  -- admin_nacional no cuelga de un nodo por definición (FR-E8-04)
  nodo_id uuid references public.nodos(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (user_id), -- BR-11: un rol por persona, sin excepciones
  constraint admin_sin_nodo check (
    (rol = 'admin_nacional' and nodo_id is null) or
    (rol <> 'admin_nacional' and nodo_id is not null)
  )
);

comment on table public.usuario_roles is 'Un usuario, un rol, un nodo (salvo admin_nacional). BR-11, decisión 21 ago 2026.';

-- Helper: rol y nodo del usuario autenticado actual. security definer para
-- poder leer usuario_roles desde dentro de otras policies sin recursión.
create function public.mi_rol()
returns table (rol public.rol_risc, nodo_id uuid)
language sql security definer stable
set search_path = public
as $$
  select ur.rol, ur.nodo_id
  from public.usuario_roles ur
  where ur.user_id = auth.uid()
$$;

-- ============================================================
-- 3. NECESIDADES (E1 — FR-E1-01 a 07)
-- ============================================================
create type public.estado_necesidad as enum ('reportada', 'publicada', 'resuelta', 'descartada');

create table public.necesidades (
  id uuid primary key default gen_random_uuid(),
  nodo_id uuid not null references public.nodos(id) on delete restrict,
  titulo text not null,
  categoria text not null,
  responsable text not null,
  albergue text,
  cantidad_necesaria integer not null check (cantidad_necesaria > 0),
  cantidad_recibida integer not null default 0 check (cantidad_recibida >= 0),
  -- máx(0, necesario - recibido) — FR-E1-04, nunca negativo
  faltante integer generated always as (greatest(cantidad_necesaria - cantidad_recibida, 0)) stored,
  fecha_limite date not null,
  estado public.estado_necesidad not null default 'reportada',
  motivo_descarte text,
  verificado_por uuid references auth.users(id),
  verificado_en timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.necesidades is 'La regla de oro (manual sección 03): responsable, cantidad, ubicación, fecha límite, estado. Sin campo de prioridad (FR-E1-06).';

-- Necesidad pasa a resuelta sola cuando el faltante llega a 0 (FR-E1-05)
create function public.resolver_necesidad_si_corresponde()
returns trigger language plpgsql as $$
begin
  if new.faltante = 0 and new.estado = 'publicada' then
    new.estado := 'resuelta';
  end if;
  return new;
end;
$$;

create trigger trg_resolver_necesidad
  before update of cantidad_recibida on public.necesidades
  for each row execute function public.resolver_necesidad_si_corresponde();

-- ============================================================
-- 4. CENTROS DE ACOPIO (E3 — FR-E3-01)
-- ============================================================
create table public.centros_acopio (
  id uuid primary key default gen_random_uuid(),
  nodo_id uuid not null references public.nodos(id) on delete restrict,
  nombre text not null,
  ubicacion text not null,
  horario text not null,
  responsable_user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

comment on table public.centros_acopio is 'FR-E3-01. El responsable debe tener ya un rol registrado en el nodo (FR-E8-05/07) — bloqueo duro, ver trigger.';

-- Bloqueo duro: el responsable ya debe tener un rol en ese nodo (FR-E3-01, FR-E8-07)
create function public.exigir_rol_previo_responsable()
returns trigger language plpgsql as $$
begin
  if not exists (
    select 1 from public.usuario_roles ur
    where ur.user_id = new.responsable_user_id
      and ur.nodo_id = new.nodo_id
  ) then
    raise exception 'El responsable debe tener ya un rol registrado en este nodo (FR-E3-01, FR-E8-07)';
  end if;
  return new;
end;
$$;

create trigger trg_exigir_rol_responsable
  before insert or update of responsable_user_id, nodo_id on public.centros_acopio
  for each row execute function public.exigir_rol_previo_responsable();

-- ============================================================
-- 5. DONACIONES (E2 — FR-E2-02/03/04/05/06; E3-US-06 walk-in)
-- ============================================================
create type public.estado_donacion as enum ('comprometida', 'recibida');
create type public.origen_donacion as enum ('online', 'presencial');

create table public.donaciones (
  id uuid primary key default gen_random_uuid(),
  necesidad_id uuid references public.necesidades(id) on delete restrict,
  centro_id uuid not null references public.centros_acopio(id) on delete restrict,
  codigo text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  cantidad integer not null check (cantidad > 0),
  contacto_nombre text,
  contacto_telefono text,
  estado public.estado_donacion not null default 'comprometida',
  origen public.origen_donacion not null default 'online',
  recibida_por uuid references auth.users(id),
  recibida_en timestamptz,
  created_at timestamptz not null default now(),
  -- FR-E3-06: donación presencial nace directo en recibida, sin código
  -- previo que rastrear como promesa; contacto es opcional en ese caso.
  constraint online_requiere_contacto check (
    origen = 'presencial' or (contacto_nombre is not null and contacto_telefono is not null)
  )
);

comment on table public.donaciones is 'Sin reserva de faltante al comprometer (decisión 20 ago 2026) — no hay constraint de concurrencia acá a propósito.';

-- Recepción confirmada → genera entrada de inventario → recalcula faltante
-- de la necesidad asociada (FR-E2-04, FR-E3-04). Excedente o necesidad ya
-- descartada: la entrada se recibe igual (ver inventario_movimientos).
create function public.recibir_donacion()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.estado = 'recibida' and old.estado = 'comprometida' then
    new.recibida_en := now();
    insert into public.inventario_movimientos (centro_id, producto, tipo, cantidad, donacion_id, created_by)
    values (new.centro_id, coalesce((select categoria from public.necesidades where id = new.necesidad_id), 'sin categoría'), 'entrada', new.cantidad, new.id, new.recibida_por);
  end if;
  return new;
end;
$$;

create trigger trg_recibir_donacion
  before update of estado on public.donaciones
  for each row execute function public.recibir_donacion();

-- ============================================================
-- 6. INVENTARIO (E3 — FR-E3-03/04/05)
-- ============================================================
create type public.tipo_movimiento as enum ('entrada', 'salida');

create table public.inventario_movimientos (
  id uuid primary key default gen_random_uuid(),
  centro_id uuid not null references public.centros_acopio(id) on delete restrict,
  producto text not null,
  tipo public.tipo_movimiento not null,
  cantidad integer not null check (cantidad > 0),
  donacion_id uuid references public.donaciones(id),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

comment on table public.inventario_movimientos is 'Disponible se deriva de la suma de movimientos (vista inventario_disponible), nunca un contador editable.';

create view public.inventario_disponible as
  select centro_id, producto,
    sum(case when tipo = 'entrada' then cantidad else -cantidad end) as disponible
  from public.inventario_movimientos
  group by centro_id, producto;

-- Toda entrada asociada a una necesidad recalcula su cantidad_recibida
-- (FR-E3-04). Si la necesidad fue descartada, la entrada queda igual como
-- inventario general — no se actualiza ninguna necesidad (decisión 20 ago).
create function public.aplicar_entrada_a_necesidad()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_necesidad_id uuid;
begin
  if new.tipo = 'entrada' and new.donacion_id is not null then
    select necesidad_id into v_necesidad_id from public.donaciones where id = new.donacion_id;
    if v_necesidad_id is not null then
      update public.necesidades
      set cantidad_recibida = cantidad_recibida + new.cantidad
      where id = v_necesidad_id and estado in ('publicada', 'resuelta');
      -- estado != publicada/resuelta (ej. descartada): no se toca la
      -- necesidad, la entrada ya quedó registrada como inventario general.
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_aplicar_entrada
  after insert on public.inventario_movimientos
  for each row execute function public.aplicar_entrada_a_necesidad();

-- Bloqueo duro: salida no puede superar lo disponible (decisión 20 ago 2026)
create function public.bloquear_salida_excedente()
returns trigger language plpgsql set search_path = public as $$
declare
  v_disponible integer;
begin
  if new.tipo = 'salida' then
    select coalesce(disponible, 0) into v_disponible
    from public.inventario_disponible
    where centro_id = new.centro_id and producto = new.producto;
    if new.cantidad > coalesce(v_disponible, 0) then
      raise exception 'Salida (%) supera lo disponible (%) para % en este centro', new.cantidad, coalesce(v_disponible, 0), new.producto;
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_bloquear_salida
  before insert on public.inventario_movimientos
  for each row execute function public.bloquear_salida_excedente();

-- ============================================================
-- 7. AUDITORÍA (E9 — FR-E9-02)
-- ============================================================
create table public.auditoria (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  accion text not null,
  entidad text not null,
  entidad_id uuid not null,
  detalle jsonb,
  created_at timestamptz not null default now()
);

comment on table public.auditoria is 'Solo-append, quién/qué/cuándo (FR-E9-02). Escrita por triggers, no por el cliente.';

create function public.registrar_auditoria(p_accion text, p_entidad text, p_entidad_id uuid, p_detalle jsonb default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.auditoria (actor_user_id, accion, entidad, entidad_id, detalle)
  values (auth.uid(), p_accion, p_entidad, p_entidad_id, p_detalle);
end;
$$;

create function public.auditar_necesidad()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.estado is distinct from old.estado then
    perform public.registrar_auditoria(
      'cambio_estado_necesidad', 'necesidades', new.id,
      jsonb_build_object('de', old.estado, 'a', new.estado, 'motivo', new.motivo_descarte)
    );
  end if;
  return new;
end;
$$;

create trigger trg_auditar_necesidad
  after update of estado on public.necesidades
  for each row execute function public.auditar_necesidad();

-- ============================================================
-- 8. Contador público (FR-E9-01) y verificación por código (FR-E2-06)
-- ============================================================
create function public.contador_necesidades_resueltas()
returns bigint language sql stable set search_path = public as $$
  select count(*) from public.necesidades where estado = 'resuelta';
$$;

-- Consulta pública por código, sin exponer la tabla completa a anon (FR-E2-06)
create function public.buscar_donacion_por_codigo(p_codigo text)
returns table (codigo text, cantidad integer, estado public.estado_donacion, centro_nombre text)
language sql security definer stable set search_path = public as $$
  select d.codigo, d.cantidad, d.estado, c.nombre
  from public.donaciones d
  join public.centros_acopio c on c.id = d.centro_id
  where d.codigo = upper(p_codigo);
$$;
