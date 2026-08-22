---
owner: Gregorio Quintero
status: draft
title: "Epic E6 — Banco de recursos logísticos"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E6 — Banco de recursos logísticos

## Metadata

```yaml
Epic ID: E6
Epic Name: Banco de recursos logísticos
Owner: Gregorio Quintero
Priority: Media (R2)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Banco de recursos logísticos (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Agrupar por ciudad los recursos logísticos que ofrecen los aliados
—transporte, bodega, voluntarios, otros— y permitir que un líder
solicite transporte y el sistema notifique a los aliados disponibles
(FR-E6-01 a FR-E6-03).

## Problem

Los recursos logísticos que ofrecen los aliados no están registrados
ni son descubribles por ciudad: cuando un líder necesita transporte, no
tiene visibilidad de qué hay disponible ni cómo pedirlo. Es la misma
falla de coordinación de E1/E2 —protocolo en la memoria de una
persona— aplicada al lado de la oferta logística en vez de al lado de
la donación.

## Business Value

Completa el mapa de personas del PRD: el aliado logístico ofrece
transporte, bodega o voluntarios (PRD sección 7), pero sin un banco de
recursos esa oferta no se conecta con la necesidad de movilizar algo
desde un centro de acopio (E3) hacia donde haga falta.

## Success Metrics

El PRD no define un KPI numérico propio para esta epic. Se propone,
como traducción directa de FR-E6-03:

- Solicitudes de transporte con respuesta de un aliado disponible /
  total de solicitudes.

## User Stories

Pendiente — se crean en la fase de User Stories
(`15-User Story standard.md`), no antes.

## Dependencies

**Internal**
- E8 (Red, nodos, roles y permisos) — los recursos y las solicitudes se
  agrupan por ciudad/nodo (FR-E6-02).
- Relación funcional con E4 (Distribución y entrega a albergues, R3):
  E6 provee el transporte que E4 eventualmente necesita, aunque no es
  una dependencia bloqueante documentada en OpenSpec ni PRD.

**External**
- Ninguna documentada en OpenSpec ni PRD.

**Technical**
- Pendiente de la fase de Architecture, incluyendo el mecanismo de
  notificación a aliados disponibles (FR-E6-03).

**Business**
- Aprobación de Cristian como stakeholder.

## Risks

- **Riesgo de plazo**, con menor urgencia relativa por ser R2 (PRD
  sección 15).
- Ninguno identificado más allá de los riesgos generales del PRD.

## Acceptance Criteria

El OpenSpec no incluye a E6 en su lista de AC-1 a AC-6, y el PRD
sección 17 tampoco define un criterio propio para esta epic. Los
criterios de aceptación a nivel epic se derivan directamente de los
requisitos funcionales de OpenSpec sección 3:

- Un aliado puede ofrecer recursos: transporte, bodega, voluntarios,
  otros (FR-E6-01).
- Los recursos ofrecidos quedan agrupados por ciudad en un banco de
  recursos (FR-E6-02).
- Cuando un líder solicita transporte, el sistema notifica a los
  aliados disponibles de esa ciudad (FR-E6-03).

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
