---
owner: Gregorio Quintero
status: draft
title: "US-E2-02 — Comprometer una donación con código único"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E2
---

# US-E2-02 — Comprometer una donación con código único

## Metadata

```yaml
Story ID: E2-US-02
Title: Comprometer una donación con código único
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

> **I want** comprometer una donación indicando cantidad, mis datos de contacto y el centro de acopio donde la voy a entregar

> **So that** reciba un código único que me sirva para saber que mi donación quedó registrada y trazable, y que el centro de acopio pueda usar para confirmar la entrega.

---

## Business Context

Cierra el paso central del journey del donante (PRD sección 8): elige cantidad, registra sus datos, elige centro de acopio, recibe código. Es el evento que activa la trazabilidad del ciclo necesidad → donación (OpenSpec G2) — sin este registro, una donación prometida no queda constancia de que existió hasta que alguien la entrega físicamente.

---

## Acceptance Criteria

### AC-001

Given una necesidad está `publicada` con faltante mayor a 0

When el donante completa cantidad, datos de contacto y elige el centro de acopio de entrega

Then el sistema registra la donación en estado `comprometida` (FR-E2-02).

---

### AC-002

Given una donación se registra exitosamente

When se compromete

Then el sistema genera un código único asociado a esa donación (FR-E2-03).

---

### AC-003

Given el donante compromete la donación

When el registro se confirma

Then el donante ve el código único y el centro de acopio elegido para poder hacer la entrega.

---

### AC-004

Given una necesidad tiene un faltante de X

When uno o más donantes comprometen donaciones cuya suma excede X

Then el sistema permite comprometer todas igual — no bloquea el registro, no reduce el faltante en el momento de comprometer, ni impone un límite a cuántas donaciones se pueden comprometer en simultáneo para la misma necesidad (OpenSpec sección 6, decisión cerrada 20 ago 2026).

---

## Business Rules

- **El faltante NO se reserva en el momento de comprometer una donación** (FR-E2-02). Se resta únicamente cuando el centro de acopio confirma la recepción (FR-E3-04). Esta es una decisión de negocio cerrada por Gregorio Quintero el 20 de agosto de 2026 — ver OpenSpec sección 6 y la sección Risks de la Epic E2. Es la regla de negocio más relevante de esta epic: ninguna implementación de esta story debe introducir un mecanismo de reserva, bloqueo o límite de inventario al comprometer.
- El sistema no limita cuántas donaciones se pueden comprometer en simultáneo para una misma necesidad.
- Si el conjunto de donaciones concurrentes comprometidas termina excediendo el faltante, todas se reciben igual cuando el centro confirme; el excedente queda como inventario disponible del centro de acopio — no se rechaza ni se redirige (OpenSpec sección 6).
- El faltante nunca es negativo: se calcula como máx(0, necesario − recibido) (FR-E1-04).
- Sobre-inventario ocasional es un resultado aceptado de este diseño, no un bug (Epic E2, sección Risks).
- RISC no recibe, custodia ni intermedia dinero en ningún release planeado — la donación es siempre en especie, nunca en efectivo (BR-05).
- Una donación solo se compromete contra una necesidad en estado `publicada` (depende de E1, FR-E1-03).

---

## Edge Cases

- Donaciones concurrentes que en conjunto exceden el faltante de la necesidad → se comprometen todas igual, sin reserva ni rechazo; ver Business Rules (caso central de esta story, OpenSpec sección 6).
- Un donante intenta comprometer una donación sobre una necesidad que no está `publicada` (`reportada`, `descartada` o `resuelta`) → no debería ser posible desde el flujo normal, porque el portal público solo lista necesidades `publicada` (FR-E1-02, US-E2-01).
- Conexión de datos móvil limitada durante el registro → debe funcionar igual (NFR performance, PRD sección 10).

---

## Dependencies

**Internal Modules**
- E1 (Gestión de necesidades verificadas) — depende de que exista al menos una necesidad `publicada` con faltante mayor a 0 (FR-E1-03).
- E3 (Operación de centros de acopio e inventario) — depende de que exista al menos un centro de acopio activo para poder elegirlo como destino de entrega (FR-E3-01).

**External APIs**
- Ninguna.

**Other Stories**
- US-E2-01 — el donante llega a esta story desde la lista de necesidades publicadas.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar wireframes acá.

---

## Technical Notes

Requiere generación de un código único por donación y registro del estado inicial `comprometida`. El faltante de la necesidad asociada **no** se recalcula en este paso — eso ocurre en FR-E3-04, fuera del alcance de esta story. No debe existir a nivel técnico ningún mecanismo de reserva, bloqueo optimista/pesimista ni límite de concurrencia sobre el faltante — la decisión de negocio ya descarta esa necesidad explícitamente.

---

## Test Cases

### Unit Tests

- Generación de código único por donación (sin colisiones).
- Validación de campos obligatorios: cantidad, datos de contacto, centro de acopio de entrega.
- Estado inicial de la donación registrada es `comprometida`.

### Integration Tests

- Comprometer una donación no modifica el faltante de la necesidad asociada (el faltante solo cambia en FR-E3-04, no acá).
- **Caso central — donaciones concurrentes que exceden el faltante:** dos o más donaciones comprometidas en paralelo contra la misma necesidad, cuya suma excede el faltante disponible, se registran todas exitosamente en estado `comprometida`, cada una con su propio código único, sin error ni bloqueo (verifica la decisión de no-reserva del 20 ago 2026).

### Playwright E2E

- El donante completa el formulario de compromiso de donación (cantidad, contacto, centro de acopio) y ve el código único generado y el centro de acopio de entrega.

---

## Technical Tasks

- [ ] **TASK-E2-US02-01** — Dominio/datos: modelar la entidad Donación con estado inicial `comprometida`, código único, cantidad, datos de contacto del donante y referencias a la necesidad y al centro de acopio de destino.
- [ ] **TASK-E2-US02-02** — Lógica de negocio: implementar la generación de código único por donación (sin colisiones) y la validación de campos obligatorios (cantidad, contacto, centro de acopio, necesidad en estado `publicada`).
- [ ] **TASK-E2-US02-03** — Lógica de negocio: implementar el registro del compromiso de donación garantizando que el faltante de la necesidad NO se recalcula ni se reserva en este paso, y sin ningún mecanismo de bloqueo o límite de concurrencia sobre cuántas donaciones se comprometen a la vez para la misma necesidad (decisión cerrada 20 ago 2026, FR-E2-02, OpenSpec sección 6 — regla de negocio central de esta story).
- [ ] **TASK-E2-US02-04** — Interfaz: construir el formulario de compromiso (cantidad, contacto, selección de centro de acopio) y la pantalla de confirmación con el código único y el centro elegido.
- [ ] **TASK-E2-US02-05** — Tests (unit): generación de código único sin colisiones, validación de campos obligatorios, y estado inicial `comprometida`.
- [ ] **TASK-E2-US02-06** — Tests (integration + E2E): caso central de concurrencia — dos o más donaciones comprometidas en paralelo contra la misma necesidad, cuya suma excede el faltante, se registran todas exitosamente sin bloqueo ni reserva, cada una con su propio código; comprometer no modifica el faltante; flujo E2E de compromiso hasta ver código y centro de acopio.

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

**M — 1–2 días.** Formulario con reglas de negocio no triviales: generación de código único y, sobre todo, la ausencia deliberada de reserva de faltante ante concurrencia, que exige cobertura de test específica.
