---
owner: Gregorio Quintero
status: draft
title: "Epic E1 — Gestión de necesidades verificadas"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E1 — Gestión de necesidades verificadas

## Metadata

```yaml
Epic ID: E1
Epic Name: Gestión de necesidades verificadas
Owner: Gregorio Quintero
Priority: Alta (R1)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Gestión de necesidades verificadas (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Convertir la "regla de oro" del Manual Operativo v1.0 —responsable,
cantidad o alcance, ubicación, fecha límite y estado— en un sistema que
cualquier líder pueda operar sin depender de su memoria (PRD sección 5,
objetivos de producto). Cierra el primer tramo del ciclo
necesidad → donación → entrega: nada se publica sin verificación humana,
y el faltante se recalcula solo con cada donación recibida (OpenSpec
G1, G2).

## Problem

Hoy las necesidades se comunican por mensaje de voz en WhatsApp y se
pierden en el hilo. Nadie puede responder cuánto falta de qué ni quién
lo está gestionando (PRD sección 3, "Dolor"). El manual ya define el
protocolo completo, pero ningún protocolo se puede hacer cumplir sobre
un hilo de chat sin estado, sin responsable asignado y sin
trazabilidad (PRD sección 4, Declaración del problema).

## Business Value

> "Cada solicitud debe tener responsable, prioridad, cantidad o
> alcance, ubicación, fecha límite y estado." — Manual Operativo v1.0,
> sección 03.

Esa frase es, literalmente, el esquema de la tabla `necesidades`
(vault `01 - Contexto del cliente`). E1 es además el diferenciador
frente a CaliSolidario, que declara explícitamente "no verifica los
avisos" (vault `05 - Referencias y competencia`). Si el sistema no hace
cumplir la verificación, RISC se convierte en el mismo problema que
dice venir a resolver (OpenSpec G4).

## Success Metrics

KPIs ya definidos en PRD sección 16 que miden directamente esta epic:

- Necesidades resueltas / necesidades publicadas (tasa de cierre).
- Tiempo promedio entre publicación y resolución.
- % de necesidades reportadas que se verifican en menos de 24 h.

## User Stories

Creadas siguiendo `15-User Story standard.md`:

- [E1-US-01 — Reportar una necesidad con la regla de oro](./US-01-reportar-necesidad-regla-de-oro.md)
- [E1-US-02 — Líder verifica y publica o descarta una necesidad](./US-02-verificar-publicar-descartar.md)
- [E1-US-03 — El faltante se recalcula automáticamente con cada donación](./US-03-recalculo-automatico-faltante.md)
- [E1-US-04 — La necesidad pasa a resuelta automáticamente al llegar el faltante a 0](./US-04-resolucion-automatica-necesidad.md)
- [E1-US-05 — El orden de necesidades se deriva de fecha límite y faltante, sin prioridad manual](./US-05-orden-automatico-sin-prioridad-manual.md)

## Dependencies

**Internal**
- E8 (Red, nodos, roles y permisos) — el rol de líder que verifica y
  publica (FR-E8-02) debe existir antes de que E1 tenga quién ejecute
  FR-E1-03.
- E9 (Transparencia pública y auditoría) — la verificación debe quedar
  registrada con quién y cuándo (FR-E1-07, FR-E9-02).

**External**
- Ninguna API externa planeada para R1 (PRD sección 12).

**Technical**
- Pendiente de la fase de Architecture (esquema de datos, RLS) — PRD
  sección 12.

**Business**
- Aprobación de Cristian como stakeholder (OpenSpec sección 9,
  pendiente de checklist).
- Estructura mínima de nodo (líder + suplente + equipo de apoyo) activa
  antes de que ese nodo publique necesidades (manual sección 04; vault
  `06 - Pendientes y riesgos`).

## Risks

- **Riesgo de plazo.** La ventana operativa de la emergencia se mide en
  semanas; el valor de la plataforma decae con cada semana de atraso
  (PRD sección 15).
- **Dependencia de una sola persona por nodo.** Si el líder no está,
  no hay quien verifique una necesidad reportada (PRD sección 15,
  riesgo operacional; manual sección 04).
- ~~**Municipios de Tolima y Chocó sin confirmar.** Bloquea que R1
  salga al aire en esos dos departamentos — no bloquea el resto del
  PRD.~~ **Resuelto** — Tolima → Ibagué, Chocó → Quibdó (confirmado
  por Cristian, 20 ago 2026; PRD sección 15; vault
  `06 - Pendientes y riesgos`).

## Acceptance Criteria

Extraídos de OpenSpec sección 5 y PRD sección 17:

- **AC-1 — Verificación y publicación.** Dado que un líder revisa una
  necesidad `reportada`, cuando confirma que es real y completa la
  regla de oro, entonces la necesidad pasa a `publicada` y se vuelve
  visible en el portal público.
- El faltante se calcula como necesario − recibido y se recalcula
  automáticamente con cada donación registrada (FR-E1-04); la
  necesidad pasa a `resuelta` sola cuando el faltante llega a 0
  (FR-E1-05) — el disparador de esta transición vive en E2/E3, pero el
  estado y el cálculo pertenecen a E1.
- Un líder puede verificar y publicar una necesidad desde su teléfono
  sin fricción innecesaria (PRD sección 17).
- No existe campo de prioridad editable; el orden de atención se
  deriva de fecha límite y faltante (FR-E1-06).

## Definition of Ready

- [x] PRD aprobado.
- [x] Valor de negocio identificado.
- [x] Dependencias conocidas (algunas con puntos abiertos — ver
      Dependencies).
- [x] Stories creadas.
- [x] Criterios de aceptación definidos.

## Definition of Done

- [ ] Todas las User Stories completadas.
- [ ] Criterios de aceptación cumplidos.
- [ ] Tests pasan.
- [ ] Documentación actualizada.
- [ ] Aprobación del Product Owner.
