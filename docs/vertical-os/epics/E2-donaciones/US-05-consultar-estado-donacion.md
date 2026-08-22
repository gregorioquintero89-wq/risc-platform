---
owner: Gregorio Quintero
status: draft
title: "US-E2-05 — Consultar el estado de una donación"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E2
---

# US-E2-05 — Consultar el estado de una donación comprometida

## Metadata

```yaml
Story ID: E2-US-05
Title: Consultar el estado de una donación comprometida
Business Capability: E2 — Captación y trazabilidad de donaciones
Epic: E2
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** donante

> **I want** consultar el estado de la donación que comprometí

> **So that** sepa si ya llegó al centro de acopio sin tener que llamar o escribirle a alguien para preguntar.

---

## Business Context

Cierra la necesidad de trazabilidad del donante (OpenSpec G1 y G2): reemplaza el "no sé si llegó" típico de un hilo de WhatsApp por una consulta directa con el código único que recibió al comprometer la donación (US-E2-02).

---

## Acceptance Criteria

### AC-001

Given un donante tiene el código de una donación que comprometió

When consulta ese código

Then el sistema le muestra el estado actual de la donación (`comprometida` o `recibida`) (FR-E2-06).

---

### AC-002

Given una donación fue confirmada como recibida por el centro de acopio

When el donante consulta su código

Then ve el estado `recibida`.

---

### AC-003

Given el donante ingresa un código que no corresponde a ninguna donación registrada

When consulta

Then el sistema le indica que no encontró una donación con ese código, sin exponer datos de otras donaciones.

---

## Business Rules

- El donante puede consultar el estado de su donación (FR-E2-06); no está limitado a un estado específico — aplica tanto a `comprometida` como a `recibida`.
- La consulta no debe exponer contacto ni datos de otros donantes, ni de la familia asociada a la necesidad, más allá de lo que ya es público (coherente con BR-06 sobre protección de contacto).

---

## Edge Cases

- Código inexistente o mal digitado → mensaje de "no encontrado", no un error técnico.
- Una donación quedó marcada para revisión de un operador (US-E2-04) → OpenSpec no define qué estado ve el donante en ese caso; queda fuera del alcance de esta story y no se resuelve acá.
- Conexión de datos móvil limitada → debe funcionar igual (NFR performance, PRD sección 10).

---

## Dependencies

**Internal Modules**
- Ninguno fuera de E2.

**External APIs**
- Ninguna.

**Other Stories**
- US-E2-02 — depende de que exista una donación comprometida con código para poder consultarla.
- US-E2-03 — el estado `recibida` que puede consultarse viene de esa story.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar wireframes acá.

---

## Technical Notes

Consulta de solo lectura por código único, sin necesidad de cuenta — consistente con el portal público sin cuenta para el donante (PRD sección 13). No debe exponer datos sensibles de terceros.

---

## Test Cases

### Unit Tests

- Búsqueda de donación por código único.
- Formato de la respuesta según estado (`comprometida` / `recibida`).

### Integration Tests

- Consultar un código válido devuelve el estado correcto y se actualiza tras la confirmación de recepción (US-E2-03).
- Consultar un código inexistente no expone datos de otras donaciones.

### Playwright E2E

- El donante ingresa su código en el portal público y ve el estado de su donación.

---

## Technical Tasks

- [ ] **TASK-E2-US05-01** — Lógica de negocio: implementar la búsqueda de una donación por su código único, devolviendo su estado (`comprometida` o `recibida`) o un mensaje de "no encontrado" sin exponer datos de otras donaciones ni de terceros (FR-E2-06).
- [ ] **TASK-E2-US05-02** — Interfaz: construir la vista pública de consulta de donación por código, sin necesidad de cuenta.
- [ ] **TASK-E2-US05-03** — Tests (unit): búsqueda por código único y formato de la respuesta según estado.
- [ ] **TASK-E2-US05-04** — Tests (integration): un código válido refleja el estado actualizado tras la confirmación de recepción (US-E2-03); un código inexistente no expone datos de otras donaciones.
- [ ] **TASK-E2-US05-05** — Tests (E2E): el donante ingresa su código en el portal público y ve el estado de su donación.

---

## Definition of Done

- [ ] Acceptance Criteria satisfied.
- [ ] Unit Tests pass.
- [ ] Integration Tests pass.
- [ ] Playwright tests pass.
- [ ] Documentation updated.
- [ ] Product Owner approves.

---

## Story Sizing

**XS — Pocas horas.** Consulta de lectura simple por código, sin lógica de negocio propia más allá de buscar y mostrar estado.
