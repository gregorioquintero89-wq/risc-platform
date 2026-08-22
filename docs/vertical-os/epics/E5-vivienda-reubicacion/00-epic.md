---
owner: Gregorio Quintero
status: draft
title: "Epic E5 — Banco de viviendas y reubicación de familias"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E5 — Banco de viviendas y reubicación de familias

## Metadata

```yaml
Epic ID: E5
Epic Name: Banco de viviendas y reubicación de familias
Owner: Gregorio Quintero
Priority: Alta (R1.5, registro) — Media (R2, cruce)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Banco de viviendas y reubicación de familias (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Registrar propiedades disponibles y familias damnificadas desde el
día uno (R1.5), y en R2 cruzarlas mediante filtros duros —sin puntaje
de compatibilidad— para que el líder presente coincidencias y haga
seguimiento hasta el cierre (FR-E5-01 a FR-E5-07; OpenSpec G1 aplicado
al dominio de vivienda).

## Problem

Hay propietarios con inventario disponible (vivienda) que no llega a
las familias que lo necesitan (PRD sección 7, persona
propietario/inmobiliario). Llenar un banco de viviendas toma semanas de
llamadas de agentes — ese embudo debe arrancar antes de que exista el
motor de cruce, o R2 llega sin datos con los que cruzar (vault
`02 - Alcance y Epics`).

## Business Value

Dos decisiones cerradas sostienen el valor de esta epic:

- El registro (R1.5) empieza ya, aunque el cruce (R2) todavía no
  exista, porque cargar propiedades y familias verificadas es lo que
  toma tiempo real (vault `02 - Alcance y Epics`).
- El cruce se hace con filtros duros, no con un puntaje de
  compatibilidad inventado: *"no hay datos históricos para calibrar
  ese número, y el equipo confiaría en él precisamente porque parece
  preciso"* (vault `03 - Decisiones cerradas`, BR-07).

## Success Metrics

El PRD no define un KPI numérico propio para esta epic. Se propone,
coherente con los FR ya definidos:

- Propiedades y familias registradas y verificadas por semana (R1.5).
- Casos cruzados que prosperan / casos cruzados totales, siguiendo los
  estados de FR-E5-07 (prospera / no prospera → vuelve a cruce) (R2).

## User Stories

Pendiente — se crean en la fase de User Stories
(`15-User Story standard.md`), no antes.

## Dependencies

**Internal**
- E8 (Red, nodos, roles y permisos) — el líder que verifica titularidad
  de propiedad y registra familias opera dentro del mismo modelo de rol
  y nodo que protege el contacto (BR-06).

**External**
- Posible solape entre el registro de propiedades de E5 y Propertia —
  se verifica antes de especificar E5 a nivel de PRD; no bloquea R1
  porque E5 no entra en R1 (OpenSpec sección 8; vault
  `04 - Metodología`). Revisión pendiente contra
  `25-Core-Module-Strategy` del playbook VerticalOS antes de que
  Architecture defina el esquema.

**Technical**
- Pendiente de la fase de Architecture.

**Business**
- Aprobación de Cristian como stakeholder.
- Verificación de titularidad de propiedad por teléfono, sin carga de
  documentos de terceros (BR-09, FR-E5-02).

## Risks

- **Estafas en el banco de viviendas** (arrendador falso pidiendo
  depósito) — mitigado por cero dinero en la plataforma y verificación
  de titularidad por el líder antes de publicar (PRD sección 15; vault
  `06 - Pendientes y riesgos`).
- **Gouging en "arriendo solidario".** Necesita un tope de precio
  publicado antes de que E5 entre en producción. Gregorio Quintero
  decidió (20 ago 2026) diferir esa definición a una fase posterior —
  **no bloquea la planeación actual de E5/R2**, pero sigue siendo un
  requisito pendiente antes de producción: el riesgo de gouging no
  está mitigado mientras el tope no se defina (PRD sección 15).
- ~~**Municipios de Tolima y Chocó sin confirmar** — afecta en qué
  ciudades puede operar el registro de E5.~~ **Resuelto** — Tolima →
  Ibagué, Chocó → Quibdó (confirmado por Cristian, 20 ago 2026; PRD
  sección 15).
- **Riesgo de plazo**, con menor urgencia relativa por ser R1.5/R2 (PRD
  sección 15).

## Acceptance Criteria

Extraídos de OpenSpec sección 5:

- **AC-4 — Registro asistido de familia.** Dado que un líder registra
  una familia en campo, cuando completa el registro, entonces la
  familia queda verificada, con constancia de quién la cargó.
- **AC-5 — Autorregistro de familia.** Dado que una familia se
  autorregistra por el formulario público, cuando lo envía, entonces el
  registro entra como `reportada` y requiere verificación antes de
  estar disponible para cruce.
- **AC-6 — Cruce sin puntaje** (R2). Dado que existen propiedades y
  familias verificadas, cuando el líder aplica los filtros duros,
  entonces el sistema muestra únicamente las propiedades que cumplen
  todos los filtros, sin ordenarlas por un puntaje de compatibilidad.

## Definition of Ready

- [x] PRD aprobado.
- [x] Valor de negocio identificado.
- [x] Dependencias conocidas (solape con Propertia y tope de precio de
      "arriendo solidario" quedan abiertos — el tope de precio queda
      diferido a fase posterior, no cerrado — ver Dependencies y
      Risks).
- [ ] Stories creadas.
- [x] Criterios de aceptación definidos (R1.5 completos; R2 sujeto al
      tope de precio pendiente).

## Definition of Done

- [ ] Todas las User Stories completadas.
- [ ] Criterios de aceptación cumplidos.
- [ ] Tests pasan.
- [ ] Documentación actualizada.
- [ ] Aprobación del Product Owner.
