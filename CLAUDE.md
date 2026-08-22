# RISC — CLAUDE.md del proyecto

Contrato mínimo para agentes de IA trabajando en este repo, según
`19-AI-Agent-Standards.md` del playbook VerticalOS. Este archivo
**resume** el stack — la decisión completa, con su razonamiento, vive
en `docs/adr/0001-stack-selection.md`. Si algo acá y el ADR difieren,
gana el ADR.

## Stack real

- **Lenguaje**: TypeScript
- **Framework**: Next.js (App Router), Server Components + Server Actions
- **Base de datos**: PostgreSQL vía Supabase
- **Auth**: Supabase Auth
- **Acceso a datos**: cliente JS de Supabase + tipos generados — sin ORM aparte (motivo: RLS, ver ADR-0001)
- **Autorización**: Row Level Security en Postgres — nunca lógica de aplicación para aislar datos por nodo
- **Monorepo**: no. Un solo paquete Next.js.
- **Gestor de paquetes**: npm

## Comandos

```bash
npm test          # Vitest — unit + integration
npm run test:e2e  # Playwright — journeys críticos
npm run build     # build de producción, obligatorio en verde antes de mergear
```

## Strict TDD

**Activo.** Especificación → test → implementación → refactor → tests
en verde (`06-Testing-Strategy.md`). No se escribe código de negocio
sin un test que falle primero.

## Módulos de Core Platform activados

Ninguno **opcional** (`inventory_ecommerce`, `inventory_operational`,
`payroll` no aplican al alcance de RISC — no vende productos ni tiene
nómina). Auth/Multi-tenancy es **Core Mandatorio** — siempre activo,
no aparece en manifiesto (`25-Core-Module-Strategy.md`). Ver ADR-0001,
sección "Core Platform", para la dependencia abierta sobre si existe
un paquete Core de Auth consumible hoy.

## Rutas clave

| Qué | Dónde |
|---|---|
| Pipeline de producto (Business Discovery → OpenSpec → PRD → Epics → User Stories → Technical Tasks) | `docs/vertical-os/` |
| ADRs (decisiones de arquitectura) | `docs/adr/` |
| Contexto de negocio y decisiones cerradas con el cliente | `~/Desktop/risc-vault` (Obsidian, fuera de este repo) |
| Estándares del playbook VerticalOS (fuente de todas las reglas de arriba) | `~/Desktop/Vertical OS-Play book` |

## Flujo de Git

Commit directo a `main` — excepción documentada de equipo chico
(`07-Git-Workflow.md`, `21-CI-CD-Standards.md`), válida mientras
Gregorio Quintero sea el único desarrollador. Se mantiene igual:
commits atómicos y enfocados, y revisión adversarial de contexto
fresco antes de cada commit no trivial. Se reconsidera al sumar una
segunda persona desarrollando en paralelo.

## Reglas que no se negocian (heredadas de OpenSpec, no repetir la lógica de negocio acá)

- El contacto de familias/propietarios solo lo ve el líder de su nodo — RLS, no lógica de aplicación.
- Nada se publica sin verificación humana.
- RISC no recibe, custodia ni intermedia dinero.
- Guard de roles fail-closed por defecto — sin rol explícito, sin acceso.

Para el detalle de negocio de cada regla, leer `docs/vertical-os/02-OpenSpec.md`, no asumir desde acá.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
