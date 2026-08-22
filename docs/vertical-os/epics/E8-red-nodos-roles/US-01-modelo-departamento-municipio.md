---
owner: Gregorio Quintero
status: draft
title: "US-E8-01 — Modelo departamento → municipio"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E8
---

# US-E8-01 — Modelo departamento → municipio

## Metadata

```yaml
Story ID: E8-US-01
Title: Modelo departamento → municipio
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

> **I want** que el sistema modele la geografía como departamento →
> municipio, de forma que todo nodo RISC cuelgue siempre de un
> municipio concreto y nunca de un departamento directamente

> **So that** la red pueda activarse ciudad por ciudad sin ambigüedad
> sobre a qué nodo pertenece cada registro, antes de asignar líderes o
> aplicar el aislamiento de datos entre nodos.

---

## Business Context

RISC se organiza por ciudad, no por departamento — el manual y el
OpenSpec (FR-E8-01) son explícitos en que un nodo cuelga siempre de un
municipio concreto. Esta story es la base estructural de toda la epic:
sin un modelo geográfico cerrado, no hay forma de asignar un líder
(E8-US-02) ni de aplicar el aislamiento de contacto por nodo
(E8-US-03, BR-06). Es también la razón por la que el pendiente de
Tolima y Chocó bloqueaba el go-live de R1 en esos departamentos —
"departamento" solo no alcanza para activar un nodo.

---

## Acceptance Criteria

### AC-001

Given un departamento con uno o más municipios candidatos a nodo RISC

When se activa un nodo en ese departamento

Then el nodo debe especificar el municipio concreto — nunca queda
registrado solo con el departamento (FR-E8-01).

---

### AC-002

Given el municipio de Ibagué, en el departamento de Tolima, confirmado
como nodo (decisión cerrada, 20 ago 2026)

When se consulta el modelo geográfico de la red

Then Ibagué aparece como el municipio del nodo — no aparece "Tolima" a
secas como nodo.

---

### AC-003

Given el municipio de Quibdó, en el departamento de Chocó, confirmado
como nodo (decisión cerrada, 20 ago 2026)

When se consulta el modelo geográfico de la red

Then Quibdó aparece como el municipio del nodo, con la misma regla que
Ibagué.

---

### AC-004

Given un intento de crear un nodo indicando únicamente el departamento,
sin municipio

When se intenta guardar

Then el sistema rechaza la operación — un nodo sin municipio concreto
no es un estado válido.

---

## Business Rules

- FR-E8-01 — El modelo geográfico es departamento → municipio; todo
  nodo RISC cuelga de un municipio concreto, nunca de un departamento
  directamente.
- Ibagué (Tolima) y Quibdó (Chocó) son instancias ya resueltas de esta
  regla, confirmadas por Cristian el 20 de agosto de 2026 (OpenSpec
  sección 6; PRD sección 15) — no son una excepción al modelo, son la
  aplicación concreta de FR-E8-01 a los dos departamentos que estaban
  pendientes.

---

## Edge Cases

- Un departamento con más de un municipio activo como nodo al mismo
  tiempo (crecimiento futuro de la red, PRD sección 10 — "el modelo
  debe soportar activar un nodo nuevo sin rediseño"): el modelo
  departamento → municipio ya lo permite, porque cada nodo cuelga de su
  propio municipio, no del departamento compartido.
- Un municipio de un departamento sin definir todavía (el caso que
  aplicaba a Tolima y Chocó antes del 20 de agosto de 2026): bloquea la
  activación del nodo en ese departamento específico, no bloquea el
  resto de la red (OpenSpec sección 6).
- Intento de crear un nodo colgando directamente de un departamento,
  sin pasar por un municipio — ver AC-004.

---

## Dependencies

**Internal Modules**
- Ninguno — es la primera pieza estructural de la epic; no depende de
  otro módulo de dominio de RISC.

**Other Stories**
- Es prerequisito bloqueante de E8-US-02 (asignar un líder a un nodo
  requiere que el nodo ya exista con su municipio definido).
- Es prerequisito bloqueante de toda la epic E8, y por extensión de E1,
  E2, E3, E5 y E9 (00-epic.md, sección Dependencies).

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

- La jerarquía departamento → municipio debe validarse como parte del
  dato, no solo como una lista desplegable en la interfaz — un nodo sin
  municipio válido no debería poder existir en el sistema.
- El modelo debe soportar que un departamento tenga más de un municipio
  con nodo activo, sin fusionar sus datos ni su alcance.
- La decisión de esquema concreto (cómo se representa la jerarquía)
  corresponde a la fase de Architecture.

---

## Test Cases

### Unit Tests

- Rechazar la creación de un nodo sin municipio asociado.
- Rechazar la creación de un nodo colgando directamente de un
  departamento sin municipio concreto.

### Integration Tests

- Crear el nodo de Ibagué bajo el departamento de Tolima y verificar
  que la jerarquía queda registrada correctamente.
- Crear dos nodos con municipios distintos dentro del mismo
  departamento y verificar que ambos existen de forma independiente.

### Playwright E2E

- Flujo de administrador nacional: crear un nodo nuevo, el formulario
  exige seleccionar municipio (no solo departamento) antes de permitir
  guardar.

---

## Technical Tasks

- [ ] **TASK-E8-US01-01** (Dominio/datos) — Modelar la entidad nodo con
      la jerarquía departamento → municipio, de forma que un nodo no
      pueda existir sin un municipio concreto asociado (FR-E8-01).
- [ ] **TASK-E8-US01-02** (Lógica de negocio) — Implementar la
      validación que rechaza la creación o persistencia de un nodo que
      solo especifique departamento, sin municipio (AC-004).
- [ ] **TASK-E8-US01-03** (Lógica de negocio) — Soportar múltiples
      nodos con municipios distintos dentro del mismo departamento, sin
      fusionar su alcance ni sus datos (Edge Cases).
- [ ] **TASK-E8-US01-04** (Interfaz) — Construir el flujo de creación
      de nodo para el administrador nacional, exigiendo la selección de
      municipio antes de permitir guardar.
- [ ] **TASK-E8-US01-05** (Tests) — Cubrir los unit tests (rechazo de
      nodo sin municipio, rechazo de nodo colgando directamente de un
      departamento) y los integration tests (creación de Ibagué bajo
      Tolima, dos nodos con municipios distintos en el mismo
      departamento) definidos en Test Cases.

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

**Size:** M (1–2 días)

Justificación: es un modelo de datos simple (dos niveles de jerarquía),
pero exige validación estructural desde el inicio porque toda la epic
depende de que esta base sea correcta — no es solo un campo más, es la
llave foránea que usarán E8-US-02 y E8-US-03.
