---
owner: Gregorio Quintero
status: draft
title: "US-E8-05 — Registro de roles por usuario y nodo"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E8
---

# US-E8-05 — Registro de roles por usuario y nodo

## Metadata

```yaml
Story ID: E8-US-05
Title: Registro de roles por usuario y nodo
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

> **I want** que quede registrado qué usuario tiene qué rol en qué
> nodo

> **So that** la asignación de responsabilidades sea auditable y
> consultable en cualquier momento, sin depender de la memoria de una
> persona (G1, OpenSpec sección 1).

---

## Business Context

RISC ya aplica este patrón de trazabilidad en otras partes del OpenSpec
— queda registrado quién verificó una necesidad (FR-E1-07) y quién
cargó el registro de una familia (FR-E5-04). Esta story aplica el mismo
principio a la asignación de roles: sin un registro explícito de quién
es líder de qué nodo (y quién es administrador nacional), no hay forma
de auditar la red ni de responder, en caso de incidente, quién tenía
acceso a qué contacto y desde cuándo.

---

## Acceptance Criteria

### AC-001

Given que un administrador nacional asigna un rol (líder, suplente,
operador de centro de acopio o administrador nacional) a un usuario en
un nodo

When la asignación se guarda

Then queda registrado el usuario, el rol y el nodo correspondiente
(FR-E8-05, FR-E8-06, FR-E8-07).

---

### AC-002

Given un registro de asignación de rol ya guardado

When se consulta el sistema

Then se puede saber, sin ambigüedad, qué usuario tiene qué rol en qué
nodo en el estado actual de la red.

---

### AC-003

Given la asignación de líder o de suplente hecha en E8-US-02
(FR-E8-02, FR-E8-06), la de operador de centro de acopio hecha con el
mismo mecanismo de nodo (FR-E8-07) y la de administrador nacional
hecha en E8-US-04

When se consulta el registro de roles

Then los cuatro tipos de asignación (líder, suplente, operador de
centro de acopio, administrador nacional) aparecen en el mismo
registro — no son mecanismos separados.

---

### AC-004

Given un nodo con un usuario asignado como líder y otro usuario
asignado como suplente (E8-US-02)

When se consulta el registro de roles de ese nodo

Then ambas asignaciones aparecen simultáneamente, sin que una
sobrescriba o excluya a la otra.

---

### AC-005

Given un nodo con un usuario asignado como líder, otro como suplente y
otro como operador de centro de acopio (FR-E8-07)

When se consulta el registro de roles de ese nodo

Then las tres asignaciones aparecen simultáneamente, sin que ninguna
sobrescriba o excluya a las otras — y el registro no confunde el
alcance del operador con el de líder o suplente (FR-E8-03, FR-E8-07).

---

## Business Rules

- FR-E8-05 — Queda registrado qué usuario tiene qué rol en qué nodo.
- FR-E8-06 — El rol de suplente de ciudad/nodo existe con los mismos
  permisos que el líder sobre su propio nodo; el registro de esta
  historia debe reflejar que un mismo nodo puede tener, a la vez, un
  usuario con rol líder y otro usuario con rol suplente, sin que sean
  mecanismos separados (decisión Gregorio Quintero, 21 ago 2026).
- FR-E8-07 — El rol de operador de centro de acopio existe, registrado
  a nivel de nodo con el mismo mecanismo que líder y suplente
  (FR-E8-05) — no a nivel de un centro específico, porque el centro
  puede no existir todavía en el momento de registrar el rol. A
  diferencia del líder y el suplente, el operador no tiene visibilidad
  de todo el nodo (FR-E8-03); su alcance práctico es el centro o los
  centros de los que sea responsable. El registro de esta historia debe
  reflejar el rol de operador junto a líder, suplente y administrador
  nacional, sin que sea un mecanismo separado (decisión Gregorio
  Quintero, 21 ago 2026).
- Este requisito sigue el mismo patrón de trazabilidad que ya aplica el
  OpenSpec en otros puntos del dominio: FR-E1-07 ("queda registrado
  quién verificó la necesidad y cuándo") y FR-E5-04 ("queda registrado
  quién cargó cada registro de familia") — no es una regla nueva, es la
  misma convención de auditoría aplicada a roles.
- BR-11 — Un rol por persona: el registro de esta historia debe
  garantizar que un usuario tenga como máximo un rol activo a la vez
  en todo el sistema — no multi-rol, sin excepciones (decisión
  Gregorio Quintero, 21 ago 2026).

---

## Edge Cases

- ¿Se mantiene un histórico de asignaciones pasadas (por ejemplo, si un
  líder deja el rol o cambia de nodo) o solo el estado vigente? No está
  definido en el OpenSpec ni en el manual — queda como pregunta abierta
  para la fase de Architecture, no se resuelve en esta story.
- Un usuario sin ningún rol asignado a ningún nodo — el sistema debe
  reflejar ese estado de forma explícita (sin rol), no dejarlo
  ambiguo entre "no tiene rol" y "no se sabe si tiene rol".
- ~~Un mismo usuario con más de un rol registrado (por ejemplo, líder de
  un nodo y también administrador nacional) — no está resuelto si es
  posible o no en el OpenSpec; queda abierto, igual que en E8-US-02 y
  E8-US-04.~~ Resuelto (Gregorio Quintero, 21 ago 2026): **no** — cada
  persona tiene exactamente un rol, y cuando el rol lo requiere, en un
  solo nodo (líder, suplente u operador). Única excepción: el
  administrador nacional no está atado a un nodo, por definición
  (FR-E8-04), pero sigue sin poder acumular ningún otro rol (BR-11).
- El operador de centro de acopio tiene su rol registrado a nivel de
  nodo, igual que líder y suplente, pero eso no le da visibilidad de
  todo el nodo (FR-E8-03) — su alcance práctico se limita al centro o
  los centros de los que sea responsable (FR-E3-01, FR-E8-07). Cómo el
  sistema deriva ese alcance a partir del registro de nodo (en vez de
  un registro por centro) corresponde a la fase de Architecture.

---

## Dependencies

**Internal Modules**
- Ninguno adicional a la epic misma.

**Other Stories**
- Depende de E8-US-02 (existencia de asignación líder-nodo) y de
  E8-US-04 (existencia de rol de administrador nacional) — esta story
  formaliza el registro consultable de ambas.
- Es prerequisito de E9 (transparencia pública y auditoría) — el
  registro de "quién tiene qué rol en qué nodo" es insumo básico para
  cualquier bitácora de auditoría de acciones relevantes (FR-E9-02).
- Es prerequisito de E3-US-01 (registro de centro de acopio) — el
  bloqueo duro que impide asignar un responsable sin rol registrado en
  el nodo (FR-E3-01, FR-E8-07) depende de que el registro de roles de
  esta historia ya exista y sea consultable.

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

- El registro debe ser consultable de forma directa — "qué rol tiene
  el usuario X", "quién es líder del nodo Y", "quién es suplente del
  nodo Y" y "quién es operador de centro de acopio en el nodo Y" deben
  resolver contra el mismo dato, no inferirse combinando procesos
  distintos (FR-E8-06, FR-E8-07).
- Un nodo puede tener registrado, a la vez, un usuario con rol líder,
  otro con rol suplente y uno o más usuarios con rol operador de
  centro de acopio — el registro no fuerza a elegir uno solo por nodo.
- El rol de operador no otorga visibilidad de todo el nodo como sí lo
  hacen líder y suplente (FR-E8-03) — el registro guarda el rol a nivel
  de nodo, pero el alcance práctico de qué centro(s) gestiona el
  operador se resuelve en E3, no en esta story (FR-E3-01).
- El mecanismo concreto de almacenamiento y si se conserva histórico de
  cambios corresponde a la fase de Architecture (ver Edge Cases).

---

## Test Cases

### Unit Tests

- Crear una asignación de rol persiste usuario, rol y nodo como una
  unidad consultable.
- Consultar el rol de un usuario sin asignaciones retorna un estado
  explícito de "sin rol", no un error ni un vacío ambiguo.

### Integration Tests

- Consultar "qué rol tiene el usuario X", "quién es líder del nodo Y",
  "quién es suplente del nodo Y" y "quién es operador de centro de
  acopio en el nodo Y" resuelven contra el mismo registro, sin
  inconsistencia entre las vías de consulta.
- Una asignación de administrador nacional (E8-US-04), una asignación
  de líder, una de suplente (E8-US-02) y una de operador de centro de
  acopio (FR-E8-07) aparecen todas en el mismo listado de roles.
- Un nodo con líder y suplente asignados simultáneamente muestra ambas
  asignaciones sin conflicto (FR-E8-06).
- Un nodo con líder, suplente y operador de centro de acopio asignados
  simultáneamente muestra las tres asignaciones sin conflicto, y el
  registro no confunde el alcance del operador con el de líder o
  suplente (FR-E8-06, FR-E8-07).

### Playwright E2E

- Vista de administración: listar usuarios con su rol y nodo asignado,
  incluyendo operador de centro de acopio, coherente con lo configurado
  en E8-US-02 (líderes y suplentes), esta misma historia (operadores,
  FR-E8-07) y E8-US-04 (administrador nacional).

---

## Technical Tasks

- [ ] **TASK-E8-US05-01** (Dominio/datos) — Modelar el registro de
      asignación de rol como una unidad consultable de usuario, rol y
      nodo, aplicable a la asignación de líder y de suplente
      (E8-US-02, FR-E8-06), a la de operador de centro de acopio
      (FR-E8-07) y a la de administrador nacional (E8-US-04) en el
      mismo mecanismo — un nodo puede tener registrados, a la vez, un
      líder, un suplente y uno o más operadores (AC-003, AC-004,
      AC-005, Technical Notes).
- [ ] **TASK-E8-US05-02** (Lógica de negocio) — Implementar la consulta
      "qué rol tiene el usuario X", "quién es líder del nodo Y",
      "quién es suplente del nodo Y" y "quién es operador de centro de
      acopio en el nodo Y" resolviendo contra el mismo registro, sin
      inconsistencia entre las vías (AC-002, Technical Notes).
- [ ] **TASK-E8-US05-03** (Lógica de negocio) — Definir el estado
      explícito de "sin rol" para un usuario sin asignaciones, distinto
      de un vacío ambiguo o de un error (Edge Cases).
- [ ] **TASK-E8-US05-04** (Interfaz) — Construir la vista de
      administración que lista usuarios con su rol y nodo asignado,
      coherente con las asignaciones de líder y suplente de E8-US-02,
      la de operador de centro de acopio (FR-E8-07) y la de E8-US-04.
- [ ] **TASK-E8-US05-05** (Tests) — Cubrir los unit tests (persistencia
      de usuario/rol/nodo como unidad, estado explícito "sin rol") y los
      integration tests (consistencia entre las vías de consulta,
      coexistencia de líder, suplente, operador y administrador
      nacional en el mismo listado) definidos en Test Cases.
- [ ] **TASK-E8-US05-06** (Lógica de negocio) — Garantizar que el
      registro del rol de operador a nivel de nodo no otorga
      visibilidad de todo el nodo (FR-E8-03) — el alcance práctico de
      qué centro(s) gestiona el operador se resuelve en E3 (FR-E3-01),
      no en el registro de roles de esta historia (Edge Cases, AC-005).
- [ ] **TASK-E8-US05-07** (Lógica de negocio) — Implementar la
      validación central que impide que un usuario tenga más de un
      registro de rol activo a la vez en todo el sistema, sin importar
      el nodo o el tipo de rol (líder, suplente, operador o
      administrador nacional) — un rol por persona, sin excepciones
      (BR-11). Es el punto de validación que consultan E8-US-02 y
      E8-US-04 al asignar líder, suplente o administrador nacional.

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

Justificación: hace consultable y auditable lo que E8-US-02 y E8-US-04
ya crean como asignación — el trabajo es exponer y garantizar
consistencia del registro, no construir un modelo de datos nuevo desde
cero.
