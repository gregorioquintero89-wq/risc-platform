---
owner: Gregorio Quintero
status: draft
title: "US-E2-01 — Ver necesidades publicadas y filtrar"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E2
---

# US-E2-01 — Ver necesidades publicadas y filtrar por ciudad/categoría

## Metadata

```yaml
Story ID: E2-US-01
Title: Ver necesidades publicadas y filtrar por ciudad/categoría
Business Capability: E2 — Captación y trazabilidad de donaciones
Epic: E2
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** donante

> **I want** ver las necesidades publicadas y filtrarlas por ciudad y categoría

> **So that** pueda encontrar rápido dónde ayuda mi donación, sin depender de un hilo de WhatsApp o Instagram para saber qué hace falta.

---

## Business Context

Hoy la coordinación vive en WhatsApp e Instagram: no guardan estado y un donante no puede saber, sin preguntarle a alguien, qué falta y dónde (PRD sección 3, "Dolor"). Esta story reemplaza esa dependencia por un portal público de solo lectura donde el donante ve las necesidades ya verificadas y publicadas por un líder (FR-E1-03), y las filtra por ciudad y categoría (FR-E2-01). Es el primer paso del journey principal de donante (PRD sección 8).

---

## Acceptance Criteria

### AC-001

Given hay necesidades en estado `publicada`

When el donante abre el portal público

Then ve la lista de esas necesidades con ciudad, categoría y faltante.

---

### AC-002

Given el donante está viendo la lista de necesidades publicadas

When selecciona un filtro de ciudad

Then la lista solo muestra necesidades publicadas de esa ciudad.

---

### AC-003

Given el donante está viendo la lista de necesidades publicadas

When selecciona un filtro de categoría

Then la lista solo muestra necesidades publicadas de esa categoría.

---

### AC-004

Given una necesidad está en estado `reportada` o `descartada`

When el donante visita el portal público

Then esa necesidad no aparece en la lista (FR-E1-02).

---

## Business Rules

- Solo las necesidades en estado `publicada` son visibles públicamente; una necesidad `reportada` no se muestra hasta que un líder la verifique (FR-E1-02, FR-E1-03).
- No existe campo de prioridad editable; la lista no se ordena por eso — el orden se deriva de fecha límite y faltante (BR-03, FR-E1-06).
- El faltante mostrado se calcula como máx(0, necesario − recibido) y nunca es negativo (FR-E1-04).
- No se requiere cuenta para ver o filtrar necesidades — es parte del portal público sin cuenta (PRD sección 13).

---

## Edge Cases

- No hay necesidades publicadas para la ciudad/categoría filtrada → se muestra un estado vacío, no un error.
- Conexión de datos móvil limitada → la carga debe funcionar igual; es el contexto real de uso en emergencia, no wifi de oficina (NFR performance, PRD sección 10).
- Una necesidad llega a faltante 0 y pasa automáticamente a `resuelta` (FR-E1-05) → deja de listarse como necesidad activa con faltante pendiente.

---

## Dependencies

**Internal Modules**
- E1 (Gestión de necesidades verificadas) — depende de que existan necesidades en estado `publicada` (FR-E1-03).

**External APIs**
- Ninguna.

**Other Stories**
- Ninguna dependencia previa dentro de E2. US-E2-02 depende de que el donante llegue a esta vista primero.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar wireframes acá.

---

## Technical Notes

Requiere lectura pública (sin autenticación) de necesidades filtrables por ciudad y categoría. No debe exponer datos de contacto de familias o propietarios (BR-06) — esta story solo lista necesidades, no personas.

---

## Test Cases

### Unit Tests

- Cálculo/formato del faltante mostrado: máx(0, necesario − recibido).
- Lógica de filtro combinando ciudad + categoría.

### Integration Tests

- El listado público excluye necesidades en estado `reportada` y `descartada`.
- El filtro por ciudad y por categoría devuelve solo necesidades `publicada` que cumplen el criterio.

### Playwright E2E

- El donante abre el portal público y ve la lista de necesidades publicadas.
- El donante aplica un filtro de ciudad y ve solo esas necesidades.
- El donante aplica un filtro de categoría y ve el estado vacío cuando no hay resultados.

---

## Technical Tasks

- [ ] **TASK-E2-US01-01** — Lógica de negocio: implementar el filtro combinado por ciudad y categoría sobre necesidades en estado `publicada`, excluyendo `reportada` y `descartada` (FR-E1-02, FR-E2-01).
- [ ] **TASK-E2-US01-02** — Interfaz: construir la vista pública de listado de necesidades con filtros de ciudad y categoría y estado vacío cuando no hay resultados, sin necesidad de cuenta (mockup de accesos por rol pendiente — no diseñar de nuevo).
- [ ] **TASK-E2-US01-03** — Tests (unit): filtro combinado ciudad + categoría.
- [ ] **TASK-E2-US01-04** — Tests (integration): el listado público excluye necesidades `reportada` y `descartada`; el filtro por ciudad y por categoría devuelve solo necesidades `publicada` que cumplen el criterio.
- [ ] **TASK-E2-US01-05** — Tests (E2E): el donante abre el portal, ve el listado, aplica filtro de ciudad, y aplica filtro de categoría viendo el estado vacío cuando no hay resultados.

---

## Definition of Done

- [ ] Acceptance Criteria satisfied.
- [ ] Unit Tests pass.
- [ ] Integration Tests pass.
- [ ] Playwright tests pass.
- [ ] Documentation updated.
- [ ] Product Owner approves.

---

## Story Sizing

**S — Half day.** Vista de lectura con filtros, sin lógica de negocio compleja; el cálculo del faltante ya existe en E1 (FR-E1-04).
