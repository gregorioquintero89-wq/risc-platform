---
owner: Gregorio Quintero
status: draft
title: "US-E1-01 — Reportar una necesidad con la regla de oro"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E1
---

# US-E1-01 — Reportar una necesidad con la regla de oro

## Metadata

```yaml
Story ID: E1-US-01
Title: Reportar una necesidad con la regla de oro
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

> **I want** reportar una necesidad indicando responsable, cantidad o alcance, ubicación y fecha límite

> **So that** la necesidad quede registrada con la información mínima exigida por el protocolo, en lugar de perderse en un hilo de WhatsApp sin estado ni responsable asignado.

---

## Business Context

La coordinación de necesidades vive hoy en mensajes de voz de WhatsApp que se pierden en el hilo; nadie puede responder cuánto falta ni quién lo está gestionando (PRD sección 3, "Dolor"). El Manual Operativo v1.0 ya exige que "cada solicitud debe tener responsable, prioridad, cantidad o alcance, ubicación, fecha límite y estado" (manual sección 03, citado en Epic E1 — Business Value), pero ningún protocolo se puede hacer cumplir sobre un chat sin estado. Esta historia convierte esa regla de oro en el primer paso obligatorio del sistema: sin estos cuatro campos, una necesidad no puede existir (FR-E1-01).

---

## Acceptance Criteria

### AC-001

Given un líder está reportando una necesidad y completa responsable, cantidad o alcance, ubicación y fecha límite

When envía el reporte

Then el sistema crea la necesidad en estado `reportada` (FR-E1-01, FR-E1-02).

---

### AC-002

Given el formulario de reporte de necesidad

When falta alguno de los campos de la regla de oro (responsable, cantidad o alcance, ubicación, fecha límite)

Then el sistema no permite enviar el reporte (PRD sección 13, Validaciones: "el formulario de reporte de necesidad exige los campos de la regla de oro antes de enviar").

---

### AC-003

Given una necesidad recién reportada

When se consulta el portal público

Then la necesidad no es visible hasta que un líder la verifique (FR-E1-02).

---

## Business Rules

- BR-01 — La regla de oro: toda necesidad debe tener responsable, cantidad o alcance, ubicación, fecha límite y estado (manual sección 03).
- BR-02 — Cuatro estados de necesidad, no más: toda necesidad reportada inicia en el estado `reportada` (reportada → publicada → resuelta, o reportada → descartada).

---

## Edge Cases

OpenSpec sección 6 no documenta casos límite específicos para el paso de reporte inicial — los casos de reportes falsos o duplicados se resuelven en la verificación, no en el reporte (ver US-E1-02). No se agregan casos límite no documentados en las fuentes.

---

## Dependencies

**Internal Modules**
- E8 — Red, nodos, roles y permisos: el modelo geográfico (departamento → municipio) debe existir antes de poder ubicar la necesidad reportada (FR-E8-01).

**External APIs**
- Ninguna prevista para R1 (PRD sección 12).

**Other Stories**
- Ninguna — esta es la historia de entrada del flujo de E1; las demás dependen de ella.

**Infrastructure**
- Pendiente de la fase de Architecture (esquema de datos) — PRD sección 12.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo (ver README del repo). No inventar wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel:

- El formulario debe funcionar en conexión de datos móvil limitada, con lenguaje simple y sin depender de alta destreza digital (PRD sección 10, Performance y Accesibilidad).
- El reporte debe disparar el evento de analítica `necesidad_reportada` (PRD sección 14).
- Requiere timestamp de creación del reporte, independiente del timestamp de verificación (que corresponde a US-E1-02).

---

## Test Cases

### Unit Tests

- Validar que una necesidad no se puede crear si falta responsable, cantidad/alcance, ubicación o fecha límite.
- Validar que toda necesidad nueva inicia en estado `reportada`.

### Integration Tests

- Reportar una necesidad completa y confirmar que queda persistida en estado `reportada`.
- Confirmar que una necesidad en estado `reportada` no aparece en las consultas del portal público.

### Playwright E2E

- Completar el formulario de reporte con los cuatro campos de la regla de oro y verificar que el envío es exitoso.
- Intentar enviar el formulario con un campo obligatorio vacío y verificar que el sistema bloquea el envío.

---

## Technical Tasks

- [ ] TASK-E1-US01-01 (Dominio/datos) — Modelar la entidad Necesidad con los campos de la regla de oro (responsable, cantidad o alcance, ubicación, fecha límite) y su estado inicial `reportada`.
- [ ] TASK-E1-US01-02 (Lógica de negocio) — Implementar la validación que bloquea el envío del reporte si falta alguno de los campos obligatorios de la regla de oro.
- [ ] TASK-E1-US01-03 (Lógica de negocio) — Excluir las necesidades en estado `reportada` de cualquier consulta o listado del portal público.
- [ ] TASK-E1-US01-04 (Interfaz) — Construir el formulario de reporte de necesidad con los cuatro campos obligatorios, pensado para conexión móvil limitada y lenguaje simple (según el mockup de accesos por rol, pendiente).
- [ ] TASK-E1-US01-05 (Tests unit/integration) — Cubrir la validación de campos obligatorios, el estado inicial `reportada` y la no visibilidad en el portal público mientras la necesidad está `reportada`.
- [ ] TASK-E1-US01-06 (Tests E2E) — Automatizar el envío exitoso del formulario con los cuatro campos completos y el bloqueo del envío cuando falta un campo obligatorio.

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

**S — Media jornada.** Es un formulario de captura con cuatro campos obligatorios y una inicialización de estado fija; no involucra lógica de cálculo ni permisos por rol más allá de la existencia del nodo (E8).
