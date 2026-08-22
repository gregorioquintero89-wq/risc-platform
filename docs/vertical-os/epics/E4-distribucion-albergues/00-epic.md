---
owner: Gregorio Quintero
status: draft
title: "Epic E4 — Distribución y entrega a albergues"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E4 — Distribución y entrega a albergues

## Metadata

```yaml
Epic ID: E4
Epic Name: Distribución y entrega a albergues
Owner: Gregorio Quintero
Priority: Baja (R3)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Distribución y entrega a albergues (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Asignar inventario disponible a un albergue y cerrar el ciclo cuando el
albergue confirma la recepción, actualizando la necesidad
correspondiente (FR-E4-01 a FR-E4-03) — la última milla del ciclo
necesidad → donación que E1, E2 y E3 ya cierran a nivel de centro de
acopio.

## Problem

El inventario que ya está recibido y clasificado en un centro de acopio
(E3) no tiene, hoy, un mecanismo sistemático para llegar a un albergue
ni un punto de confirmación que le devuelva ese cierre a la necesidad
original.

## Business Value

Extiende el ciclo cerrado de R1 (necesidad → donación → recepción en
centro) hasta la entrega institucional final. Sin E4, el inventario
recibido puede quedar acumulado en el centro sin llegar a quien lo
necesita en un albergue.

## Success Metrics

El PRD no define un KPI numérico propio para esta epic. Se propone,
como traducción directa de FR-E4-02:

- Entregas a albergue confirmadas / entregas asignadas.

## User Stories

Pendiente — se crean en la fase de User Stories
(`15-User Story standard.md`), no antes.

## Dependencies

**Internal**
- E3 (Operación de centros de acopio e inventario) — el inventario que
  se asigna a un albergue (FR-E4-01) proviene del inventario
  registrado en un centro.
- E1 (Gestión de necesidades verificadas) — la confirmación de entrega
  actualiza la necesidad correspondiente (FR-E4-03).

**External**
- Albergues como actores externos — coordinación operativa, sin
  integración técnica documentada en OpenSpec ni PRD.

**Technical**
- Pendiente de la fase de Architecture.

**Business**
- Aprobación de Cristian como stakeholder.
- Por ser R3, su construcción depende del orden de release ya definido
  (R1 → R1.5 → R2 → R3) — PRD sección 18.

## Risks

Ninguno identificado más allá de los riesgos generales del PRD. El
riesgo de plazo (PRD sección 15) aplica con menor peso relativo por ser
la epic de menor prioridad y último release.

## Acceptance Criteria

El OpenSpec no incluye a E4 en su lista de AC-1 a AC-6, y el PRD
sección 17 tampoco define un criterio propio para esta epic. Los
criterios de aceptación a nivel epic se derivan directamente de los
requisitos funcionales de OpenSpec sección 3:

- Se asigna inventario disponible a un albergue (FR-E4-01).
- El albergue confirma la recepción de la entrega (FR-E4-02).
- La confirmación de recepción actualiza automáticamente la necesidad
  correspondiente (FR-E4-03).

## Definition of Ready

- [x] PRD aprobado.
- [x] Valor de negocio identificado.
- [x] Dependencias conocidas.
- [ ] Stories creadas.
- [x] Criterios de aceptación definidos (derivados de los FR, sin AC
      propio en OpenSpec/PRD).

## Definition of Done

- [ ] Todas las User Stories completadas.
- [ ] Criterios de aceptación cumplidos.
- [ ] Tests pasan.
- [ ] Documentación actualizada.
- [ ] Aprobación del Product Owner.
