---
owner: Gregorio Quintero
status: draft
title: "US-E9-03 — Mensaje público de verificación antes de publicar"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E9
---

# US-E9-03 — Mensaje público de verificación antes de publicar

## Metadata

```yaml
Story ID: E9-US-03
Title: Mensaje público de verificación antes de publicar
Business Capability: E9 — Transparencia pública y auditoría
Epic: E9 — Transparencia pública y auditoría (docs/vertical-os/epics/E9-transparencia-auditoria/00-epic.md)
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1, básico)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** visitante del portal público (sin cuenta)

> **I want** ver de forma visible que RISC verifica cada necesidad antes de publicarla

> **So that** pueda confiar en que lo que veo publicado es real, a diferencia de plataformas que no verifican

---

## Business Context

CaliSolidario declara textualmente en su propio header que "no verifica
los avisos" (vault `05 - Referencias y competencia`). RISC existe por
la razón contraria — el manual entero (secciones 07, 08, 11, 12) se
sostiene sobre que nada se publica sin verificar (BR-04). Esa diferencia
tiene que ser visible para quien entra al portal, no solo cierta puertas
adentro (epic E9, sección Problem). FR-E9-03 es lo que convierte esa
diferencia en algo que el público puede ver.

---

## Acceptance Criteria

### AC-001

Given el visitante entra al portal público sin necesidad de cuenta

When navega el sitio

Then encuentra, de forma visible, una declaración de que RISC verifica cada necesidad antes de publicarla.

---

### AC-002

Given una necesidad está en estado `publicada`

When el visitante la consulta

Then el hecho de estar publicada implica que ya pasó por verificación humana (BR-04) — el sistema no muestra como públicas necesidades que no hayan sido verificadas.

---

### AC-003

Given el visitante ve el mensaje de verificación

When lo lee

Then el mensaje comunica que esta es una práctica de RISC, sin necesidad de nombrar a otras plataformas — la redacción exacta es decisión de UX/copy, pendiente de mockup.

---

## Business Rules

- FR-E9-03: el portal público muestra de forma visible que RISC verifica antes de publicar — a diferencia explícita de CaliSolidario.
- BR-04: nada se publica sin verificación humana de ambas partes (manual secciones 07–08, 11–12).

---

## Edge Cases

Ninguno de los casos límite documentados en OpenSpec sección 6 aplica
directamente a esta historia. No se documentan casos nuevos.

---

## Dependencies

**Internal Modules**
- E1 (Gestión de necesidades verificadas) — el flujo de verificar/publicar (FR-E1-02, FR-E1-03) es lo que hace cierto el mensaje que esta historia muestra.

**External APIs**
- Ninguna.

**Other Stories**
- Ninguna dentro de E9.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Es contenido de confianza mostrado en el portal público; no requiere
lógica de negocio nueva más allá de lo que ya garantiza E1 (que solo
las necesidades verificadas llegan a `publicada`). Dónde y cómo se
muestra el mensaje (banner, texto fijo, sección propia) es decisión de
diseño, pendiente de mockup — esta historia no la resuelve.

---

## Test Cases

### Unit Tests

- Renderizado del mensaje de verificación en los puntos del portal público donde debe aparecer.

### Integration Tests

- El mensaje de verificación aparece de forma consistente en las páginas públicas relevantes (home, listado de necesidades).

### Playwright E2E

- Un visitante sin cuenta entra al portal público y ve el mensaje de verificación, sin necesidad de iniciar sesión.

---

## Technical Tasks

No requiere tareas de Dominio/datos ni de Lógica de negocio nueva: la
garantía de que solo lo verificado llega a `publicada` ya la resuelve
E1 (Technical Notes de esta historia).

- [ ] **TASK-E9-US03-01** (Interfaz) — Mostrar el mensaje de
  verificación en la página principal del portal público, visible sin
  necesidad de cuenta (AC-001).
- [ ] **TASK-E9-US03-02** (Interfaz) — Mostrar el mismo mensaje de
  forma consistente en el listado de necesidades públicas (AC-001). El
  mockup de accesos por rol aún no existe para esta historia; no
  inventar wireframe ni redacción — dónde y cómo se muestra (banner,
  texto fijo, sección propia) y la redacción exacta quedan pendientes
  de UX/copy (AC-003).
- [ ] **TASK-E9-US03-03** (Tests) — Test unitario del renderizado del
  mensaje de verificación en los puntos del portal público donde debe
  aparecer.
- [ ] **TASK-E9-US03-04** (Tests) — Test de integración de que el
  mensaje aparece de forma consistente en las páginas públicas
  relevantes (home, listado de necesidades).
- [ ] **TASK-E9-US03-05** (Tests) — Test E2E de un visitante sin
  cuenta que entra al portal público y ve el mensaje de verificación,
  sin necesidad de iniciar sesión.

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

**Tamaño: S (medio día).** Es contenido de confianza sobre un flujo que
ya existe (E1 garantiza que solo lo verificado llega a `publicada`);
no hay lógica nueva, solo mostrarlo de forma visible en el portal
público.
