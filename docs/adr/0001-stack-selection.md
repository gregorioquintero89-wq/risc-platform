---
owner: Gregorio Quintero
status: approved
title: "ADR-0001 — Selección de stack"
type: architecture
version: 1
date: 2026-08-21
approved_by: Gregorio Quintero (mandato confirmado de Cristian)
tier: 3
tags:
  - risc
  - adr
---

# ADR-0001 — Selección de stack tecnológico

> Primer ADR del repo, según `26-VerticalOS-Starter-Kit.md` paso 3: acá —
> y solo acá — se declara el stack real. El playbook nunca pinea
> tecnología; el proyecto sí. Cada elección cita qué principio de
> `09 Architecture Principles.md` satisface, como exige el Starter Kit.

## Contexto

R1 de RISC (`docs/vertical-os/03-PRD.md`) cubre 5 epics — gestión de
necesidades, donaciones, centros de acopio, red de roles/nodos,
transparencia — con 24 User Stories y sus Technical Tasks ya cerradas,
sin nombrar tecnología (por diseño, ver `epics/README.md`). La decisión
de stack no podía tomarse antes porque OpenSpec/PRD/Epics/User
Stories son business-language puro; recién acá hay entidades,
reglas y flujos completos contra los que evaluar tecnología real.

Restricciones que vienen del negocio, no de preferencia técnica:

- **BR-06 (OpenSpec)**: el contacto de familias/propietarios solo lo ve
  el líder de su nodo — restricción **estructural**, no de lógica de
  aplicación (decisión cerrada desde el vault, reafirmada en OpenSpec).
- **G5 (OpenSpec)**: ventana operativa de una emergencia medida en
  semanas — el costo de una arquitectura compleja de armar pesa más
  que en un proyecto sin presión de tiempo.
- **Objetivo técnico (PRD sección 5)**: debe funcionar bien en datos
  móviles limitados — los líderes coordinan por teléfono en plena
  crisis.
- Equipo real: Gregorio Quintero como único desarrollador hoy, bajo
  mandato de Cristian. No hay equipo grande que coordinar todavía.

## Decisión

| Capa | Elección |
|---|---|
| Lenguaje | TypeScript |
| Framework | Next.js (App Router), Server Components + Server Actions |
| Base de datos | PostgreSQL, vía Supabase |
| Auth | Supabase Auth |
| Acceso a datos | Cliente JS de Supabase + tipos generados (`supabase gen types typescript`) — **sin ORM aparte** |
| Autorización | Row Level Security (RLS) en Postgres, no lógica de aplicación |
| Testing | Vitest (unit/integration) + Playwright (E2E) |
| CI | GitHub Actions |
| Despliegue | Vercel (Next.js) + Supabase Cloud |
| Estructura del repo | Un solo paquete Next.js — **sin monorepo** |
| Flujo de Git | Commit directo a `main` (excepción de equipo chico, ver sección propia) |

## Por qué cada elección (atado a `09 Architecture Principles.md`)

### Next.js + Supabase, sin ORM aparte

**Principio 5 — Persistence Follows the Data**: los datos de RISC
(necesidades, donaciones, centros, inventario, nodos, usuarios/roles,
auditoría) son relacionales con reglas de integridad reales (FR-E1-04,
FR-E3-03/04) — PostgreSQL es la elección por defecto del principio, no
una preferencia.

**Por qué sin ORM (Prisma, Drizzle, etc.)**: BR-06 exige que la
protección de contacto sea estructural. `22-Security-Standards.md` lo
dice explícito: *"El backend que usa la service_role key bypasea RLS
por completo."* La mayoría de los ORMs se conectan con una sola
credencial de servicio que salta RLS — hay que reconstruir a mano el
contexto de usuario en cada query para que la protección siga
aplicando. El cliente JS de Supabase pasa el JWT del usuario en cada
request por diseño: RLS se aplica siempre, sin que el desarrollador
tenga que acordarse. Coherente con el Principio 3 (Separation of
Concerns) — la base de datos hace cumplir el aislamiento, no la capa
de aplicación — y con el Golden Rule del propio documento de
principios: *"Simplicity before complexity."* Agregar un ORM acá no
resuelve un problema real, agrega una capa que puede romper
silenciosamente la garantía de seguridad más importante del proyecto.

### Sin monorepo — un solo paquete Next.js

**Principio 9 — Evolution Over Perfection** + ADR-002 del playbook
("Modular Monolith First"): R1 no tiene ninguna razón de negocio para
separar frontend/backend en despliegues distintos. `21-CI-CD-Standards.md`
documenta una sesión entera perdida en Can Friend Studio por problemas
de Root Directory y linking en un monorepo Turborepo — esa clase
completa de bug no existe si no hay monorepo. Se reconsidera si React
Native u otro cliente además del web entra en un release futuro.

### GitHub Actions

`21-CI-CD-Standards.md` deja el proveedor de CI como decisión de cada
ADR. GitHub Actions porque el repo ya vive en GitHub y no agrega una
cuenta/servicio nuevo — Golden Rule "Simplicity before complexity"
otra vez.

### Vercel + Supabase Cloud

