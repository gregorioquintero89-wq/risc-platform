---
owner: Gregorio Quintero
status: draft
title: "Epic E7 — Articulación institucional y programas de apoyo"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E7 — Articulación institucional y programas de apoyo

## Metadata

```yaml
Epic ID: E7
Epic Name: Articulación institucional y programas de apoyo
Owner: Gregorio Quintero
Priority: Baja (R3)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Articulación institucional y programas de apoyo (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Mantener un listado de programas institucionales verificados —entidad,
requisitos, documentos, canal oficial— y registrar el estado de un caso
remitido a una entidad, dejando siempre explícito que la aprobación
depende exclusivamente de esa entidad y no de RISC (FR-E7-01 a
FR-E7-03; BR-10).

## Problem

Familias y donantes no tienen forma de saber qué programas
institucionales existen, qué requieren, ni en qué estado está un caso
que ya fue remitido a una entidad. Sin esta epic, además, RISC corre el
riesgo de que se le atribuya responsabilidad sobre resultados que no
controla (aprobación de subsidios, trámites de gobierno).

## Business Value

RISC "no es una entidad gubernamental, no reemplaza Gestión del Riesgo,
no es una ONG médica, no promete subsidios. Es una red de articulación
y solidaridad" (vault `01 - Contexto del cliente`). E7 centraliza
información institucional verificada sin que RISC asuma un rol que no
le corresponde — protege tanto a la familia (sabe a dónde ir) como a
RISC (no queda como responsable de un trámite ajeno) (manual sección
10, BR-10).

## Success Metrics

El PRD no define un KPI numérico propio para esta epic. Se propone,
como traducción directa de FR-E7-02:

- Casos remitidos con estado actualizado (orientado / remitido / en
  trámite / cerrado) / total de casos remitidos.

## User Stories

Pendiente — se crean en la fase de User Stories
(`15-User Story standard.md`), no antes.

## Dependencies

**Internal**
- E8 (Red, nodos, roles y permisos) — la remisión de un caso la
  gestiona un rol dentro del mismo modelo de nodo.

**External**
- Entidades gubernamentales, alcaldías, Cruz Roja y demás entidades
  competentes — RISC depende de que existan y respondan, sin control
  sobre sus tiempos ni decisiones (BR-10).

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

El OpenSpec no incluye a E7 en su lista de AC-1 a AC-6, y el PRD
sección 17 tampoco define un criterio propio para esta epic. Los
criterios de aceptación a nivel epic se derivan directamente de los
requisitos funcionales de OpenSpec sección 3:

- Se mantiene un listado de programas institucionales verificados:
  entidad, requisitos, documentos, canal oficial (FR-E7-01).
- Se registra el estado de un caso remitido a una entidad (orientado /
  remitido / en trámite / cerrado) (FR-E7-02).
- Se muestra siempre la advertencia de que la aprobación depende
  exclusivamente de la entidad responsable, no de RISC (FR-E7-03,
  BR-10).

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
