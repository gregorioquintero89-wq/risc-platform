---
owner: Gregorio Quintero
status: draft
title: "US-E1-04 — La necesidad pasa a resuelta automáticamente al llegar el faltante a 0"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E1
---

# US-E1-04 — La necesidad pasa a resuelta automáticamente al llegar el faltante a 0

## Metadata

```yaml
Story ID: E1-US-04
Title: La necesidad pasa a resuelta automáticamente al llegar el faltante a 0
Business Capability: E1 — Gestión de necesidades verificadas
Epic: E1
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** líder RISC de ciudad

> **I want** que una necesidad publicada pase automáticamente a resuelta cuando su faltante llega a 0

> **So that** no tenga que cerrarla a mano y el sistema cierre el ciclo necesidad → donación sin pasos manuales de actualización (PRD sección 5, objetivos de producto; OpenSpec G2).

---

## Business Context

La Epic E1 ya deja explícito que "el faltante se calcula como necesario − recibido y se recalcula automáticamente con cada donación registrada (FR-E1-04); la necesidad pasa a resuelta sola cuando el faltante llega a 0 (FR-E1-05) — el disparador de esta transición vive en E2/E3, pero el estado y el cálculo pertenecen a E1" (Epic E1, Acceptance Criteria). Esta historia es esa transición de estado: el cierre del ciclo sin que el líder tenga que intervenir para marcar una necesidad como resuelta.

---

## Acceptance Criteria

### AC-001

Given una necesidad publicada cuyo faltante se recalcula a 0 (ver US-E1-03)

When ocurre ese recálculo

Then la necesidad pasa a estado `resuelta` sin acción manual del líder (FR-E1-05).

---

### AC-002

Given una necesidad publicada cuyo faltante, tras un recálculo, sigue siendo mayor a 0

When se recalcula el faltante

Then la necesidad permanece en `publicada` — no cambia de estado hasta que el faltante llegue exactamente a 0.

---

## Business Rules

- BR-02 — Cuatro estados de necesidad: la transición `publicada` → `resuelta` es automática y no requiere acción del líder.
- FR-E1-05 — Una necesidad pasa a `resuelta` automáticamente cuando el faltante llega a 0.

---

## Edge Cases

OpenSpec sección 6 no documenta casos límite específicos para la transición automática a `resuelta` más allá de los ya cubiertos en US-E1-03 (piso en 0, donaciones concurrentes). No se agregan casos límite no documentados en las fuentes.

---

## Dependencies

**Internal Modules**
- Ninguno adicional a lo ya declarado en US-E1-03 (E2, E3 como origen del evento que dispara el recálculo).

**External APIs**
- Ninguna prevista para R1 (PRD sección 12).

**Other Stories**
- US-E1-03 — el recálculo del faltante es precondición: no se puede resolver automáticamente lo que no se recalcula.
- US-E1-02 — solo una necesidad `publicada` puede llegar a `resuelta`; una necesidad `descartada` no aplica.

**Infrastructure**
- Pendiente de la fase de Architecture — PRD sección 12.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo (ver README del repo). No inventar wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel:

- La transición de estado debe ser consecuencia directa del recálculo de US-E1-03, no una verificación periódica aparte.
- Debe disparar el evento de analítica `necesidad_resuelta` (PRD sección 14).
- Alimenta directamente los KPIs "necesidades resueltas / necesidades publicadas" y "tiempo promedio entre publicación y resolución" (PRD sección 16; Epic E1, Success Metrics).

---

## Test Cases

### Unit Tests

- Validar que una necesidad publicada cambia a `resuelta` exactamente cuando el faltante llega a 0.
- Validar que una necesidad publicada con faltante mayor a 0 no cambia de estado.

### Integration Tests

- Simular una secuencia de donaciones recibidas que llevan el faltante de una necesidad publicada a 0 y confirmar que la necesidad queda en estado `resuelta` sin intervención manual.

### Playwright E2E

- Como líder, observar una necesidad publicada mientras se registran donaciones hasta cubrir el faltante, y verificar que su estado cambia a resuelta sin que el líder ejecute ninguna acción.

---

## Technical Tasks

- [ ] TASK-E1-US04-01 (Dominio/datos) — Modelar la transición de estado `publicada` → `resuelta` como consecuencia de que el faltante llegue exactamente a 0.
- [ ] TASK-E1-US04-02 (Lógica de negocio) — Implementar el disparo automático de esa transición como reacción directa al evento de recálculo de US-E1-03, sin verificación periódica separada ni acción manual del líder.
- [ ] TASK-E1-US04-03 (Lógica de negocio) — Confirmar que una necesidad permanece en `publicada` cuando, tras un recálculo, el faltante sigue siendo mayor a 0.
- [ ] TASK-E1-US04-04 (Tests unit/integration) — Cubrir la transición exacta a `resuelta` cuando el faltante llega a 0 y la permanencia en `publicada` cuando no, incluyendo una secuencia simulada de donaciones.
- [ ] TASK-E1-US04-05 (Tests E2E) — Automatizar la observación de una necesidad publicada mientras se registran donaciones hasta cubrir el faltante, verificando el cambio automático a resuelta.

---

## Definition of Done

This Story is complete when:

- Acceptance Criteria satisfied.
- Unit Tests pass.
- Integration Tests pass.
- Playwright tests pass.
- Documentation updated.
- Product Owner approves.

---

## Story Sizing

**S — Media jornada.** Es una transición de estado disparada por un evento ya cubierto por US-E1-03; no agrega cálculo nuevo, solo la regla de corte en 0.
