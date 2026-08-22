---
owner: Gregorio Quintero
status: draft
title: "US-E3-03 — Mantener inventario por producto y centro"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E3
---

# US-E3-03 — Mantener inventario por producto y centro

## Metadata

```yaml
Story ID: E3-US-03
Title: Mantener inventario por producto y centro, con entradas y salidas
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

> **I want** que cada entrada o salida de un producto quede registrada
> en el inventario de mi centro

> **So that** siempre pueda saber qué hay disponible, sin depender de
> un conteo manual o de la memoria de alguien

---

## Business Context

Un centro de acopio que recibe donaciones sin llevar inventario no
tiene forma de responder qué hay disponible ni de detectar cuándo está
funcionando como un depósito sin control (FR-E3-05). El inventario es
también la base de FR-E3-04: no se puede actualizar el faltante de una
necesidad si no existe primero un registro confiable de lo que entró y
salió de cada centro.

---

## Acceptance Criteria

### AC-001

Given que se confirma la recepción de una donación en un centro
(US-02)

When se registra como entrada de inventario

Then el inventario de ese producto en ese centro aumenta en la
cantidad recibida (FR-E3-03).

---

### AC-002

Given que se moviliza o entrega un producto desde el centro

When se registra la salida

Then el inventario de ese producto en ese centro disminuye en la
cantidad movilizada (FR-E3-03).

---

### AC-003

Given un producto y un centro con movimientos registrados

When se consulta el inventario

Then se muestra la cantidad disponible actual, resultado neto de
todas sus entradas y salidas (FR-E3-03).

---

## Business Rules

- FR-E3-03 — Se mantiene inventario por producto y por centro, con
  entradas y salidas.
- Sección 6 de OpenSpec (resuelto, 20 ago 2026) — cuando donaciones
  concurrentes exceden el faltante de una necesidad, se reciben igual
  y el excedente queda como inventario disponible del centro; no se
  rechaza ni se redirige. Esa es una de las fuentes legítimas de
  inventario sin necesidad asociada.
- FR-E3-05 — Movilizar o solicitar grandes cantidades sin una
  necesidad identificada requiere consultar antes al líder (ver
  US-05); el inventario es lo que permite detectar ese escenario.

---

## Edge Cases

- Donaciones concurrentes exceden el faltante de la necesidad que las
  originó → se reciben igual y el excedente queda como inventario
  disponible del centro (resuelto, sección 6 de OpenSpec).
- ~~Se intenta registrar una salida mayor a la cantidad disponible en
  el inventario del centro.~~ Resuelto (Gregorio Quintero, 20 ago
  2026): **se bloquea** — el sistema no permite registrar la salida
  hasta que cuadre con lo disponible (OpenSpec sección 6, FR-E3-03).
- Un mismo producto se recibe en un centro por una vía distinta a una
  donación confirmada (por ejemplo, ajuste manual de inventario) — no
  está contemplado en OpenSpec; fuera de alcance de esta historia.

---

## Dependencies

**Internal Modules**
- Ninguno adicional a E3.

**External APIs**
- Ninguna prevista para R1.

**Other Stories**
- US-01 — el centro debe existir antes de tener inventario.
- US-02 — una entrada de inventario nace, en el caso normal, de una
  recepción de donación confirmada.
- US-04 — consume el inventario registrado acá para actualizar el
  faltante de la necesidad asociada.
- US-05 — depende de que exista un registro de salidas para poder
  exigir la consulta al líder cuando no hay necesidad identificada.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Modelo de inventario por combinación (centro, producto), con historial
de movimientos (entradas y salidas), de forma que la cantidad
disponible se derive de la suma de esos movimientos y no de un campo
editable directamente. Cada entrada o salida debe quedar trazada a su
origen (recepción de donación, movilización, etc.). Sin detalles de
esquema ni stack — corresponde a la fase de Architecture.

---

## Test Cases

### Unit Tests

- Validar que una entrada de inventario aumenta la cantidad disponible
  del producto en ese centro exactamente en la cantidad registrada.
- Validar que una salida de inventario disminuye la cantidad
  disponible exactamente en la cantidad registrada.
- Validar que una salida por una cantidad mayor a la disponible se
  bloquea y no se registra (OpenSpec sección 6).
- Validar que la cantidad disponible consultada es siempre el neto de
  todos los movimientos históricos, no un valor almacenado aparte.

### Integration Tests

- Confirmar la recepción de una donación (US-02) genera
  automáticamente la entrada de inventario correspondiente.
- Consultar el inventario de un centro después de varias entradas y
  salidas devuelve el saldo correcto por producto.

### Playwright E2E

- Flujo completo: operador confirma una recepción, y el inventario del
  centro refleja la nueva cantidad disponible sin recargar
  manualmente.
- Un operador consulta el inventario de su centro y ve el listado de
  productos con cantidades disponibles actualizadas.

---

## Technical Tasks

- [ ] `TASK-E3-US03-01` — Dominio/datos: modelar el inventario por
  combinación (centro, producto) como historial de movimientos
  (entradas y salidas), no como un contador editable directamente;
  cada movimiento trazado a su origen — recepción de donación,
  movilización, etc. (FR-E3-03).
- [ ] `TASK-E3-US03-02` — Lógica de negocio: implementar el registro
  de entrada (aumenta la cantidad disponible) y de salida (la
  disminuye) exactamente en la cantidad registrada, y el cálculo de la
  cantidad disponible como el neto de todos los movimientos
  históricos, nunca un valor almacenado aparte.
- [ ] `TASK-E3-US03-03` — Lógica de negocio: bloquear el registro de
  una salida cuando la cantidad supera la disponible en el centro — no
  se permite que quede en negativo (OpenSpec sección 6, FR-E3-03).
- [ ] `TASK-E3-US03-04` — Interfaz: pantalla de consulta de inventario
  por centro, con el listado de productos y su cantidad disponible
  actualizada (mockup de accesos por rol pendiente; no se inventa
  acá).
- [ ] `TASK-E3-US03-05` — Tests unitarios: entrada aumenta y salida
  disminuye exactamente en la cantidad registrada, y la cantidad
  disponible consultada es siempre el neto de los movimientos
  históricos.
- [ ] `TASK-E3-US03-06` — Tests de integración y E2E: confirmar la
  recepción de una donación (US-02) genera automáticamente la entrada
  de inventario correspondiente, consulta del inventario tras varios
  movimientos devuelve el saldo correcto, y flujo completo en
  Playwright de actualización del inventario sin recarga manual.

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
| **M** | Requiere un modelo de movimientos (no un contador editable) y su agregación consistente por producto y centro. 1–2 días. |
