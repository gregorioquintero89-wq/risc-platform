---
owner: Gregorio Quintero
status: draft
title: "US-E8-02 — Asignación de líder y suplente a un nodo"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E8
---

# US-E8-02 — Asignación de líder y suplente a un nodo

## Metadata

```yaml
Story ID: E8-US-02
Title: Asignación de líder y suplente a un nodo
Business Capability: E8 — Red, nodos, roles y permisos
Epic: E8
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** administrador nacional de RISC

> **I want** asignar un usuario como líder, y opcionalmente otro
> usuario como suplente, de un nodo/municipio específico — ambos con
> los mismos permisos sobre ese nodo

> **So that** cada nodo activo tenga un responsable claro y, cuando
> corresponda, un respaldo con los mismos permisos, verificados y
> vinculados a su municipio, antes de que ese nodo empiece a operar —
> para que la operación no dependa de una sola persona (manual sección
> 04).

---

## Business Context

El manual (sección 04) es explícito: la estructura mínima para activar
un nodo es líder + suplente + equipo de apoyo. Sin líder asignado, un
nodo "es una base de datos vacía con un formulario bonito adelante"
(citado en 00-epic.md, sección Risks). Esta story formaliza el rol de
líder de ciudad/nodo (FR-E8-02) y el rol de suplente de ciudad/nodo
(FR-E8-06, decisión Gregorio Quintero, 21 ago 2026) como asignaciones
explícitas entre un usuario y un nodo concreto — es el paso que hace
operativo el modelo geográfico construido en E8-US-01. El suplente no
es un rol de menor jerarquía: tiene los mismos permisos que el líder
sobre su propio nodo, para que la operación no dependa de una sola
persona.

---

## Acceptance Criteria

### AC-001

Given un nodo existente con su municipio ya definido (E8-US-01)

When el administrador nacional asigna un usuario como líder de ese nodo

Then el usuario queda vinculado a ese nodo con el rol de líder de
ciudad/nodo (FR-E8-02).

---

### AC-002

Given un nodo sin líder asignado

When se intenta activar el nodo para operación

Then el sistema no permite la activación — la estructura mínima
(líder, al menos) está incompleta (manual sección 04; OpenSpec sección
6).

---

### AC-003

Given un intento de asignar como líder a un usuario a un nodo que no
existe (municipio no registrado)

When se intenta guardar la asignación

Then el sistema la rechaza — no puede haber líder sin nodo válido
detrás (consecuencia directa de FR-E8-01 y FR-E8-02).

---

### AC-004

Given un nodo existente con su municipio ya definido (E8-US-01)

When el administrador nacional asigna un usuario como suplente de ese
nodo

Then el usuario queda vinculado a ese nodo con el rol de suplente de
ciudad/nodo, con los mismos permisos que el rol de líder sobre ese
nodo (FR-E8-06).

---

### AC-005

Given un nodo con un suplente asignado

When el suplente actúa sobre ese nodo (por ejemplo, verificar una
necesidad o responder una consulta de movilización de grandes
cantidades, FR-E3-05)

Then el sistema le permite las mismas acciones que le permitiría al
líder de ese nodo — no aplica ninguna restricción adicional por ser
suplente.

---

### AC-006

Given un nodo con un líder ya asignado (AC-001)

When el administrador nacional asigna además un suplente a ese mismo
nodo

Then ambas asignaciones coexisten sin conflicto — el nodo tiene un
líder y un suplente simultáneamente, cada uno con los mismos permisos
sobre ese nodo.

---

## Business Rules

- FR-E8-02 — Existe un rol de líder de ciudad/nodo, asignado a un
  municipio específico.
- FR-E8-06 — Existe un rol de suplente de ciudad/nodo, con los mismos
  permisos que el líder sobre su propio nodo — no un rol de menor
  jerarquía (decisión Gregorio Quintero, 21 ago 2026).
- La estructura mínima de un nodo activo es líder + suplente + equipo
  de apoyo; sin ella, el nodo no debería activarse (manual sección 04,
  citado en OpenSpec sección 6 y en 00-epic.md).
- BR-11 — Un rol por persona: un usuario no puede ser asignado como
  líder o suplente de un nodo si ya tiene cualquier otro rol
  registrado en el sistema (líder o suplente de otro nodo, operador de
  centro de acopio, o administrador nacional) — sin excepciones
  (decisión Gregorio Quintero, 21 ago 2026).

---

## Edge Cases

- ~~Ausencia del líder de un nodo — la estructura mínima exige
  suplente; sin eso, el nodo no debería activarse (OpenSpec sección
  6). Esta story cubre la asignación del rol de líder; la definición
  formal del rol de suplente (sus permisos, si es un rol distinto o un
  respaldo del mismo rol) no está cerrada en el OpenSpec ni en el
  manual más allá de mencionarse como parte de la estructura mínima —
  queda pendiente de definición, no se resuelve acá.~~ Resuelto
  (Gregorio Quintero, 21 ago 2026): el suplente es un rol formal
  (FR-E8-06), con los mismos permisos que el líder sobre su propio
  nodo. Esta story cubre ahora la asignación de ambos roles (AC-001,
  AC-004).
- ~~¿Puede un mismo usuario ser líder de más de un nodo a la vez? No
  está definido en OpenSpec ni en el manual — queda como pregunta
  abierta, no se resuelve en esta story. La misma pregunta aplica al
  rol de suplente.~~ Resuelto (Gregorio Quintero, 21 ago 2026): **no**
  — cada persona tiene exactamente un rol, y en un solo nodo. Un
  usuario no puede ser líder de dos nodos, ni líder de un nodo y
  suplente de otro, ni acumular líder y suplente del mismo nodo a la
  vez. Sin excepciones (BR-11, OpenSpec secciones 4 y 6).

---

## Dependencies

**Internal Modules**
- Ninguno adicional a la epic misma.

**Other Stories**
- Depende de E8-US-01 (el nodo debe existir con su municipio antes de
  poder asignarle un líder).
- Es prerequisito de E8-US-03 (el aislamiento por nodo necesita saber
  qué líder pertenece a qué nodo) y de E8-US-05 (el registro de roles
  formaliza esta asignación).

**External APIs**
- Ninguna planeada para R1 (PRD sección 12).

**Infrastructure**
- Ninguna definida todavía — corresponde a la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel, sin stack:

- La asignación debe crear un vínculo persistente entre usuario, rol y
  nodo — no un campo de texto libre ni una convención de nombres. El
  mismo mecanismo aplica para el rol de líder y para el rol de
  suplente (FR-E8-06); no son modelos de datos distintos, solo un
  valor de rol distinto sobre la misma relación usuario-nodo.
- El suplente tiene los mismos permisos que el líder sobre su propio
  nodo — cualquier chequeo de permisos que hoy valide "es líder de
  este nodo" debe validar también "es suplente de este nodo" con el
  mismo resultado (AC-005).
- La validación de "estructura mínima completa" (AC-002) debe evaluarse
  contra el estado real de las asignaciones del nodo, no contra una
  bandera manual independiente.
- El esquema concreto de almacenamiento corresponde a la fase de
  Architecture.

---

## Test Cases

### Unit Tests

- Asignar un usuario como líder de un nodo existente persiste el
  vínculo con el rol y el nodo correctos.
- Asignar un usuario como suplente de un nodo existente persiste el
  vínculo con el rol y el nodo correctos, con los mismos permisos que
  el rol de líder (FR-E8-06).
- Rechazar la asignación de un líder o un suplente a un nodo
  inexistente.

### Integration Tests

- Un nodo sin líder asignado no puede transicionar a estado "activo".
- Un nodo con líder asignado sí puede transicionar a estado "activo"
  (sujeto a que el resto de la estructura mínima, si se modela en R1,
  también esté completa).
- Un nodo puede tener líder y suplente asignados simultáneamente, sin
  conflicto entre ambas asignaciones (AC-006).
- Una acción que el líder puede realizar sobre su nodo (por ejemplo,
  responder una consulta de movilización, FR-E3-05) también la puede
  realizar el suplente del mismo nodo, con el mismo resultado.

### Playwright E2E

- Flujo de administrador nacional: seleccionar un nodo, asignar un
  usuario como líder y otro como suplente desde el panel, y verificar
  que ambas asignaciones se reflejan de inmediato en el nodo.

---

## Technical Tasks

- [ ] **TASK-E8-US02-01** (Dominio/datos) — Modelar el vínculo
      persistente entre usuario, rol (líder o suplente, FR-E8-06) y
      nodo — no como texto libre ni como convención de nombres
      (Technical Notes).
- [ ] **TASK-E8-US02-02** (Lógica de negocio) — Implementar la
      validación que rechaza asignar un líder o un suplente a un nodo
      inexistente (AC-003).
- [ ] **TASK-E8-US02-03** (Lógica de negocio) — Implementar la regla
      que impide activar un nodo sin líder asignado, evaluada contra el
      estado real de las asignaciones del nodo, no contra una bandera
      manual independiente (AC-002, Technical Notes).
- [ ] **TASK-E8-US02-04** (Interfaz) — Construir el flujo del
      administrador nacional para seleccionar un nodo y asignar un
      usuario como líder y/o como suplente desde el panel.
- [ ] **TASK-E8-US02-05** (Tests) — Cubrir los unit tests (persistencia
      del vínculo usuario-rol-nodo para líder y suplente, rechazo de
      asignación a nodo inexistente) y los integration tests
      (transición a estado activo con y sin líder asignado, coexistencia
      de líder y suplente) definidos en Test Cases.
- [ ] **TASK-E8-US02-06** (Lógica de negocio) — Garantizar que
      cualquier chequeo de permisos que hoy valide "es líder de este
      nodo" produzca el mismo resultado para "es suplente de este
      nodo" — el suplente tiene los mismos permisos que el líder sobre
      su propio nodo, sin excepciones (FR-E8-06, AC-005).
- [ ] **TASK-E8-US02-07** (Lógica de negocio) — Implementar la
      validación que rechaza asignar un usuario como líder o suplente
      de un nodo si ya tiene cualquier otro rol registrado en el
      sistema (consultando el registro central de E8-US-05) — un rol
      por persona, sin excepciones (BR-11).

---

## Definition of Done

- [ ] Acceptance Criteria satisfechos.
- [ ] Unit Tests pasan.
- [ ] Integration Tests pasan.
- [ ] Playwright tests pasan.
- [ ] Documentación actualizada.
- [ ] Product Owner aprueba.

---

## Story Sizing

**Size:** S (medio día)

Justificación: es una asignación de rol relativamente simple una vez
que el modelo de nodos (E8-US-01) existe — el trabajo real es la
validación de "nodo sin líder no se activa", no la asignación en sí.
