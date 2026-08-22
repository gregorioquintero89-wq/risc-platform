---
owner: Gregorio Quintero
status: draft
title: "US-E9-01 — Contador público de necesidades resueltas"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E9
---

# US-E9-01 — Contador público de necesidades resueltas

## Metadata

```yaml
Story ID: E9-US-01
Title: Contador público de necesidades resueltas
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

> **I want** ver un contador de necesidades resueltas

> **So that** pueda confirmar que RISC efectivamente resuelve necesidades, no solo las publica

---

## Business Context

RISC nace para reemplazar la coordinación por WhatsApp e Instagram, que
no deja trazabilidad ni forma de saber si algo se resolvió (OpenSpec
G1). Un contador público es la evidencia más simple y directa de que el
ciclo necesidad → donación se cierra de verdad (FR-E9-01), y es parte
de lo que sostiene la credibilidad de RISC frente a la competencia
(OpenSpec G4; epic E9, sección Business Value).

---

## Acceptance Criteria

### AC-001

Given el visitante no tiene cuenta

When entra al portal público

Then puede ver el contador de necesidades resueltas sin necesidad de iniciar sesión.

---

### AC-002

Given una necesidad pasa a estado `resuelta` automáticamente al llegar su faltante a 0 (FR-E1-05)

When ese cambio de estado ocurre

Then el contador público se actualiza sin acción manual de ningún usuario.

---

### AC-003

Given el visitante consulta el contador en cualquier momento

When lo hace

Then el número mostrado corresponde al conteo real de necesidades en estado `resuelta`, no a un valor desactualizado.

---

## Business Rules

- FR-E9-01: el portal público muestra un contador de necesidades resueltas.
- FR-E1-05: una necesidad pasa a `resuelta` automáticamente cuando el faltante llega a 0 — sin acción manual del líder.
- BR-02: cuatro estados de necesidad, no más — `resuelta` es uno de ellos.

---

## Edge Cases

Ninguno de los casos límite documentados en OpenSpec sección 6 aplica
directamente a esta historia. No se documentan casos nuevos.

---

## Dependencies

**Internal Modules**
- E1 (Gestión de necesidades verificadas) — genera el estado `resuelta` que este contador expone (FR-E1-05).

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

El contador debe reflejar el estado real de las necesidades en cada
consulta, sin depender de que un usuario refresque manualmente para
ver un valor correcto. El mecanismo concreto de actualización (consulta
en vivo, cache invalidado por evento, u otro) es decisión de la fase de
Architecture — esta historia no elige stack ni esquema.

---

## Test Cases

### Unit Tests

- Cálculo del conteo de necesidades en estado `resuelta` a partir del estado de las necesidades.

### Integration Tests

- Al cambiar una necesidad de `publicada` a `resuelta` (evento del ciclo E1), el contador refleja el nuevo valor sin intervención manual.

### Playwright E2E

- Un visitante sin cuenta entra al portal público y ve el contador de necesidades resueltas visible en la página principal.

---

## Technical Tasks

- [ ] **TASK-E9-US01-01** (Dominio/datos) — Identificar la fuente de
  datos existente para el contador: el estado `resuelta` que ya
  gestiona E1 (FR-E1-05). No se modela ninguna entidad nueva, solo se
  define cómo se lee el conteo a partir del estado real de las
  necesidades.
- [ ] **TASK-E9-US01-02** (Lógica de negocio) — Implementar el cálculo
  del conteo de necesidades en estado `resuelta`, de forma que cada
  consulta devuelva el valor real y no uno desactualizado (AC-003).
- [ ] **TASK-E9-US01-03** (Lógica de negocio) — Implementar la
  actualización del contador cuando una necesidad cambia a `resuelta`,
  sin que ningún usuario tenga que refrescar manualmente o repetir la
  acción (AC-002).
- [ ] **TASK-E9-US01-04** (Interfaz) — Mostrar el contador de
  necesidades resueltas en la página principal del portal público, sin
  requerir inicio de sesión (AC-001). El mockup de accesos por rol
  aún no existe para esta historia; no inventar wireframe — usar el
  layout público ya existente hasta que el mockup se defina.
- [ ] **TASK-E9-US01-05** (Tests) — Test unitario del cálculo del
  conteo de necesidades resueltas a partir del estado de las
  necesidades.
- [ ] **TASK-E9-US01-06** (Tests) — Test de integración de la
  actualización automática del contador al cambiar una necesidad de
  `publicada` a `resuelta`, y test E2E de un visitante sin cuenta que
  ve el contador en la página principal.

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

**Tamaño: S (medio día).** Es un componente de solo lectura sobre un
dato que ya existe (estado de necesidades gestionado por E1); no
requiere flujo de escritura ni reglas nuevas. Sube de XS a S por la
necesidad de que se actualice automáticamente al cambiar el estado de
una necesidad (AC-002), no solo al cargar la página.
