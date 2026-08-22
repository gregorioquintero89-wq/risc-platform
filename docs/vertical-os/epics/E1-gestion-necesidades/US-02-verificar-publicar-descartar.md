---
owner: Gregorio Quintero
status: draft
title: "US-E1-02 — Líder verifica y publica o descarta una necesidad"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E1
---

# US-E1-02 — Líder verifica y publica o descarta una necesidad

## Metadata

```yaml
Story ID: E1-US-02
Title: Líder verifica y publica o descarta una necesidad
Business Capability: E1 — Gestión de necesidades verificadas
Epic: E1
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** líder RISC de ciudad

> **I want** revisar una necesidad reportada y moverla a publicada, o descartarla dejando el motivo registrado

> **So that** solo las necesidades reales y completas se vuelvan visibles para los donantes, sosteniendo la verificación como el diferenciador de RISC frente a CaliSolidario.

---

## Business Context

CaliSolidario declara explícitamente "no verifica los avisos" (vault `05 - Referencias y competencia`, citado en Epic E1 — Business Value). RISC existe por la razón contraria: si el sistema no hace cumplir la verificación, se convierte en el mismo problema que dice venir a resolver (OpenSpec G4). Esta historia es el punto donde esa promesa se hace cumplir con software, no solo con protocolo: nada se publica sin verificación humana (BR-04).

---

## Acceptance Criteria

### AC-001

Given una necesidad en estado `reportada`

When el líder confirma que es real y que completa la regla de oro

Then la necesidad pasa a `publicada` y se vuelve visible en el portal público (OpenSpec AC-1; FR-E1-03).

---

### AC-002

Given una necesidad en estado `reportada` resulta falsa, duplicada o fuera de alcance

When el líder la revisa

Then la necesidad pasa a `descartada` con el motivo registrado (OpenSpec sección 6, casos límite: "reportes falsos o duplicados → descartada, con motivo registrado"; FR-E1-03).

---

### AC-003

Given un líder verifica una necesidad, ya sea para publicarla o descartarla

When ejecuta la acción

Then el sistema registra quién verificó la necesidad y cuándo (FR-E1-07).

---

### AC-004

Given una necesidad pertenece a un municipio/nodo distinto al del líder

When el líder consulta necesidades para verificar

Then no puede verificar necesidades fuera de su propio municipio/nodo — solo el líder de la ciudad correspondiente verifica (FR-E1-03: "el líder de la ciudad correspondiente verifica la necesidad").

---

## Business Rules

- BR-02 — Cuatro estados de necesidad: desde `reportada` solo hay dos transiciones válidas — a `publicada` o a `descartada`.
- BR-04 — Nada se publica sin verificación humana (manual secciones 07–08, 11–12).

---

## Edge Cases

- Reportes falsos o duplicados → `descartada`, con motivo registrado (OpenSpec sección 6).
- Ausencia del líder de un nodo — la estructura mínima exige suplente; sin eso, el nodo no debería activarse (manual sección 04; OpenSpec sección 6). Sin líder ni suplente disponible, ninguna necesidad reportada en ese nodo puede avanzar a `publicada` o `descartada`.

---

## Dependencies

**Internal Modules**
- E8 — Red, nodos, roles y permisos: el rol de líder de ciudad/nodo (FR-E8-02) y la restricción de que un líder solo gestiona su propio municipio/nodo (FR-E8-03) deben existir antes de esta historia.
- E9 — Transparencia pública y auditoría: la verificación es una de las acciones relevantes que debe quedar registrada con quién y cuándo (FR-E9-02).

**External APIs**
- Ninguna prevista para R1 (PRD sección 12).

**Other Stories**
- US-E1-01 — no se puede verificar lo que no se reportó.

**Infrastructure**
- Pendiente de la fase de Architecture (esquema de datos, control de acceso) — PRD sección 12.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo (ver README del repo). No inventar wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel:

- Requiere timestamp de verificación y el identificador del líder que verifica (FR-E1-07).
- El motivo de descarte debe quedar registrado como dato, no solo reflejado en el cambio de estado (OpenSpec sección 6).
- Debe disparar el evento de analítica `necesidad_verificada`, y `necesidad_publicada` o `necesidad_descartada` según corresponda (PRD sección 14).
- El registro de verificación debe ser inmutable (PRD sección 10, Seguridad).

---

## Test Cases

### Unit Tests

- Validar que solo un usuario con rol líder puede verificar necesidades de su propio municipio/nodo.
- Validar que el sistema registra usuario y timestamp en cada verificación (publicación o descarte).
- Validar que descartar una necesidad exige un motivo.

### Integration Tests

- Verificar una necesidad reportada y confirmar que pasa a `publicada` y se vuelve visible en el portal público.
- Descartar una necesidad reportada con motivo y confirmar que pasa a `descartada`.
- Intentar verificar una necesidad de otro municipio/nodo y confirmar que la acción se rechaza.

### Playwright E2E

- Como líder, verificar y publicar una necesidad, y confirmar que aparece en el portal público.
- Como líder, descartar una necesidad ingresando el motivo, y confirmar que queda registrada como descartada.

---

## Technical Tasks

- [ ] TASK-E1-US02-01 (Dominio/datos) — Modelar las transiciones válidas desde `reportada` (a `publicada` o a `descartada`) y el campo de motivo, obligatorio solo cuando se descarta.
- [ ] TASK-E1-US02-02 (Dominio/datos) — Modelar el registro de verificación (quién verificó y cuándo) como dato inmutable asociado a la necesidad.
- [ ] TASK-E1-US02-03 (Lógica de negocio) — Implementar la restricción que impide a un líder verificar necesidades fuera de su propio municipio/nodo.
- [ ] TASK-E1-US02-04 (Interfaz) — Construir la pantalla donde el líder revisa una necesidad `reportada` y elige publicarla o descartarla ingresando el motivo (según el mockup de accesos por rol, pendiente).
- [ ] TASK-E1-US02-05 (Tests unit/integration) — Cubrir la restricción por rol/nodo, el registro de usuario y timestamp en cada verificación, el motivo obligatorio al descartar y las transiciones válidas de estado.
- [ ] TASK-E1-US02-06 (Tests E2E) — Automatizar el flujo de verificar y publicar una necesidad, y el flujo de descartarla con motivo.

---

## Definition of Done

This Story is complete when:

- Acceptance Criteria satisfied.
- Unit Tests pass.
- Integration Tests pass.
- Playwright tests pass.
- Documentation updated.
- Product Owner approves.

---

## Story Sizing

**M — 1 a 2 días.** Involucra transición de estado, restricción por rol y por nodo (cross-epic con E8), captura obligatoria de motivo de descarte y registro de auditoría (quién/cuándo) — más que una historia de captura simple.
