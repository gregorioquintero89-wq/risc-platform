---
owner: Gregorio Quintero
status: draft
title: "Epic E9 — Transparencia pública y auditoría"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E9 — Transparencia pública y auditoría

## Metadata

```yaml
Epic ID: E9
Epic Name: Transparencia pública y auditoría
Owner: Gregorio Quintero
Priority: Alta (R1, básico)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Transparencia pública y auditoría (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Mostrar públicamente, sin necesidad de cuenta, que RISC verifica antes
de publicar, y dejar registrada toda acción relevante del sistema
—quién, qué, cuándo— sin trabajo adicional del usuario (OpenSpec G4;
PRD sección 5, objetivos técnicos).

## Problem

Sin un contador público ni una bitácora de auditoría, RISC no tiene
forma de demostrar que su verificación es real y no solo un protocolo
en el papel. Es un problema de credibilidad, no solo de trazabilidad
interna: la diferencia frente a CaliSolidario tiene que ser visible
para quien entra al portal, no solo cierta puertas adentro.

## Business Value

CaliSolidario declara textualmente en su propio header: *"CaliSolidario
no verifica los avisos"* (vault `05 - Referencias y competencia`). RISC
existe por la razón contraria — el manual entero (secciones 07, 08, 11,
12) se sostiene sobre que nada se publica sin verificar. E9 es lo que
convierte esa diferencia en algo que el público puede ver, no solo en
una promesa (FR-E9-03).

## Success Metrics

El PRD no define un KPI numérico exclusivo de esta epic. Se propone,
como traducción directa de FR-E9-02 (toda acción relevante queda
registrada) y del requisito no funcional de auditoría inmutable (PRD
sección 10):

- 100% de las acciones relevantes (verificar, publicar, comprometer
  donación, recibir, cerrar) con registro de quién y cuándo.
- Contador público de necesidades resueltas visible y actualizado
  (FR-E9-01).

## User Stories

- [E9-US-01 — Contador público de necesidades resueltas](./US-01-contador-necesidades-resueltas.md) (FR-E9-01)
- [E9-US-02 — Bitácora de auditoría de acciones relevantes](./US-02-bitacora-auditoria-acciones.md) (FR-E9-02)
- [E9-US-03 — Mensaje público de verificación antes de publicar](./US-03-mensaje-verificacion-publica.md) (FR-E9-03)

## Dependencies

**Internal**
- E1, E2, E3 — generan los eventos que E9 debe auditar (verificar,
  publicar, comprometer, recibir).
- E8 (Red, nodos, roles y permisos) — la bitácora necesita saber qué
  rol y qué nodo ejecutó cada acción.

**External**
- Ninguna API externa planeada para R1 (PRD sección 12).

**Technical**
- Pendiente de la fase de Architecture (esquema de bitácora
  inmutable).

**Business**
- Aprobación de Cristian como stakeholder.
- Eventos mínimos de analítica ya definidos para R1 (PRD sección 14):
  `necesidad_reportada`, `necesidad_verificada`, `necesidad_publicada`,
  `necesidad_descartada`, `necesidad_resuelta`, `donacion_comprometida`,
  `donacion_recibida`, `centro_acopio_creado`.

## Risks

- **Riesgo de plazo** (PRD sección 15).
- Ninguno identificado más allá de los riesgos generales del PRD; el
  PRD indica explícitamente que los riesgos técnicos (donde aplicaría
  el diseño de una bitácora inmutable) aparecen recién en la fase de
  Architecture (PRD sección 15).

## Acceptance Criteria

Extraídos de OpenSpec sección 5 y PRD sección 17:

- Parte de **AC-1 — Verificación y publicación**: la necesidad pasa a
  `publicada` y se vuelve visible en el portal público — visibilidad
  pública es responsabilidad de E9.
- Toda acción relevante (verificar, publicar, comprometer donación,
  recibir, cerrar) queda registrada con quién y cuándo (FR-E9-02,
  manual sección 29).
- El portal público muestra un contador de necesidades resueltas
  (FR-E9-01).
- El portal público muestra, sin necesidad de cuenta, que RISC verifica
  antes de publicar — a diferencia explícita de CaliSolidario
  (FR-E9-03; PRD sección 17).

## Definition of Ready

- [x] PRD aprobado.
- [x] Valor de negocio identificado.
- [x] Dependencias conocidas.
- [x] Stories creadas.
- [x] Criterios de aceptación definidos.

## Definition of Done

- [ ] Todas las User Stories completadas.
- [ ] Criterios de aceptación cumplidos.
- [ ] Tests pasan.
- [ ] Documentación actualizada.
- [ ] Aprobación del Product Owner.
