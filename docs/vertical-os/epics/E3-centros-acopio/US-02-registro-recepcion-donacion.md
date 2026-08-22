---
owner: Gregorio Quintero
status: draft
title: "US-E3-02 — Registrar la recepción de una donación"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E3
---

# US-E3-02 — Registrar la recepción de una donación

## Metadata

```yaml
Story ID: E3-US-02
Title: Registrar la recepción de una donación
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

> **I want** registrar la recepción de una donación indicando quién
> entrega, qué entrega y la cantidad

> **So that** el compromiso de un donante se convierta en algo físico
> y verificable, con trazabilidad completa de la entrega

---

## Business Context

Una donación queda `comprometida` cuando el donante la registra (E2),
pero ese compromiso no es todavía algo real: puede que el donante no
se presente, entregue una cantidad distinta o presente un código que
no corresponde a ningún registro. El operador del centro es quien
confirma, en el punto físico de entrega, que la donación efectivamente
ocurrió. Sin este registro, el estado `recibida` nunca se alcanza
(FR-E2-04) y el ciclo necesidad → donación no tiene datos reales de
los que partir.

---

## Acceptance Criteria

### AC-001

Given que un donante se presenta en el centro de acopio con el código
de una donación `comprometida`

When el operador registra la recepción indicando quién entrega, qué
entrega y la cantidad

Then la donación pasa de `comprometida` a `recibida` (FR-E2-04,
FR-E3-02).

---

### AC-002

Given que el código presentado no coincide con ninguna donación
registrada

When el operador intenta confirmar la recepción

Then la donación queda marcada para revisión de un operador y no se
rechaza automáticamente (FR-E2-05, sección 6 de OpenSpec).

---

### AC-003

Given que se confirma la recepción de una donación

When se guarda el registro

Then queda constancia de quién entregó, qué entregó, la cantidad, qué
operador la recibió y cuándo (FR-E9-02).

---

## Business Rules

- FR-E3-02 — El operador registra la recepción de una donación
  indicando quién entrega, qué entrega y cantidad.
- FR-E2-04 — El estado de una donación pasa de `comprometida` a
  `recibida` solo cuando el centro de acopio confirma la entrega.
- FR-E2-05 — Si el código presentado no coincide con una donación
  registrada, queda marcada para revisión de un operador; no se
  rechaza automáticamente.
- FR-E9-02 — Toda acción relevante (incluida recibir una donación)
  queda registrada con quién y cuándo.
- BR-05 — RISC no recibe, custodia ni intermedia dinero; lo que se
  registra acá es siempre entrega física de bienes, nunca de dinero.

---

## Edge Cases

- El código presentado no coincide con ninguna donación registrada →
  pasa a revisión de un operador, no se rechaza sola (resuelto,
  OpenSpec sección 6).
- La cantidad entregada físicamente difiere de la cantidad comprometida
  originalmente — OpenSpec no define un tratamiento distinto al
  general: se registra lo efectivamente entregado (FR-E3-02) y el
  efecto sobre el faltante se resuelve en US-04, incluido el caso de
  excedente.
- ~~Un donante intenta entregar una donación sin código previo (no
  comprometida en E2) — fuera de alcance de esta historia; no está
  definido en OpenSpec y no se inventa acá.~~ Resuelto (Gregorio
  Quintero, 21 ago 2026): ya no está fuera de alcance del OpenSpec —
  se cubre en la story nueva **E3-US-06** (FR-E3-06), no en esta. Esta
  historia sigue cubriendo únicamente la recepción de una donación que
  ya fue `comprometida` con código en E2; E3-US-06 cubre el registro
  presencial sin código previo, que nace directamente en `recibida`.
  No se duplica ese flujo acá.

---

## Dependencies

**Internal Modules**
- E2 (Captación y trazabilidad de donaciones) — la donación debe
  existir como `comprometida`, con su código único (FR-E2-02,
  FR-E2-03), antes de poder confirmarse acá.

**External APIs**
- Ninguna prevista para R1.

**Other Stories**
- US-01 — el centro de acopio debe existir antes de poder registrar
  recepciones en él.
- US-03 — cada recepción confirmada genera una entrada de inventario.
- US-06 — cubre el registro de una donación presencial sin código
  previo (walk-in, FR-E3-06); esta historia sigue cubriendo solo el
  flujo con código de una donación previamente `comprometida` en E2.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Registro transaccional que cambia el estado de una donación existente
(`comprometida` → `recibida`) y dispara la creación de una entrada de
inventario (ver US-03). Requiere resolver el código presentado contra
el registro de donación existente antes de confirmar; si no hay
coincidencia, el registro entra en un estado de revisión en lugar de
fallar. Sin detalles de esquema ni stack — corresponde a la fase de
Architecture.

---

## Test Cases

### Unit Tests

- Validar que una donación solo puede pasar a `recibida` desde el
  estado `comprometida`.
- Validar que un código sin coincidencia genera un registro en
  revisión, no un rechazo ni un error no manejado.

### Integration Tests

- Un operador confirma la recepción de una donación comprometida y su
  estado cambia a `recibida`, con la entrada de inventario
  correspondiente generada (ver US-03).
- Un operador intenta confirmar con un código inexistente y el sistema
  crea el registro de revisión en lugar de rechazar la operación.

### Playwright E2E

- Flujo completo: operador ingresa el código de una donación
  comprometida, completa quién entrega, qué entrega y cantidad, y
  confirma la recepción.
- Flujo con código inválido: el operador ve el mensaje de "queda en
  revisión" en lugar de un error genérico.

---

## Technical Tasks

- [ ] `TASK-E3-US02-01` — Dominio/datos: modelar el registro de
  recepción de una donación (quién entrega, qué entrega, cantidad,
  operador que recibe, fecha/hora), vinculado a la donación existente,
  y el estado de revisión para una donación cuyo código presentado no
  coincide con ningún registro (FR-E3-02, FR-E2-05, FR-E9-02).
- [ ] `TASK-E3-US02-02` — Lógica de negocio: implementar la transición
  de estado de una donación de `comprometida` a `recibida`, válida
  únicamente desde `comprometida` (FR-E2-04).
- [ ] `TASK-E3-US02-03` — Lógica de negocio: implementar la resolución
  del código presentado contra el registro de donación — con
  coincidencia confirma la recepción; sin coincidencia, crea el
  registro en revisión en lugar de rechazar automáticamente (FR-E2-05).
- [ ] `TASK-E3-US02-04` — Interfaz: pantalla de operador para
  registrar código, quién entrega, qué entrega y cantidad, con mensaje
  distinto para "código no encontrado, queda en revisión" (mockup de
  accesos por rol pendiente; no se inventa acá).
- [ ] `TASK-E3-US02-05` — Tests unitarios: validar que una donación
  solo puede pasar a `recibida` desde `comprometida`, y que un código
  sin coincidencia genera un registro en revisión, no un rechazo ni un
  error no manejado.
- [ ] `TASK-E3-US02-06` — Tests de integración y E2E: confirmación de
  recepción con cambio de estado y generación automática de la entrada
  de inventario correspondiente (coordina con US-03), intento con
  código inexistente que crea el registro de revisión, y flujo
  completo en Playwright para ambos casos.

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
| **M** | Involucra resolver el código contra un registro existente, manejar el caso de no-coincidencia sin rechazar, cambiar el estado de la donación y disparar la entrada de inventario. 1–2 días. |
