---
owner: Gregorio Quintero
status: draft
title: "US-E9-02 — Bitácora de auditoría de acciones relevantes"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E9
---

# US-E9-02 — Bitácora de auditoría de acciones relevantes

## Metadata

```yaml
Story ID: E9-US-02
Title: Bitácora de auditoría de acciones relevantes
Business Capability: E9 — Transparencia pública y auditoría
Epic: E9 — Transparencia pública y auditoría (docs/vertical-os/epics/E9-transparencia-auditoria/00-epic.md)
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1, básico)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** administrador nacional (rol definido en E8, FR-E8-04)

> **I want** que toda acción relevante del sistema (verificar, publicar, comprometer donación, recibir, cerrar) quede registrada con quién la ejecutó y cuándo

> **So that** pueda sostener con evidencia que RISC verifica de verdad, no solo en el papel, y auditar el sistema si algo se pone en duda

---

## Business Context

CaliSolidario declara textualmente que no verifica los avisos que
publica (vault `05 - Referencias y competencia`). RISC existe por la
razón contraria (OpenSpec G4) — pero esa diferencia solo es real si
queda registrada, no si depende de la memoria de un líder (OpenSpec
G1). El manual operativo ya exige dejar constancia de quién actúa y
cuándo (manual sección 29), y el PRD lo eleva a requisito no funcional
de seguridad: auditoría inmutable de quién verificó y cuándo (PRD
sección 10).

---

## Acceptance Criteria

### AC-001

Given un líder verifica una necesidad `reportada` (FR-E1-03)

When la acción se ejecuta

Then queda registrado quién la verificó y cuándo (FR-E1-07, FR-E9-02).

---

### AC-002

Given un líder publica o descarta una necesidad

When la acción ocurre

Then queda registrada con el usuario responsable y la marca de tiempo, incluyendo el motivo cuando la necesidad se descarta (OpenSpec sección 6 — reportes falsos o duplicados pasan a `descartada` con motivo registrado).

---

### AC-003

Given un donante compromete una donación y se genera su código único (FR-E2-03)

When la acción ocurre

Then queda registrado quién comprometió la donación y cuándo.

---

### AC-004

Given un centro de acopio confirma la recepción de una donación (FR-E3-02, FR-E2-04)

When la acción ocurre

Then queda registrada con el operador responsable y cuándo.

---

### AC-005

Given un registro ya existe en la bitácora de auditoría

When cualquier usuario intenta modificarlo o eliminarlo

Then el sistema no lo permite — la bitácora es inmutable (PRD sección 10, requisito no funcional de seguridad).

---

## Business Rules

- FR-E9-02: toda acción relevante (verificar, publicar, comprometer donación, recibir, cerrar) queda registrada con quién y cuándo (manual sección 29).
- FR-E1-07: queda registrado quién verificó la necesidad y cuándo.
- FR-E8-05: queda registrado qué usuario tiene qué rol en qué nodo — insumo para saber quién es "quién" en cada registro de auditoría.
- BR-04: nada se publica sin verificación humana de ambas partes — la razón de negocio por la que la acción de verificar debe quedar auditada.
- NFR de seguridad (PRD sección 10): auditoría inmutable de quién verificó y cuándo.

---

## Edge Cases

- Reportes falsos o duplicados → la necesidad pasa a `descartada`, con motivo registrado (OpenSpec sección 6). La bitácora debe capturar ese motivo, no solo el cambio de estado.
- Una donación entregada no coincide con el código registrado → pasa a revisión de un operador, no se rechaza sola (FR-E2-05, OpenSpec sección 6). Ese envío a revisión es en sí mismo una acción que debe quedar auditada (quién la marcó para revisión y cuándo).

---

## Dependencies

**Internal Modules**
- E1 (Gestión de necesidades verificadas) — genera las acciones reportar/verificar/publicar/descartar/resolver.
- E2 (Captación y trazabilidad de donaciones) — genera la acción comprometer donación.
- E3 (Operación de centros de acopio) — genera la acción recibir donación.
- E8 (Red, nodos, roles y permisos) — identifica qué rol y qué nodo ejecutó cada acción.

**External APIs**
- Ninguna.

**Other Stories**
- E9-US-01 y E9-US-03 no dependen de esta historia, pero comparten la misma epic.

**Infrastructure**
- Pendiente de la fase de Architecture (esquema de bitácora inmutable, ya señalado como pendiente en la epic E9).

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

El mecanismo de registro debe capturar, de forma consistente, el actor
(usuario, rol y nodo), la acción ejecutada y la marca de tiempo, para
cada una de las acciones relevantes listadas en FR-E9-02. El registro
debe ser de solo-append (no editable, no eliminable) para cumplir el
requisito de auditoría inmutable de la sección 10 del PRD. Esta
historia no define esquema de datos, motor de base de datos ni stack —
eso corresponde a la fase de Architecture.

Esta historia no incluye una pantalla dedicada para consultar la
bitácora — el PRD y el OpenSpec no definen una interfaz de auditoría
para R1, solo el requisito de que el registro exista. Una interfaz de
consulta, si se necesita, es una historia futura no cubierta acá.

---

## Test Cases

### Unit Tests

- Función que determina si una acción del sistema es "relevante" según la lista de FR-E9-02 y, si lo es, produce un registro de auditoría con actor, acción y timestamp.

### Integration Tests

- Al ejecutar cada acción relevante (verificar, publicar, descartar con motivo, comprometer donación, recibir donación), se genera un registro de auditoría con los datos correctos.
- Un intento de modificar o eliminar un registro de auditoría existente es rechazado por el sistema.

### Playwright E2E

- Tras completar una acción relevante desde la interfaz (por ejemplo, un líder publica una necesidad), el registro de auditoría correspondiente existe (validación a nivel de datos — no requiere una pantalla de bitácora en R1).

---

## Technical Tasks

- [ ] **TASK-E9-US02-01** (Dominio/datos) — Modelar el registro de
  auditoría: actor (usuario, rol y nodo — FR-E8-05), acción ejecutada,
  marca de tiempo, y motivo opcional cuando aplique (descarte,
  revisión). El registro es de solo-append: no editable ni eliminable
  una vez creado (AC-005).
- [ ] **TASK-E9-US02-02** (Lógica de negocio) — Implementar la función
  que determina si una acción del sistema es "relevante" según la
  lista de FR-E9-02 (verificar, publicar, comprometer donación,
  recibir, cerrar) y, si lo es, produce el registro de auditoría
  correspondiente.
- [ ] **TASK-E9-US02-03** (Lógica de negocio) — Conectar la generación
  del registro de auditoría a cada punto donde ocurre una acción
  relevante en E1 (verificar, publicar, descartar), E2 (comprometer
  donación) y E3 (recibir donación), capturando el actor con su rol y
  nodo (AC-001 a AC-004). Incluye los dos casos límite documentados:
  capturar el motivo cuando una necesidad pasa a `descartada`, y
  registrar quién y cuándo marcó una donación no coincidente para
  revisión (FR-E2-05).
- [ ] **TASK-E9-US02-04** (Lógica de negocio) — Implementar el rechazo
  de cualquier intento de modificar o eliminar un registro de
  auditoría ya existente, para cumplir la inmutabilidad exigida
  (AC-005, NFR de seguridad — PRD sección 10).
- [ ] **TASK-E9-US02-05** (Tests) — Test unitario de la función que
  determina si una acción es relevante y del registro que produce
  (actor, acción, timestamp).
- [ ] **TASK-E9-US02-06** (Tests) — Tests de integración: generación
  de un registro con los datos correctos para cada acción relevante
  (verificar, publicar, descartar con motivo, comprometer donación,
  recibir donación), y rechazo de un intento de modificar o eliminar
  un registro existente. Test E2E de que, tras completar una acción
  relevante desde la interfaz, el registro correspondiente existe a
  nivel de datos (sin pantalla de bitácora, fuera de alcance en R1).

---

## Definition of Done

- [ ] Criterios de aceptación satisfechos.
- [ ] Tests unitarios pasan.
- [ ] Tests de integración pasan.
- [ ] Tests Playwright pasan.
- [ ] Documentación actualizada.
- [ ] Product Owner aprueba.

---

## Story Sizing

**Tamaño: M (1–2 días).** Es transversal a E1, E2 y E3 — no es un
flujo nuevo, sino un mecanismo de registro que se invoca desde varios
puntos ya existentes en otras epics, más la restricción de
inmutabilidad. Si al implementarla el alcance crece más de lo previsto
(por ejemplo, si cada epic necesita su propio tratamiento), debe
partirse en historias más chicas por epic de origen, siguiendo la regla
de tamaño L del estándar.
