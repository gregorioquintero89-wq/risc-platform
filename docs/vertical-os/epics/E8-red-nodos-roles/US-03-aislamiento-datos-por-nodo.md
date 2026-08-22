---
owner: Gregorio Quintero
status: draft
title: "US-E8-03 — Aislamiento de datos por nodo"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E8
---

# US-E8-03 — Aislamiento de datos por nodo

## Metadata

```yaml
Story ID: E8-US-03
Title: Aislamiento de datos por nodo
Business Capability: E8 — Red, nodos, roles y permisos
Epic: E8
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1) — crítica de seguridad, story más sensible de la epic
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** líder de un nodo/ciudad de RISC

> **I want** que el sistema me muestre y me permita gestionar
> únicamente la información (necesidades, familias, contacto) de mi
> propio municipio/nodo

> **So that** el contacto de familias damnificadas y propietarios de
> otros nodos quede protegido, y RISC cumpla la promesa que la
> distingue de la competencia — sí verifica y sí protege, a diferencia
> de CaliSolidario (G3, G4, OpenSpec sección 1).

---

## Business Context

Esta es la story de mayor peso de seguridad de toda la epic E8, y una
de las más importantes de todo R1. El objetivo de negocio G3 del
OpenSpec es explícito: "proteger el contacto de población vulnerable —
familias damnificadas y propietarios no deben quedar expuestos; su
contacto solo lo ve el líder verificado de su ciudad." La regla de
negocio que lo respalda, BR-06, es igual de explícita: es **una
restricción de sistema, no una convención de interfaz**. Si esta story
falla, no falla una pantalla — falla la razón de ser de RISC frente a
CaliSolidario (G4), y se materializa el riesgo de negocio más serio
identificado en el PRD (sección 15: "exposición de datos de familias
damnificadas si la restricción de contacto por nodo falla").

---

## Acceptance Criteria

### AC-001 (= AC-3 del OpenSpec, sección 5)

Given que un líder pertenece al nodo de Cali

When consulta necesidades o familias

Then no puede ver el contacto de familias o propietarios de otro
municipio.

---

### AC-002

Given un líder autenticado en su nodo

When consulta el listado de necesidades

Then solo ve las necesidades de su propio municipio/nodo — no ve las
de otros nodos, ni siquiera en modo lectura.

---

### AC-003

Given un líder autenticado en el nodo de Cali

When intenta acceder directamente a un registro de familia o
propietario de otro nodo (por ejemplo, conociendo o adivinando su
identificador, sin pasar por la lista filtrada de su propio nodo)

Then el sistema le niega el acceso igual que si no conociera el
identificador — la restricción aplica en el punto de acceso al dato,
no solo en lo que la interfaz decide mostrar (BR-06).

---

### AC-004

Given un administrador nacional autenticado (rol distinto al de líder,
ver E8-US-04)

When consulta cualquier nodo

Then sí puede ver el contacto de familias y propietarios de ese nodo —
la restricción de AC-001 a AC-003 aplica al rol de líder, no al rol de
administrador nacional (FR-E8-04).

---

## Business Rules

- BR-06 — El contacto de una familia o propietario debe ser visible
  únicamente para el líder verificado de su ciudad/nodo — es una
  restricción de sistema, no una convención de interfaz.
- FR-E8-03 — Un líder solo ve y gestiona la información (necesidades,
  familias, contacto) de su propio municipio/nodo.
- Esta story es la aplicación directa de G3 (proteger el contacto de
  población vulnerable) y sostiene G4 (RISC existe porque sí verifica y
  sí protege, a diferencia de CaliSolidario) — ambos objetivos de
  negocio del OpenSpec, sección 1.

---

## Edge Cases

- Acceso directo a un registro de otro nodo sin pasar por el listado
  filtrado (por ejemplo, mediante un enlace directo o un identificador
  conocido) — debe bloquearse igual que el acceso por la interfaz
  normal, porque BR-06 es explícita: restricción de sistema, no de
  interfaz (ver AC-003).
- Un nodo sin líder activo todavía (ver E8-US-02, AC-002: un nodo sin
  líder no debería activarse) — mientras esa condición se cumpla, no
  debería existir ningún líder que pueda ver el contacto de ese nodo en
  primer lugar; no es un caso distinto de esta story, es una
  consecuencia de que E8-US-02 bloquee la activación.
- El administrador nacional es la única excepción documentada a esta
  restricción (FR-E8-04, AC-004) — cualquier otra excepción no está
  contemplada en el OpenSpec y no debe asumirse.

---

## Dependencies

**Internal Modules**
- Ninguno adicional a la epic misma.

**Other Stories**
- Depende de E8-US-01 (modelo de nodos) y E8-US-02 (asignación de
  líder a nodo) — sin ambos, no hay forma de saber a qué nodo
  pertenece un líder ni qué está aislando.
- Se relaciona directamente con E8-US-04 (el administrador nacional es
  la excepción explícita a esta restricción) y con E8-US-05 (el
  registro de roles es la fuente de verdad de qué líder pertenece a qué
  nodo).
- Es bloqueante para E1 (necesidades), E2 (donaciones, en la medida en
  que exponen datos de contacto), E3 (familias y contacto en operación
  de centros), E5 (familias y propietarios) y E9 (auditoría) —
  ninguna de esas epics puede proteger contacto de población vulnerable
  si esta story no está resuelta primero (00-epic.md, sección
  Dependencies).

**External APIs**
- Ninguna planeada para R1 (PRD sección 12).

**Infrastructure**
- Ninguna definida todavía a nivel de esta story — corresponde a la
  fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel, sin stack:

- La restricción debe ser **estructural**, no solo de interfaz: debe
  aplicarse en el punto donde se resuelve el dato, de forma que ni un
  enlace directo, ni una llamada distinta a la que usa la pantalla
  normal, permitan sortearla ocultando o mostrando un botón distinto.
- El criterio de acceso es el nodo del líder autenticado comparado
  contra el nodo del registro consultado — no un filtro que dependa de
  que el cliente (la interfaz) lo aplique correctamente.
- El mecanismo concreto para hacer cumplir esta restricción a nivel de
  datos corresponde a la fase de Architecture; esta story no lo
  define.

---

## Test Cases

### Unit Tests

- Una consulta de contacto de familia o propietario construida con el
  nodo de un líder distinto al nodo del registro debe retornar
  denegado/vacío, sin importar qué filtro haya aplicado la capa de
  presentación.
- Una consulta hecha con el rol de administrador nacional no está
  sujeta al mismo filtro (ver AC-004).

### Integration Tests

- **Un líder del nodo de Cali NO puede ver el contacto de una familia o
  propietario registrado en el nodo de Ibagué**, incluso conociendo su
  identificador exacto (test explícito de aislamiento cruzado entre
  nodos).
- Un líder del nodo de Cali sí puede ver el contacto de familias y
  propietarios de su propio nodo, sin restricción.
- Un administrador nacional puede ver el contacto de familias y
  propietarios de cualquier nodo.

### Playwright E2E

- Login como líder del nodo de Cali, intentar acceder directamente a
  la URL de una familia registrada en el nodo de Manizales → el sistema
  deniega el acceso y no expone el contacto en ningún momento (ni
  parcialmente, ni en la respuesta de red antes de renderizar).
- Login como líder del nodo de Cali, consultar el listado de
  necesidades y familias → solo aparecen registros del nodo de Cali.

---

## Technical Tasks

Story más crítica de seguridad de la epic — las tasks priorizan
validación exhaustiva de la restricción (incluyendo intentos de
sortearla), no solo el camino feliz.

- [ ] **TASK-E8-US03-01** (Dominio/datos) — Asegurar que cada registro
      de necesidad, familia y contacto de propietario lleve la
      referencia a su nodo de origen como parte del dato, no como un
      cálculo derivado en la interfaz (Technical Notes).
- [ ] **TASK-E8-US03-02** (Lógica de negocio) — Implementar la
      restricción de acceso en el punto donde se resuelve el dato: el
      nodo del líder autenticado se compara contra el nodo del registro
      consultado, denegando el acceso si no coinciden — incluyendo el
      acceso directo por identificador conocido, no solo el listado
      filtrado (AC-001, AC-002, AC-003, BR-06).
- [ ] **TASK-E8-US03-03** (Lógica de negocio) — Implementar la
      excepción explícita para el rol de administrador nacional, de
      forma que su acceso no quede sujeto a la comparación de nodo
      (AC-004).
- [ ] **TASK-E8-US03-04** (Tests — unit) — Cubrir que una consulta de
      contacto construida con el nodo de un líder distinto al nodo del
      registro retorna denegado/vacío sin importar el filtro aplicado
      por la capa de presentación, y que una consulta hecha con rol de
      administrador nacional no queda sujeta a ese filtro (Test Cases →
      Unit Tests).
- [ ] **TASK-E8-US03-05** (Tests — integration, aislamiento cruzado) —
      Test de integración explícito que confirme que un líder del nodo
      de Cali NO puede leer el contacto de una familia o propietario
      registrado en el nodo de Ibagué, incluso conociendo su
      identificador exacto; complementar con el caso positivo (el mismo
      líder sí ve el contacto de su propio nodo) y con el acceso sin
      restricción del administrador nacional a cualquier nodo (Test
      Cases → Integration Tests).
- [ ] **TASK-E8-US03-06** (Tests — E2E) — Cubrir el intento de acceso
      directo por URL a un registro de otro nodo (debe denegarse sin
      exponer el contacto en ningún momento, ni parcialmente, ni en la
      respuesta de red antes de renderizar) y el listado de necesidades
      y familias del líder mostrando únicamente registros de su propio
      nodo (Test Cases → Playwright E2E).

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

**Size:** L (dividir en Stories más pequeñas — con salvedad)

Justificación: por criticidad de seguridad y por tocar múltiples tipos
de registro (necesidades, familias, contacto de propietarios), esta
story calza en el tamaño L, que el estándar recomienda dividir. Se
mantiene como una sola Story porque el aislamiento es una garantía
única e indivisible desde el punto de vista de negocio — no tiene
sentido entregar "medio aislamiento" como incremento de valor
independiente. La división recomendada por el estándar debe darse a
nivel de Technical Tasks (TASK-XXX) durante la fase de tasking, no a
nivel de Acceptance Criteria. Si al planear las tareas el alcance
crece más allá de lo manejable en una iteración, se debe revisar con
el Product Owner antes de continuar, no dividir el criterio de
aceptación de seguridad.
