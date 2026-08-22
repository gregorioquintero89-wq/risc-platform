---
owner: Gregorio Quintero
status: draft
title: "US-E2-03 — Confirmar recepción de una donación"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E2
---

# US-E2-03 — Confirmar recepción de una donación en el centro de acopio

## Metadata

```yaml
Story ID: E2-US-03
Title: Confirmar recepción de una donación en el centro de acopio
Business Capability: E2 — Captación y trazabilidad de donaciones
Epic: E2
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** operador de centro de acopio

> **I want** confirmar la recepción de una donación comprometida

> **So that** el estado de la donación refleje que efectivamente llegó y el faltante de la necesidad asociada se actualice solo, sin que nadie tenga que corregir un número a mano.

---

## Business Context

Es el evento que efectivamente cierra el ciclo necesidad → donación (OpenSpec G2): no el compromiso (US-E2-02), sino la confirmación física de entrega. Reemplaza la corrección manual de números que hoy ocurre sobre WhatsApp por un recálculo automático del faltante en el momento en que el centro de acopio confirma (FR-E3-04).

---

## Acceptance Criteria

### AC-001

Given una donación está en estado `comprometida`

When el operador del centro de acopio confirma la recepción

Then el estado de la donación pasa a `recibida` (FR-E2-04).

---

### AC-002

Given el centro de acopio confirma la recepción de una donación

When se confirma

Then el faltante de la necesidad asociada se recalcula automáticamente (FR-E3-04).

---

### AC-003

Given el faltante de la necesidad llega a 0 tras recalcularse

When eso ocurre

Then la necesidad pasa a `resuelta` automáticamente, sin acción manual del líder (FR-E1-05).

---

### AC-004

Given una donación aún no ha sido confirmada por el centro de acopio

When se consulta su estado

Then permanece en `comprometida` (no `recibida`) hasta la confirmación (FR-E2-04).

---

## Business Rules

- El estado de una donación pasa de `comprometida` a `recibida` solo cuando el centro de acopio confirma la entrega (FR-E2-04) — no hay confirmación automática ni por parte del donante.
- Registrar la recepción actualiza automáticamente el faltante de la necesidad asociada (FR-E3-04).
- El faltante nunca es negativo: se calcula como máx(0, necesario − recibido) (FR-E1-04); si lo recibido excede lo necesario, el faltante queda en 0 y el excedente queda como inventario del centro de acopio (OpenSpec sección 6).
- Una necesidad pasa a `resuelta` automáticamente cuando el faltante llega a 0, sin acción manual del líder (FR-E1-05).

---

## Edge Cases

- La recepción confirmada hace que el faltante llegue a 0 mientras existen otras donaciones aún `comprometidas` para la misma necesidad → al confirmarse, esas donaciones contribuyen a inventario excedente del centro, no se rechazan (OpenSpec sección 6, decisión cerrada 20 ago 2026).
- El operador intenta confirmar una recepción pero el código presentado no coincide con ninguna donación registrada → no es el flujo de esta story, ver US-E2-04 (FR-E2-05).

---

## Dependencies

**Internal Modules**
- E3 (Operación de centros de acopio e inventario) — el rol de operador y el registro de recepción de inventario viven en esa epic (FR-E3-02); esta story es el lado de E2 que reacciona a esa confirmación.

**External APIs**
- Ninguna.

**Other Stories**
- US-E2-02 — depende de que exista una donación en estado `comprometida` con código.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar wireframes acá.

---

## Technical Notes

La confirmación de recepción dispara el recálculo del faltante y, en cascada, la transición de la necesidad a `resuelta` cuando corresponda. Esta story no describe mecanismo de concurrencia ni transacciones a nivel de implementación — eso es alcance de Architecture.

---

## Test Cases

### Unit Tests

- Transición de estado de la donación: `comprometida` → `recibida`.
- Recálculo del faltante como máx(0, necesario − recibido).

### Integration Tests

- Confirmar la recepción de una donación actualiza el faltante de la necesidad asociada.
- Si el faltante llega a 0 tras la confirmación, la necesidad pasa a `resuelta` automáticamente, sin acción del líder.

### Playwright E2E

- El operador confirma la recepción de una donación desde el panel del centro de acopio y ve el estado actualizado a `recibida`.

---

## Technical Tasks

- [ ] **TASK-E2-US03-01** — Dominio/datos: modelar la transición de estado de la donación de `comprometida` a `recibida` como resultado de la confirmación del operador.
- [ ] **TASK-E2-US03-02** — Lógica de negocio: implementar el recálculo automático del faltante de la necesidad asociada como máx(0, necesario − recibido) al confirmarse la recepción (FR-E3-04).
- [ ] **TASK-E2-US03-03** — Lógica de negocio: implementar la transición en cascada de la necesidad a `resuelta` cuando el faltante recalculado llega a 0, sin acción manual del líder (FR-E1-05).
- [ ] **TASK-E2-US03-04** — Interfaz: construir la acción de confirmación de recepción en el panel del operador del centro de acopio, reflejando el estado actualizado a `recibida`.
- [ ] **TASK-E2-US03-05** — Tests (unit): transición de estado `comprometida` → `recibida` y recálculo del faltante.
- [ ] **TASK-E2-US03-06** — Tests (integration + E2E): confirmar la recepción actualiza el faltante y dispara la transición a `resuelta` cuando corresponde; flujo del operador confirmando desde el panel y viendo el estado actualizado.

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

**M — 1–2 días.** Coordina dos transiciones de estado (donación y, en cascada, necesidad) e integra con el recálculo automático del faltante definido en E3 (FR-E3-04); necesita cobertura de test para el caso de excedente.
