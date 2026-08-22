---
owner: Gregorio Quintero
status: draft
title: "Epic E3 — Operación de centros de acopio e inventario"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E3 — Operación de centros de acopio e inventario

## Metadata

```yaml
Epic ID: E3
Epic Name: Operación de centros de acopio e inventario
Owner: Gregorio Quintero
Priority: Alta (R1)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Operación de centros de acopio e inventario (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Dar a cada centro de acopio un inventario real por producto, con
entradas y salidas registradas, de modo que la recepción física de una
donación actualice automáticamente el faltante de la necesidad
asociada (FR-E3-04, OpenSpec G2).

## Problem

Sin control de inventario centralizado, un centro de acopio puede
operar como un depósito sin control: recibir o movilizar grandes
cantidades sin que exista una necesidad identificada que las justifique
(manual sección 06). Eso reproduce exactamente el problema que RISC
busca resolver — donaciones que no corresponden a lo que hace falta.

## Business Value

E3 es el punto donde el compromiso de un donante se convierte en algo
físico y verificable: quién entrega, qué entrega, cuánto entrega
(FR-E3-02). Sin este registro, el cierre automático del ciclo
necesidad → donación (E1, E2) no tiene datos reales de los que partir.

## Success Metrics

El PRD (sección 16) no define un KPI propio para esta epic; los más
cercanos —tasa de conversión comprometida/recibida y tiempo promedio
publicación-resolución— dependen de que E3 registre a tiempo. Se
propone, coherente con esos KPIs y con FR-E3-04:

- Tiempo promedio entre recepción física en el centro y actualización
  del inventario/faltante en el sistema.

## User Stories

- [E3-US-01 — Registrar un centro de acopio](US-01-registro-centro-acopio.md) (FR-E3-01)
- [E3-US-02 — Registrar la recepción de una donación](US-02-registro-recepcion-donacion.md) (FR-E3-02)
- [E3-US-03 — Mantener inventario por producto y centro](US-03-inventario-por-producto-y-centro.md) (FR-E3-03)
- [E3-US-04 — Actualizar el faltante al registrar una entrada de inventario](US-04-entrada-inventario-actualiza-faltante.md) (FR-E3-04)
- [E3-US-05 — Consultar al líder para movilizar grandes cantidades sin necesidad identificada](US-05-consulta-lider-grandes-cantidades.md) (FR-E3-05)
- [E3-US-06 — Registrar una donación presencial sin código previo](US-06-donacion-presencial-sin-codigo.md) (FR-E3-06 — nueva, cubre el walk-in que E3-US-02 dejaba fuera de alcance; decisión Gregorio Quintero, 21 ago 2026)

## Dependencies

**Internal**
- E1 (Gestión de necesidades verificadas) — el faltante que se
  actualiza (FR-E3-04) pertenece a una necesidad `publicada` de E1.
- E2 (Captación y trazabilidad de donaciones) — E3 registra la
  recepción de una donación previamente comprometida en E2.
- E8 (Red, nodos, roles y permisos) — cada centro tiene un responsable
  y cuelga de un nodo/municipio (FR-E3-01, FR-E8-01).

**External**
- Ninguna API externa planeada para R1 (PRD sección 12).

**Technical**
- Pendiente de la fase de Architecture.

**Business**
- Aprobación de Cristian como stakeholder.
- Movilizar o solicitar grandes cantidades sin una necesidad
  identificada requiere consultar antes al líder — el centro no opera
  con autonomía total (manual sección 06, FR-E3-05).

## Risks

- **Riesgo de plazo** (PRD sección 15).
- **Dependencia de una sola persona por nodo.** Sin estructura mínima
  (líder + suplente + equipo de apoyo), no hay quien opere el centro
  (PRD sección 15; manual sección 04).
- ~~**Municipios de Tolima y Chocó sin confirmar.** Bloquea activar un
  centro de acopio en esos departamentos hasta que se confirme el
  municipio.~~ **Resuelto** — Tolima → Ibagué, Chocó → Quibdó
  (confirmado por Cristian, 20 ago 2026; PRD sección 15).

## Acceptance Criteria

Extraídos de OpenSpec sección 5 y PRD sección 17:

- Cada centro de acopio tiene ciudad, ubicación, responsable y horario
  (FR-E3-01).
- Se mantiene inventario por producto y por centro, con entradas y
  salidas (FR-E3-03).
- Parte de **AC-2 — Donación cierra el ciclo**: cuando el centro
  registra la recepción de una donación comprometida, el faltante de
  la necesidad se recalcula y, si llega a 0, la necesidad pasa a
  `resuelta` sin intervención manual.
- Un centro de acopio puede confirmar una entrega y ver el inventario
  actualizado en el momento (PRD sección 17).

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
