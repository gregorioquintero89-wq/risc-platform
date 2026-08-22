---
owner: Gregorio Quintero
status: draft
title: "US-E3-01 — Registrar un centro de acopio"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E3
---

# US-E3-01 — Registrar un centro de acopio

## Metadata

```yaml
Story ID: E3-US-01
Title: Registrar un centro de acopio
Business Capability: E3 — Operación de centros de acopio e inventario
Epic: E3
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** líder de ciudad/nodo

> **I want** registrar un centro de acopio indicando ciudad, ubicación, responsable y horario

> **So that** el nodo tenga un punto físico habilitado para recibir donaciones antes de que empiece a operar

---

## Business Context

Hoy no existe un registro formal de dónde funciona cada centro de
acopio, quién responde por él ni en qué horario recibe donaciones —
esa información vive en la memoria del líder o en un mensaje de
WhatsApp. Sin un centro registrado con sus datos mínimos, no hay dónde
asociar la recepción de una donación (US-02) ni el inventario que de
ahí se deriva (US-03, US-04). FR-E3-01 fija los cuatro datos que todo
centro debe tener; FR-E8-01 exige que ese centro cuelgue de un
municipio concreto, nunca de un departamento directamente.

---

## Acceptance Criteria

### AC-001

Given que un líder de ciudad activa un nuevo centro de acopio en su
nodo

When completa ciudad, ubicación, responsable y horario

Then el centro queda registrado y disponible para operar en ese nodo
(FR-E3-01).

---

### AC-002

Given que falta alguno de los cuatro datos obligatorios (ciudad,
ubicación, responsable, horario)

When el líder intenta guardar el registro

Then el sistema no permite crear el centro hasta que los cuatro campos
estén completos (FR-E3-01).

---

### AC-003

Given que el centro se registra

When se guarda

Then el centro queda asociado al municipio correspondiente (FR-E8-01)
y solo es visible y gestionable por el líder de ese nodo o por un
administrador nacional (FR-E8-03, FR-E8-04).

---

### AC-004

Given que se intenta registrar un centro de acopio con un responsable
que no tiene ningún rol registrado en el nodo de ese centro (líder,
suplente u operador de centro de acopio)

When se intenta guardar el registro

Then el sistema bloquea la creación del centro hasta que el
responsable tenga ya un rol registrado en ese nodo (FR-E3-01,
FR-E8-05, FR-E8-07).

---

## Business Rules

- FR-E3-01 — Cada centro de acopio tiene ciudad, ubicación, responsable
  y horario; los cuatro datos son obligatorios.
- FR-E8-01 — Todo nodo RISC cuelga de un municipio concreto, nunca de
  un departamento directamente; el centro hereda esa restricción.
- FR-E8-03 — Un líder solo ve y gestiona la información de su propio
  municipio/nodo, incluidos los centros de acopio que cuelgan de él.
- FR-E8-05 — Queda registrado qué usuario tiene qué rol en qué nodo;
  el responsable asignado al centro debe corresponder a un rol ya
  registrado en ese nodo — bloqueo duro, no una validación opcional
  (decisión Gregorio Quintero, 21 ago 2026).
- FR-E8-07 — Existe un rol de operador de centro de acopio, registrado
  a nivel de nodo (igual que líder y suplente); un responsable puede
  tener ese rol, además de líder o suplente, para cumplir el bloqueo de
  FR-E3-01.

---

## Edge Cases

- Se intenta registrar un centro en un nodo que todavía no tiene la
  estructura mínima (líder + suplente + equipo de apoyo) — el manual
  (sección 04) indica que ese nodo no debería activarse, y por lo
  tanto tampoco un centro que cuelga de él.
- ~~El responsable asignado al centro no tiene ningún rol registrado en
  ese nodo (FR-E8-05) — pendiente de definir si el sistema lo bloquea
  o solo lo señala; no está resuelto en OpenSpec.~~ Resuelto (Gregorio
  Quintero, 21 ago 2026): **bloqueo duro** — no se puede registrar un
  centro de acopio con un responsable que no tenga ya un rol
  registrado en el nodo de ese centro (líder, suplente u operador de
  centro de acopio — FR-E8-05, FR-E8-07). El rol de operador se
  registra a nivel de nodo, igual que líder y suplente, precisamente
  para que pueda existir antes de que el centro se cree — evita el
  problema de huevo-y-gallina de exigir un rol ligado a un centro que
  todavía no existe.
- Municipio de destino no confirmado — ya no aplica para Tolima
  (Ibagué) ni Chocó (Quibdó), confirmados por Cristian el 20 ago 2026;
  sí aplicaría a cualquier municipio futuro sin confirmar.

---

## Dependencies

**Internal Modules**
- E8 (Red, nodos, roles y permisos) — el centro debe colgar de un
  municipio existente con al menos un líder asignado (FR-E8-01,
  FR-E8-02), y su responsable debe tener ya un rol registrado en ese
  nodo — líder, suplente u operador de centro de acopio (FR-E8-05,
  FR-E8-07, E8-US-05).

**External APIs**
- Ninguna prevista para R1.

**Other Stories**
- Ninguna — es la historia base de la epic; US-02, US-03 y US-04
  requieren que un centro ya exista.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Registro de datos maestros de una entidad "Centro de Acopio", asociada
a un nodo/municipio existente (E8). Además de la validación de los
cuatro campos obligatorios y la restricción de visibilidad por nodo,
incluye la validación de que el responsable tenga ya un rol registrado
en ese nodo (líder, suplente u operador — FR-E8-05, FR-E8-07),
consultando el registro de roles de E8-US-05. Sin detalles de esquema
ni stack — corresponde a la fase de Architecture.

---

## Test Cases

### Unit Tests

- Validar que un centro no se puede guardar si falta ciudad,
  ubicación, responsable u horario.
- Validar que un centro queda asociado a un municipio existente y no
  a un departamento.
- Validar que un centro no se puede guardar si el responsable no tiene
  ya un rol registrado en el nodo (FR-E8-05, FR-E8-07).

### Integration Tests

- Un líder registra un centro completo y lo consulta desde su propio
  nodo.
- Un líder de otro nodo no puede ver ni editar el centro recién
  creado (FR-E8-03).
- Un líder intenta registrar un centro con un responsable sin rol
  previo en el nodo y el sistema bloquea la creación hasta que el
  responsable tenga rol asignado (FR-E3-01, FR-E8-07).

### Playwright E2E

- Flujo completo: líder inicia sesión, completa el formulario de
  registro de centro con los cuatro datos, guarda, y el centro aparece
  en el listado de su nodo.
- Intento de guardar con un campo obligatorio vacío muestra el error
  correspondiente y no crea el centro.
- Intento de guardar un centro con un responsable sin rol registrado en
  el nodo muestra el bloqueo correspondiente y no crea el centro.

---

## Technical Tasks

- [ ] `TASK-E3-US01-01` — Dominio/datos: modelar la entidad Centro de
  Acopio con los cuatro campos obligatorios (ciudad, ubicación,
  responsable, horario), asociada a un nodo/municipio existente
  (FR-E3-01, FR-E8-01).
- [ ] `TASK-E3-US01-02` — Lógica de negocio: implementar la validación
  que impide guardar el centro si falta alguno de los cuatro campos
  obligatorios (FR-E3-01, AC-002).
- [ ] `TASK-E3-US01-03` — Lógica de negocio: implementar la
  restricción de visibilidad y gestión del centro por nodo/municipio
  del líder (FR-E8-03).
- [ ] `TASK-E3-US01-04` — Interfaz: formulario de registro de centro
  de acopio para el líder, con los cuatro campos obligatorios, según
  el mockup de accesos por rol (pendiente de diseño; no se inventa
  wireframe acá).
- [ ] `TASK-E3-US01-05` — Tests unitarios: validar que un centro no se
  puede guardar si falta alguno de los cuatro campos obligatorios, que
  queda asociado a un municipio existente y no a un departamento, y que
  no se puede guardar si el responsable no tiene ya un rol registrado
  en el nodo (FR-E8-05, FR-E8-07).
- [ ] `TASK-E3-US01-06` — Tests de integración y E2E: registro y
  consulta de un centro desde el propio nodo, bloqueo de acceso desde
  otro nodo (FR-E8-03), bloqueo de registro con responsable sin rol
  previo en el nodo (FR-E3-01, FR-E8-07), y flujo completo de registro
  / error de campo vacío en Playwright.
- [ ] `TASK-E3-US01-07` — Lógica de negocio: implementar el bloqueo
  duro que impide registrar un centro de acopio con un responsable que
  no tenga ya un rol registrado en el nodo de ese centro (líder,
  suplente u operador de centro de acopio), consultando el registro de
  roles de E8-US-05 (FR-E3-01, FR-E8-05, FR-E8-07, AC-004).

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
| **S** | Registro de datos maestros con validación simple, sin lógica derivada ni cálculos automáticos. Medio día. |
