---
owner: Gregorio Quintero
status: draft
title: "US-E3-04 — Actualizar el faltante al registrar una entrada de inventario"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E3
---

# US-E3-04 — Actualizar el faltante al registrar una entrada de inventario

## Metadata

```yaml
Story ID: E3-US-04
Title: Una entrada de inventario actualiza automáticamente el faltante de la necesidad asociada
Business Capability: E3 — Operación de centros de acopio e inventario
Epic: E3
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As an** operador de centro de acopio

> **I want** que al registrar la entrada de una donación el faltante
> de la necesidad asociada se actualice solo

> **So that** nadie tenga que corregir el número a mano y el ciclo
> necesidad → donación se cierre sin intervención manual

---

## Business Context

Este es el objetivo central de la epic (G2 del OpenSpec): que el
faltante se actualice solo cuando entra una donación, no que alguien
tenga que ir a corregir un número. Sin esta historia, el registro de
inventario (US-03) y la verificación de necesidades (E1) quedan
desconectados, y RISC vuelve al mismo problema que busca resolver —
coordinación que depende de que alguien recuerde actualizar algo a
mano.

---

## Acceptance Criteria

### AC-001

Given que una necesidad publicada tiene faltante mayor a 0

When el centro de acopio registra la recepción de una donación
comprometida asociada a esa necesidad (US-02, US-03)

Then el faltante se recalcula automáticamente, sin intervención manual
(FR-E3-04; AC-2 de OpenSpec).

---

### AC-002

Given que el faltante de una necesidad llega a 0 tras registrar una
entrada de inventario

When se guarda esa actualización

Then la necesidad pasa a estado `resuelta` automáticamente, sin acción
del líder (FR-E1-05).

---

### AC-003

Given que donaciones concurrentes, en conjunto, superan el faltante de
una necesidad

When se registran sus entradas de inventario

Then el faltante nunca queda negativo — se calcula como máx(0,
necesario − recibido) — y el excedente queda como inventario
disponible del centro (FR-E1-04, sección 6 de OpenSpec).

---

## Business Rules

- FR-E3-04 — Registrar una entrada de inventario actualiza
  automáticamente el faltante de la necesidad asociada.
- FR-E1-04 — El faltante se calcula como máx(0, necesario − recibido)
  y se recalcula automáticamente con cada donación registrada. Nunca
  es negativo.
- FR-E1-05 — Una necesidad pasa a `resuelta` automáticamente cuando el
  faltante llega a 0, sin acción manual del líder.
- Sección 6 de OpenSpec (resuelto, 20 ago 2026) — el faltante no se
  reserva en el momento en que una donación se compromete (FR-E2-02);
  solo se resta cuando el centro de acopio confirma la recepción
  (FR-E3-04). No hay límite de donaciones que se pueden comprometer en
  simultáneo para una misma necesidad.

---

## Edge Cases

- Donaciones concurrentes exceden el faltante de la necesidad → se
  reciben igual, el excedente queda como inventario disponible del
  centro, y el faltante nunca es negativo (resuelto, OpenSpec sección
  6).
- Se registra una entrada de inventario asociada a una necesidad que
  ya está `resuelta` (llegó a 0 por otra donación) — aplica la misma
  fórmula máx(0, necesario − recibido): el faltante permanece en 0 y
  la entrada completa queda como excedente/inventario del centro; no
  es un caso nuevo, es la fórmula ya resuelta aplicada a este
  escenario.
- ~~Una donación comprometida para una necesidad que fue `descartada`
  antes de confirmarse la recepción.~~ Resuelto (Gregorio Quintero, 20
  ago 2026): la entrada se recibe igual y **pasa a inventario general
  del centro**, disponible para la próxima necesidad del mismo
  producto — mismo criterio que el excedente por donaciones
  concurrentes (OpenSpec sección 6, FR-E3-04).

---

## Dependencies

**Internal Modules**
- E1 (Gestión de necesidades verificadas) — el faltante que se
  actualiza pertenece a una necesidad `publicada` de E1 (FR-E1-04,
  FR-E1-05).
- E2 (Captación y trazabilidad de donaciones) — depende de que exista
  una donación `comprometida` asociada a la necesidad (FR-E2-02).

**External APIs**
- Ninguna prevista para R1.

**Other Stories**
- US-03 — requiere que exista una entrada de inventario registrada
  para poder disparar el recálculo.
- US-02 — la entrada de inventario nace, en el caso normal, de una
  recepción de donación confirmada.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Lógica derivada, no un flujo separado que el usuario dispare a mano:
cada entrada de inventario asociada a una necesidad debe disparar el
recálculo del faltante de esa necesidad, usando el mismo cálculo que
FR-E1-04, y, si corresponde, el cambio de estado a `resuelta`
(FR-E1-05). Requiere que la entrada de inventario quede vinculada a la
necesidad, no solo al producto y al centro. Sin detalles de esquema ni
stack — corresponde a la fase de Architecture.

---

## Test Cases

### Unit Tests

- Validar que el faltante se recalcula como máx(0, necesario −
  recibido) tras cada entrada de inventario asociada.
- Validar que el faltante nunca resulta negativo aunque la entrada
  registrada supere el faltante restante.
- Validar que la necesidad cambia a `resuelta` exactamente cuando el
  faltante llega a 0, y no antes.

### Integration Tests

- Registrar la recepción de una donación (US-02) asociada a una
  necesidad publicada actualiza el faltante de esa necesidad sin
  acción manual adicional.
- Dos donaciones concurrentes que en conjunto exceden el faltante se
  reciben ambas; el faltante llega a 0 y el excedente queda como
  inventario del centro.
- Una entrada de inventario asociada a una necesidad ya `descartada`
  se recibe igual y pasa a inventario general del centro, sin intentar
  recalcular el faltante de esa necesidad.

### Playwright E2E

- Flujo completo: se publica una necesidad con faltante, se compromete
  y recibe una donación que lo cubre por completo, y la necesidad
  aparece como `resuelta` sin que nadie la edite manualmente.
- Flujo de excedente: el faltante llega a 0 tras una entrada parcial y
  el resto de la donación queda visible como inventario disponible del
  centro.

---

## Technical Tasks

- [ ] `TASK-E3-US04-01` — Dominio/datos: vincular cada entrada de
  inventario a la necesidad asociada (no solo al producto y al
  centro), de forma que exista de dónde partir el recálculo (FR-E3-04).
- [ ] `TASK-E3-US04-02` — Lógica de negocio: implementar el recálculo
  automático del faltante como máx(0, necesario − recibido) al
  registrar cada entrada de inventario asociada a una necesidad, y el
  cambio automático de esa necesidad a `resuelta` exactamente cuando el
  faltante llega a 0, sin acción manual (FR-E3-04, FR-E1-04, FR-E1-05).
- [ ] `TASK-E3-US04-03` — Lógica de negocio: implementar el manejo de
  donaciones concurrentes que en conjunto superan el faltante — el
  faltante nunca queda negativo y el excedente queda como inventario
  disponible del centro (sección 6 de OpenSpec).
- [ ] `TASK-E3-US04-04` — Lógica de negocio: si la necesidad asociada a
  una entrada de inventario ya fue `descartada`, recibir la entrada
  igual y enrutarla a inventario general del centro en vez de intentar
  recalcular el faltante de una necesidad que ya no está activa
  (OpenSpec sección 6, FR-E3-04).
- [ ] `TASK-E3-US04-05` — Tests unitarios: fórmula de recálculo máx(0,
  necesario − recibido), el faltante nunca resulta negativo aunque la
  entrada supere lo restante, y la necesidad cambia a `resuelta`
  exactamente cuando el faltante llega a 0 y no antes.
- [ ] `TASK-E3-US04-06` — Tests de integración y E2E: recepción de una
  donación dispara el recálculo sin acción manual adicional,
  donaciones concurrentes que exceden el faltante se reciben ambas con
  el excedente como inventario del centro, y flujo completo en
  Playwright de publicación → cobertura total → `resuelta`, más el
  flujo de excedente visible como inventario disponible.

---

## Definition of Done

- [ ] Criterios de aceptación cumplidos.
- [ ] Unit tests pasan.
- [ ] Integration tests pasan.
- [ ] Playwright tests pasan.
- [ ] Documentación actualizada.
- [ ] Product Owner aprueba.

---

## Story Sizing

| Size | Justificación |
|------|----------------|
| **M** | Lógica de recálculo automático que cruza inventario (E3) con necesidades (E1) y estado de donación (E2); incluye el caso límite de excedente. 1–2 días. |
