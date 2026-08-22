---
owner: Gregorio Quintero
status: draft
title: "US-E3-05 — Consultar al líder para movilizar grandes cantidades sin necesidad identificada"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E3
---

# US-E3-05 — Consultar al líder para movilizar grandes cantidades sin necesidad identificada

## Metadata

```yaml
Story ID: E3-US-05
Title: Solicitar o movilizar grandes cantidades sin necesidad identificada requiere consultar antes al líder
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

> **I want** que solicitar o movilizar una gran cantidad de un
> producto sin una necesidad identificada quede sujeto a consultar
> antes al líder o al suplente del nodo

> **So that** el centro de acopio no opere como un depósito sin
> control y RISC no reproduzca el mismo problema que dice venir a
> resolver

---

## Business Context

El manual operativo (sección 06) es explícito: el centro de acopio no
es un depósito libre. Si un operador pudiera solicitar o movilizar
grandes cantidades de un producto sin que exista una necesidad
publicada que lo justifique, el sistema perdería la garantía que lo
diferencia de una coordinación informal por WhatsApp — donaciones que
no corresponden a lo que realmente hace falta. FR-E3-05 exige que ese
movimiento pase primero por el líder o el suplente del nodo
(FR-E8-06).

---

## Acceptance Criteria

### AC-001

Given que un operador quiere solicitar o movilizar una gran cantidad
de un producto sin que exista una necesidad publicada que la
justifique

When intenta iniciar esa solicitud o movilización

Then el sistema exige que quede registrada la consulta previa al líder
o al suplente del nodo antes de continuar (FR-E3-05, FR-E8-06).

---

### AC-002

Given que la solicitud o movilización sí está asociada a una necesidad
publicada con faltante

When el operador la registra

Then no se exige la consulta previa al líder — aplica el flujo normal
de entradas y salidas de inventario (US-03, US-04).

---

### AC-003

Given que se registra una consulta al líder o al suplente del nodo
para una movilización sin necesidad identificada

When el líder o el suplente responde

Then la respuesta queda registrada junto con la movilización, con
quién y cuándo (FR-E9-02).

---

### AC-004

Given que un operador inició una movilización de una gran cantidad sin
necesidad identificada y existe una consulta registrada al líder o al
suplente del nodo

When el operador intenta confirmar el movimiento antes de que la
respuesta del líder o del suplente quede registrada

Then el sistema bloquea la confirmación — no permite continuar hasta
que la respuesta quede registrada. No es una alerta posterior al
movimiento: es un bloqueo previo a la confirmación (FR-E3-05,
FR-E8-06; decisión Gregorio Quintero, 21 ago 2026).

---

## Business Rules

- FR-E3-05 — El centro de acopio no opera como depósito sin control:
  solicitar o movilizar grandes cantidades sin una necesidad
  identificada requiere consultar antes al líder o al suplente del
  nodo (manual sección 06).
- FR-E9-02 — Toda acción relevante queda registrada con quién y
  cuándo; aplica a la consulta al líder o al suplente y a su
  respuesta.
- FR-E8-02 — El líder consultado es el líder del nodo/municipio al que
  pertenece el centro (rol asignado a un municipio específico).
- FR-E8-06 — El suplente tiene los mismos permisos que el líder sobre
  su propio nodo: puede responder la consulta de esta historia en
  ausencia o en lugar del líder, sin restricción adicional.
- Bloqueo duro (decisión Gregorio Quintero, 21 ago 2026): si un
  operador moviliza una gran cantidad sin necesidad identificada y sin
  que la consulta previa al líder o al suplente quede registrada, el
  sistema no permite confirmar el movimiento hasta que esa respuesta
  quede registrada. No es una alerta posterior — es un bloqueo previo a
  la confirmación.

---

## Edge Cases

- ~~OpenSpec no define un umbral numérico para "grandes cantidades".~~
  Resuelto (Gregorio Quintero, 20 ago 2026): más de 50 unidades de un
  mismo producto, o 50 litros/kg para productos a granel (agua,
  alimento) — punto de partida ajustable, no un número definitivo
  (OpenSpec, FR-E3-05).
- El líder del nodo no está disponible para responder la consulta — el
  manual (sección 04) exige estructura mínima de líder + suplente; con
  el suplente formalizado como rol de E8 con los mismos permisos que
  el líder sobre su nodo (FR-E8-06), el suplente puede responder la
  consulta en ausencia del líder. Si ninguno de los dos está
  disponible, el nodo no debería estar operando.
- ~~Un operador moviliza la cantidad sin que la consulta previa quede
  registrada — el comportamiento del sistema ante ese incumplimiento
  (bloqueo duro vs. alerta y registro posterior) no está definido en
  OpenSpec; pendiente de Architecture/Design.~~ Resuelto (Gregorio
  Quintero, 21 ago 2026): **bloqueo duro** — el sistema no permite
  confirmar el movimiento hasta que la respuesta del líder o del
  suplente quede registrada. No es una alerta posterior; es un bloqueo
  previo a la confirmación (FR-E3-05, FR-E8-06).
- Nadie le avisa al líder/suplente que hay una consulta pendiente de
  respuesta — con el bloqueo duro, eso puede congelar la operación
  indefinidamente. Resuelto (Gregorio Quintero, 21 ago 2026): el
  sistema debe notificar al líder/suplente cuando hay una consulta
  pendiente de respuesta — excepción puntual y acotada a
  "Notificaciones fuera de R1" (ver README, sección Arquitectura). El
  canal (push, email, SMS, WhatsApp) no se define acá; queda pendiente
  de la fase de Architecture.

---

## Dependencies

**Internal Modules**
- E8 (Red, nodos, roles y permisos) — el líder o el suplente
  consultado son los roles de líder y suplente de ciudad/nodo
  (FR-E8-02, FR-E8-06) asignados al municipio del centro. El suplente
  tiene los mismos permisos que el líder sobre su nodo para responder
  esta consulta.

**External APIs**
- Ninguna prevista para R1.

**Other Stories**
- US-03 — requiere el registro de salidas de inventario sobre el que
  aplica esta excepción.
- US-04 — el caso "hay necesidad identificada" de esta historia usa el
  mismo flujo automático de US-04; esta historia cubre el caso
  contrario.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Flujo de excepción sobre el registro de salida o solicitud de
inventario (US-03): cuando el movimiento no tiene una necesidad
publicada asociada y supera 50 unidades de un mismo producto (o 50
litros/kg para productos a granel), se exige un paso adicional de
consulta y registro de la respuesta del líder o del suplente del nodo
(FR-E8-06) antes de confirmar el movimiento. El sistema **bloquea la
confirmación** hasta que esa respuesta quede registrada — no hay
camino alterno de alerta y registro posterior (decisión Gregorio
Quintero, 21 ago 2026).

El sistema debe notificar al líder/suplente cuando queda una consulta
pendiente de respuesta, para que el bloqueo duro no congele la
operación indefinidamente por falta de aviso — excepción puntual y
acotada a "Notificaciones fuera de R1" (README, sección Arquitectura;
decisión Gregorio Quintero, 21 ago 2026). El canal de esa notificación
(push, email, SMS, WhatsApp) no se define acá — corresponde a la fase
de Architecture.

Sin detalles de esquema ni stack — corresponde a la fase de
Architecture.

---

## Test Cases

### Unit Tests

- Validar que una solicitud o movilización sin necesidad asociada
  queda condicionada a que exista un registro de consulta al líder o
  al suplente.
- Validar que una solicitud o movilización con necesidad asociada no
  exige la consulta.

### Integration Tests

- Un operador intenta movilizar una cantidad sin necesidad asociada y
  el sistema le exige registrar la consulta al líder o al suplente
  antes de confirmar.
- El líder o el suplente responde la consulta y la respuesta queda
  asociada al movimiento, con auditoría de quién y cuándo (FR-E9-02).
- Un operador intenta confirmar el movimiento sin que la respuesta del
  líder o del suplente quede registrada — el sistema bloquea la
  confirmación (bloqueo duro).

### Playwright E2E

- Flujo completo: operador intenta movilizar sin necesidad asociada,
  ve el paso de consulta al líder o al suplente, y solo puede
  confirmar una vez registrada la respuesta (bloqueo duro).
- Flujo normal: operador movilizar con una necesidad publicada
  asociada no ve el paso de consulta.

---

## Technical Tasks

- [ ] `TASK-E3-US05-01` — Dominio/datos: modelar el registro de
  consulta al líder o al suplente del nodo asociado a una
  movilización/solicitud sin necesidad identificada — quién consulta,
  quién responde (líder o suplente, FR-E8-06), la respuesta y
  quién/cuándo (FR-E3-05, FR-E9-02).
- [ ] `TASK-E3-US05-02` — Lógica de negocio: implementar la condición
  que determina cuándo una salida o solicitud requiere consulta previa
  al líder — sin necesidad publicada asociada y por encima de 50
  unidades de un mismo producto (o 50 litros/kg a granel). Umbral
  configurable, no hardcodeado como constante fija (FR-E3-05).
- [ ] `TASK-E3-US05-03` — Lógica de negocio: implementar que una
  salida o solicitud asociada a una necesidad publicada con faltante
  sigue el flujo normal de entradas y salidas (US-03/US-04) sin exigir
  la consulta previa.
- [ ] `TASK-E3-US05-04` — Lógica de negocio: implementar **bloqueo
  duro** cuando se moviliza una cantidad sin que la consulta previa
  quede registrada — el sistema no permite confirmar el movimiento
  hasta que la respuesta del líder o del suplente quede registrada.
  Resuelto (Gregorio Quintero, 21 ago 2026); ya no es alerta y
  registro posterior (FR-E3-05, FR-E8-06).
- [ ] `TASK-E3-US05-05` — Interfaz: paso de consulta al líder o al
  suplente en el flujo de movilización del operador, que bloquea la
  confirmación hasta que la respuesta quede registrada (bloqueo duro;
  mockup de accesos por rol pendiente; no se inventa acá).
- [ ] `TASK-E3-US05-06` — Tests unitarios, de integración y E2E:
  condicionamiento a consulta cuando no hay necesidad asociada, flujo
  normal sin consulta cuando sí la hay, registro de la respuesta del
  líder o del suplente con auditoría de quién/cuándo, bloqueo duro de
  la confirmación sin respuesta registrada, y flujo completo en
  Playwright para ambos casos.
- [ ] `TASK-E3-US05-07` — Notificaciones: notificar al líder o al
  suplente del nodo cuando queda una consulta pendiente de respuesta
  (excepción puntual y acotada a "Notificaciones fuera de R1", ver
  README). El canal (push, email, SMS, WhatsApp) no se define acá —
  corresponde a la fase de Architecture (decisión Gregorio Quintero,
  21 ago 2026).

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
| **S** | Flujo de excepción sobre US-03 ya existente; agrega un paso de consulta y registro, sin lógica de cálculo nueva. Medio día. |
