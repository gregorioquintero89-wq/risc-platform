---
owner: Gregorio Quintero
status: draft
title: "US-E1-03 — El faltante se recalcula automáticamente con cada donación"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E1
---

# US-E1-03 — El faltante se recalcula automáticamente con cada donación

## Metadata

```yaml
Story ID: E1-US-03
Title: El faltante se recalcula automáticamente con cada donación
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

> **I want** que el faltante de una necesidad se recalcule automáticamente cada vez que se recibe una donación

> **So that** no tenga que actualizar el número a mano y pueda confiar en que refleja la realidad en el momento, sin intervención manual (OpenSpec G2).

---

## Business Context

Uno de los objetivos de negocio del OpenSpec es "cerrar el ciclo necesidad → donación sin intervención manual: que el faltante se actualice solo cuando entra una donación, no que alguien tenga que ir a corregir un número" (OpenSpec G2). El 20 de agosto de 2026, Gregorio Quintero cerró la decisión pendiente sobre qué pasa cuando donaciones concurrentes exceden el faltante de una necesidad (OpenSpec sección 6): se reciben igual, el faltante nunca es negativo, y el excedente queda como inventario del centro de acopio. Esta historia implementa esa regla y la fórmula de FR-E1-04.

---

## Acceptance Criteria

### AC-001

Given una necesidad publicada con faltante mayor a 0

When un centro de acopio confirma la recepción de una donación comprometida

Then el faltante se recalcula como máx(0, necesario − recibido) (FR-E1-04; OpenSpec AC-2).

---

### AC-002

Given varias donaciones concurrentes comprometidas para la misma necesidad cuya suma excede el faltante

When todas se reciben en el centro de acopio

Then todas se aceptan igual, el faltante nunca queda en un valor negativo, y el excedente queda como inventario disponible del centro de acopio — no se rechaza ni se redirige (OpenSpec sección 6, resuelto 20 ago 2026).

---

### AC-003

Given una donación está en estado `comprometida` (no `recibida`)

When se consulta el faltante de la necesidad asociada

Then el faltante no se reserva ni se descuenta hasta que el centro de acopio confirme la recepción (OpenSpec sección 6, resuelto 20 ago 2026; FR-E2-02, FR-E3-04).

---

## Business Rules

- FR-E1-04 — El faltante se calcula como máx(0, necesario − recibido) y se recalcula automáticamente con cada donación registrada; nunca es negativo.
- Decisión cerrada del 20 de agosto de 2026 (OpenSpec sección 6): el sistema no limita cuántas donaciones se pueden comprometer en simultáneo para una misma necesidad. No hay reglas adicionales de la sección 4 más allá de esta fórmula.

---

## Edge Cases

- Donaciones concurrentes que en conjunto exceden el faltante — resuelto 20 ago 2026: se reciben igual, el excedente queda como inventario del centro de acopio, el faltante nunca es negativo (OpenSpec sección 6).
- Una donación entregada no coincide con el código registrado → pasa a revisión de un operador, no se rechaza sola (OpenSpec sección 6). Este caso ocurre en E2/E3, antes de que la recepción se confirme; se menciona acá solo como precondición externa que puede retrasar el disparo del recálculo, no como parte del alcance de esta historia.

---

## Dependencies

**Internal Modules**
- E2 — Captación y trazabilidad de donaciones: una donación pasa de `comprometida` a `recibida` solo cuando el centro de acopio confirma la entrega (FR-E2-04).
- E3 — Operación de centros de acopio e inventario: registrar una entrada de inventario actualiza automáticamente el faltante de la necesidad asociada (FR-E3-04). El disparador vive en E3; el estado y el cálculo del faltante pertenecen a E1.

**External APIs**
- Ninguna prevista para R1 (PRD sección 12).

**Other Stories**
- US-E1-01 — la necesidad debe existir con una cantidad o alcance definido ("necesario").
- US-E1-02 — la necesidad debe estar `publicada` para que un donante pueda verla y comprometer una donación (FR-E2-01).

**Infrastructure**
- Pendiente de la fase de Architecture — el mecanismo de consistencia ante donaciones concurrentes no está definido a nivel de negocio.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo (ver README del repo). No inventar wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel:

- El recálculo debe ser consistente frente a donaciones concurrentes recibidas casi al mismo tiempo (OpenSpec sección 6); el mecanismo concreto es una decisión de Architecture, no de esta historia.
- El faltante nunca puede quedar en un valor negativo — se aplica el piso en 0 en cada recálculo (FR-E1-04).
- El recálculo es la consecuencia, dentro de E1, del evento de analítica `donacion_recibida` que se dispara en E2/E3 (PRD sección 14).

---

## Test Cases

### Unit Tests

- Validar que el faltante se calcula como máx(0, necesario − recibido).
- Validar que el faltante nunca resulta negativo aunque lo recibido supere lo necesario.

### Integration Tests

- Registrar la recepción de una donación y confirmar que el faltante de la necesidad asociada se recalcula.
- Registrar dos donaciones concurrentes que en conjunto exceden el faltante y confirmar que ambas se reciben, el faltante llega a 0 (no negativo) y el excedente queda como inventario del centro de acopio.
- Confirmar que una donación solo `comprometida` no afecta el faltante hasta que se confirma su recepción.

### Playwright E2E

- Como operador de centro de acopio, confirmar la recepción de una donación y verificar que el faltante mostrado de la necesidad se actualiza sin intervención del líder.

---

## Technical Tasks

- [ ] TASK-E1-US03-01 (Dominio/datos) — Modelar el faltante como valor derivado de necesario y recibido, sin permitir que se guarde o exponga un valor negativo.
- [ ] TASK-E1-US03-02 (Lógica de negocio) — Implementar la fórmula de recálculo del faltante (máx(0, necesario − recibido)) disparada por la confirmación de recepción de una donación.
- [ ] TASK-E1-US03-03 (Lógica de negocio) — Implementar el comportamiento ante donaciones concurrentes que en conjunto exceden el faltante: todas se aceptan, el faltante se satura en 0 y el excedente no se rechaza ni se redirige.
- [ ] TASK-E1-US03-04 (Lógica de negocio) — Confirmar que una donación en estado `comprometida` no afecta el cálculo del faltante hasta que pasa a `recibida`.
- [ ] TASK-E1-US03-05 (Tests unit/integration) — Cubrir la fórmula de recálculo, el piso en 0, el escenario de donaciones concurrentes que exceden el faltante y la diferencia entre `comprometida` y `recibida`.
- [ ] TASK-E1-US03-06 (Tests E2E) — Automatizar la confirmación de recepción de una donación y verificar que el faltante mostrado de la necesidad se actualiza sin intervención del líder.

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

**M — 1 a 2 días.** La fórmula es simple, pero el comportamiento de concurrencia (piso en 0, aceptar donaciones que en conjunto exceden el faltante, no bloquear ni redirigir el excedente) agrega casos de prueba y coordinación con E2/E3 que superan una historia S.