Ya era la hipótesis de trabajo del README, ahora confirmada: Vercel es
el despliegue nativo de Next.js (cero configuración de servidor);
Supabase Cloud da Postgres + Auth + RLS gestionados sin operar
infraestructura propia — relevante con un solo desarrollador y ventana
de semanas (G5).

### Vitest + Playwright

Directo de `06-Testing-Strategy.md`: Vitest es "el runner real
recomendado por defecto" para frontend/Next.js; Playwright para los
journeys críticos (PRD sección 8): reportar→verificar→publicar,
comprometer→recibir donación.

## Core Platform — Auth/Multi-tenancy (Principio 4 + `25-Core-Module-Strategy.md`)

`25-Core-Module-Strategy.md` clasifica **Auth/Multi-tenancy como Core
Mandatorio**: *"se asume desde el día uno, no requiere evidencia — es
infraestructura base de cualquier negocio de servicios."* Esto aplica
directo al modelo de roles y nodos de E8 (líder, suplente, operador,
admin nacional — FR-E8-02/04/06/07).

**Lo que esto significa para R1**: el modelo de roles se construye
siguiendo el patrón genérico que el propio Core Module Strategy ya
documentó como evidencia real (Can Friend Studio, jul. 2026) — guard
de roles *fail-closed* por defecto (cualquier acción sin rol explícito
se rechaza, no se permite por omisión) y roles como valores
configurables, no lógica hardcodeada por nombre. Esto no es
opcional: FR-E8-03 (aislamiento por nodo) y BR-06 dependen de que el
guard sea fail-closed.

**Lo que NO se resuelve acá**: no tengo evidencia, desde este repo, de
que exista hoy un paquete de Core Auth/Multi-tenancy ya publicado y
consumible (Rule of Three exige que aparezca en dos verticales
independientes antes de extraerse — Can Friend Studio es el primer
punto de datos, RISC podría ser el segundo, pero eso lo confirma el
equipo de plataforma, no yo desde acá). **Dependencia abierta, no
inventada**: confirmar con el equipo de plataforma / Cristian si existe
un paquete Core consumible antes de escribir el modelo de roles de
E8, o si RISC lo construye "con forma de Core" para quedar listo para
extracción futura sin bloquear R1 mientras tanto.

## E5 (banco de viviendas) y Propertia — no se resuelve en este ADR

Business Discovery ya marcó el posible solape de E5 con Propertia
como candidato a Rule of Three. E5 no entra en R1 (es R1.5/R2) — este
ADR no elige nada para E5. Se revisa contra `25-Core-Module-Strategy`
cuando E5 se especifique en User Stories, no antes.

## Flujo de Git — excepción de equipo chico

`07-Git-Workflow.md` y `21-CI-CD-Standards.md` documentan
explícitamente una excepción para proyectos solo-founder en etapa
temprana: commitear directo a `main` es válido cuando quien commitea
es quien revisa el resultado en el momento — el costo que el flujo de
feature-branch + PR evita (coordinar varias personas sin pisarse) no
existe todavía con un solo desarrollador. Se adopta esa excepción para
RISC hoy. La disciplina que igual se mantiene: commits atómicos y
enfocados, y revisión adversarial de contexto fresco antes de cada
commit no trivial (`06-Testing-Strategy.md`) en vez del revisor humano
de un PR. Se reconsidera apenas se sume una segunda persona
desarrollando en paralelo.

## Alternativas consideradas y descartadas

- **NestJS + API separada**: descartado — R1 no tiene ningún requisito
  (integración externa pesada, equipo de backend separado) que
  justifique separar frontend y backend. Next.js API routes/Server
  Actions ya cubren FR-E1 a FR-E9 sin esa complejidad.
- **Prisma/Drizzle sobre Supabase**: descartado por el riesgo de RLS
  explicado arriba — no por rendimiento ni preferencia.
- **Monorepo (Turborepo/pnpm workspaces)**: descartado — sin
  evidencia de necesidad real en R1, y con una clase de bugs
  documentada que evitar (`21-CI-CD-Standards.md`).

## Reconsiderar cuando

- Entra un segundo cliente real además del web (app nativa, integración
  externa pesante) → reconsiderar monorepo.
- Se suma una segunda persona desarrollando en paralelo → volver al
  flujo estándar de feature-branch + PR.
- El equipo de plataforma confirma (o descarta) un paquete Core de
  Auth/Multi-tenancy consumible → ajustar cómo se construye E8.
- E5 entra en alcance (R1.5/R2) → revisar contra Core Module Strategy
  antes de especificar sus User Stories.

## AI Checklist (`09 Architecture Principles.md`)

- [x] Domain understood — 24 User Stories y sus reglas de negocio ya
      cerradas antes de este ADR.
- [x] Existing architecture reviewed — el borrador del README se tomó
      como hipótesis de partida, no como decisión ya cerrada.
- [x] Core modules evaluated — Auth/Multi-tenancy (Core Mandatorio) y
      E5/Propertia (candidato Rule of Three) evaluados explícitamente.
- [x] Simpler alternatives considered — NestJS separado, ORM, monorepo,
      todos descartados con motivo.
- [x] Documentation will be updated — README y CLAUDE.md del proyecto
      se actualizan a continuación de este ADR.
