---
owner: Gregorio Quintero
status: draft
title: "Epic E2 — Captación y trazabilidad de donaciones"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E2 — Captación y trazabilidad de donaciones

## Metadata

```yaml
Epic ID: E2
Epic Name: Captación y trazabilidad de donaciones
Owner: Gregorio Quintero
Priority: Alta (R1)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Captación y trazabilidad de donaciones (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Cerrar el ciclo necesidad → donación sin intervención manual (OpenSpec
G2): que un donante vea exactamente qué falta, se comprometa con una
cantidad, y que esa donación quede trazada con código único desde que
se compromete hasta que el centro de acopio confirma la entrega
(FR-E2-01 a FR-E2-06).

## Problem

Después de una emergencia la voluntad de ayudar aparece rápido, pero
sin organización pasan tres cosas: llegan donaciones que no
corresponden a lo que hace falta, se duplican esfuerzos, y las familias
siguen esperando (PRD sección 3, "Dolor"; manual sección 02). Sin un
código y un estado por donación, tampoco hay forma de saber si algo
prometido realmente llegó.

## Business Value

Cierra el journey principal de R1 (PRD sección 8): el donante ve
necesidades publicadas, elige ciudad y categoría, se compromete, recibe
código, entrega, y el centro confirma — sin que nadie tenga que
corregir un número a mano. Es el release que Cristian priorizó
explícitamente sobre vivienda por ser "el ciclo cerrado" más urgente y
más simple de completar (vault `02 - Alcance y Epics`).

## Success Metrics

KPI de producto ya definido en PRD sección 16, específico de esta
epic:

- Donaciones comprometidas vs. recibidas (tasa de conversión — detecta
  fricción en la entrega física).

## User Stories

- **E2-US-01** — Ver necesidades publicadas y filtrar por ciudad/categoría
  (FR-E2-01) → [US-01-ver-necesidades-filtrar.md](./US-01-ver-necesidades-filtrar.md)
- **E2-US-02** — Comprometer una donación con código único (FR-E2-02,
  FR-E2-03) → [US-02-comprometer-donacion.md](./US-02-comprometer-donacion.md)
- **E2-US-03** — Confirmar recepción de una donación en el centro de
  acopio (FR-E2-04) → [US-03-confirmar-recepcion.md](./US-03-confirmar-recepcion.md)
- **E2-US-04** — Código presentado no coincide: revisión de operador, no
  rechazo automático (FR-E2-05) → [US-04-codigo-no-coincide.md](./US-04-codigo-no-coincide.md)
- **E2-US-05** — Consultar el estado de una donación comprometida
  (FR-E2-06) → [US-05-consultar-estado-donacion.md](./US-05-consultar-estado-donacion.md)

## Dependencies

**Internal**
- E1 (Gestión de necesidades verificadas) — solo existen donaciones
  sobre necesidades ya `publicada` (FR-E2-01).
- E3 (Operación de centros de acopio e inventario) — el estado de una
  donación pasa a `recibida` únicamente cuando el centro confirma la
  entrega (FR-E2-04).

**External**
- Ninguna API externa planeada para R1 (PRD sección 12).

**Technical**
- Pendiente de la fase de Architecture.

**Business**
- Aprobación de Cristian como stakeholder.
- RISC no recibe, custodia ni intermedia dinero en ningún release
  planeado (BR-05) — la donación es siempre en especie, nunca en
  efectivo.

## Risks

- **Riesgo de plazo** (PRD sección 15).
- ~~Caso límite sin cerrar: qué pasa cuando una donación excede el
  faltante.~~ Resuelto (Gregorio Quintero, 20 ago 2026): no se reserva
  el faltante al comprometer (FR-E2-02); el sistema no limita cuántas
  donaciones se comprometen en simultáneo para una misma necesidad. Si
  el conjunto de donaciones concurrentes excede el faltante, se reciben
  igual y el excedente queda como inventario del centro de acopio — no
  se rechaza ni se redirige. Decisión consciente de mantener el
  ejercicio simple: sin reserva de inventario al comprometer, sobre-
  inventario ocasional es un resultado aceptado, no un bug (ver
  OpenSpec sección 6 y FR-E1-04).

## Acceptance Criteria

Extraídos de OpenSpec sección 5 y PRD sección 17:

- **AC-2 — Donación cierra el ciclo.** Dado que una necesidad publicada
  tiene faltante mayor a 0, cuando un centro de acopio registra la
  recepción de una donación comprometida, entonces el faltante se
  recalcula y, si llega a 0, la necesidad pasa a `resuelta` sin
  intervención manual.
- Un donante puede comprometer una donación y saber exactamente dónde
  entregarla (PRD sección 17).
- Si el código presentado no coincide con una donación registrada,
  queda marcada para revisión de un operador — no se rechaza
  automáticamente (FR-E2-05; caso límite de OpenSpec sección 6).
- El donante puede consultar el estado de su donación en cualquier
  momento (FR-E2-06).

## Definition of Ready

- [x] PRD aprobado.
- [x] Valor de negocio identificado.
- [x] Dependencias conocidas (quedan puntos abiertos — caso límite del
      excedente y la hipótesis de tope al faltante — ver Risks).
- [x] Stories creadas.
- [x] Criterios de aceptación definidos.

## Definition of Done

- [ ] Todas las User Stories completadas.
- [ ] Criterios de aceptación cumplidos.
- [ ] Tests pasan.
- [ ] Documentación actualizada.
- [ ] Aprobación del Product Owner.
