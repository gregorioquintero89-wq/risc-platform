---
owner: Gregorio Quintero
status: draft
title: "US-E1-05 — El orden de necesidades se deriva de fecha límite y faltante, sin prioridad manual"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E1
---

# US-E1-05 — El orden de necesidades se deriva de fecha límite y faltante, sin prioridad manual

## Metadata

```yaml
Story ID: E1-US-05
Title: El orden de necesidades se deriva de fecha límite y faltante, sin prioridad manual
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

> **I want** que la lista de necesidades se ordene automáticamente por fecha límite y faltante, sin un campo de prioridad que alguien pueda editar a mano

> **So that** el orden de atención se mantenga objetivo y consistente en toda la red, sin depender de una decisión manual de prioridad (BR-03; OpenSpec sección 7).

---

## Business Context

El OpenSpec restringe explícitamente el sistema: "sin campo de prioridad gestionado a mano" (OpenSpec sección 7, Restricciones; también sección 10, Fuera de alcance). FR-E1-06 traduce esa restricción en comportamiento: "no existe campo de prioridad editable; el orden de atención se deriva de fecha límite y faltante." Esta historia implementa ese orden derivado como reemplazo directo de cualquier campo de prioridad manual.

---

## Acceptance Criteria

### AC-001

Given existen varias necesidades en estado `publicada`

When el líder consulta la lista de necesidades

Then se muestran ordenadas por fecha límite y faltante, sin ningún valor de prioridad editable (FR-E1-06).

---

### AC-002

Given cambia la fecha límite o el faltante de una necesidad

When se vuelve a consultar la lista

Then el orden se recalcula con los nuevos valores, sin que exista una prioridad fija que lo congele (FR-E1-06; BR-03).

---

### AC-003

Given el sistema no expone ningún campo de prioridad

When un líder o un administrador intenta fijar una prioridad manual sobre una necesidad

Then no existe ese campo ni esa acción en el sistema (OpenSpec sección 7, "sin campo de prioridad gestionado a mano").

---

## Business Rules

- BR-03 — No existe campo de prioridad manual; el orden se deriva de fecha límite y faltante.

---

## Edge Cases

OpenSpec sección 6 no documenta un criterio de desempate para necesidades con la misma fecha límite y el mismo faltante. No se define acá un criterio de desempate porque no está en las fuentes — queda abierto para una decisión posterior de negocio o de Architecture.

---

## Dependencies

**Internal Modules**
- Ninguno adicional.

**External APIs**
- Ninguna prevista para R1 (PRD sección 12).

**Other Stories**
- US-E1-01 — la necesidad debe existir con fecha límite definida (regla de oro).
- US-E1-03 — el faltante usado para ordenar debe ser el valor recalculado en tiempo real, no un número estático.

**Infrastructure**
- Pendiente de la fase de Architecture — PRD sección 12.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo (ver README del repo). No inventar wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel:

- El criterio de orden (fecha límite, faltante) es de negocio; el algoritmo concreto de ordenamiento y el desempate ante valores iguales son decisión de Architecture, no de esta historia.
- No requiere almacenar ningún valor de "prioridad" — el orden se calcula en el momento de la consulta a partir de fecha límite y faltante ya existentes.

---

## Test Cases

### Unit Tests

- Validar que la función de ordenamiento usa fecha límite y faltante como únicos criterios.
- Validar que no existe ningún campo o parámetro de prioridad manual en el modelo de necesidad.

### Integration Tests

- Crear varias necesidades con distintas fechas límite y faltantes, y confirmar que la lista devuelta respeta el orden esperado.
- Cambiar el faltante de una necesidad (vía recepción de donación) y confirmar que su posición en la lista se actualiza.

### Playwright E2E

- Como líder, consultar la lista de necesidades publicadas y verificar que el orden mostrado corresponde a fecha límite y faltante, y que no hay ningún control de interfaz para fijar prioridad manual.

---

## Technical Tasks

- [ ] TASK-E1-US05-01 (Dominio/datos) — Confirmar que el modelo de necesidad no incluye ningún campo de prioridad editable manualmente.
- [ ] TASK-E1-US05-02 (Lógica de negocio) — Implementar el criterio de ordenamiento de la lista de necesidades publicadas usando fecha límite y faltante como únicos criterios, calculado al momento de la consulta.
- [ ] TASK-E1-US05-03 (Lógica de negocio) — Confirmar que el orden se recalcula automáticamente cuando cambia la fecha límite o el faltante de una necesidad, sin valores congelados.
- [ ] TASK-E1-US05-04 (Interfaz) — Construir la lista de necesidades publicadas mostrando el orden derivado, sin ningún control de interfaz para fijar prioridad manual (según el mockup de accesos por rol, pendiente).
- [ ] TASK-E1-US05-05 (Tests unit/integration) — Cubrir el criterio de ordenamiento con fecha límite y faltante, la ausencia de campo de prioridad y la actualización del orden tras un cambio de faltante.
- [ ] TASK-E1-US05-06 (Tests E2E) — Automatizar la consulta de la lista de necesidades publicadas y verificar el orden mostrado y la ausencia de cualquier control de prioridad manual.

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

**S — Media jornada.** Es una regla de ordenamiento sobre datos ya existentes (fecha límite, faltante); no agrega nuevo estado ni cálculo, solo la ausencia deliberada de un campo de prioridad.
