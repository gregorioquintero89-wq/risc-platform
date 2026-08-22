---
owner: Gregorio Quintero
status: draft
title: "Epic E8 — Red, nodos, roles y permisos"
type: epic
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - epic
---

# Epic E8 — Red, nodos, roles y permisos

## Metadata

```yaml
Epic ID: E8
Epic Name: Red, nodos, roles y permisos
Owner: Gregorio Quintero
Priority: Alta (R1)
Status: draft
Related PRD: docs/vertical-os/03-PRD.md
Related Business Capability: Red, nodos, roles y permisos (= este Epic; en RISC, Business Capability = Epic 1:1 — epics/README.md)
```

## Objective

Modelar la red geográfica de RISC (departamento → municipio, todo nodo
cuelga siempre de un municipio) y los roles que operan sobre ella —
líder de ciudad/nodo, suplente de ciudad/nodo, operador de centro de
acopio, administrador nacional— para que el contacto de familias y
propietarios sea estructuralmente visible solo para el líder o el
suplente verificados de su propio nodo (OpenSpec G3, FR-E8-01 a
FR-E8-07).

## Problem

Sin un modelo de nodos y roles explícito, no hay forma de garantizar
que un "líder" solo vea la información de su propio municipio, ni de
saber qué usuario tiene qué rol en qué nodo. Es el problema fundacional
del que dependen todas las demás epics: ninguna puede proteger contacto
de población vulnerable si el sistema no sabe, a nivel de dato, a qué
nodo pertenece cada usuario y cada registro.

## Business Value

El contacto de familias y propietarios debe ser inaccesible fuera del
líder de su nodo **a nivel de sistema, no de interfaz** (BR-06, PRD
sección 10). El vault de metodología identifica este patrón —
multi-tenancy geográfico con roles por nodo y bitácora de auditoría—
como un candidato fuerte a módulo Core reutilizable, porque ya se
repite en otros productos del portafolio (La Reserva ERP, Can Friend
Studio) (vault `04 - Metodología`).

## Success Metrics

El PRD no define un KPI numérico propio para esta epic; el requisito
no funcional de seguridad asociado (PRD sección 10) es la base. Se
propone, coherente con AC-3:

- 0 incidentes de acceso cruzado de contacto entre nodos.

## User Stories

- [E8-US-01 — Modelo departamento → municipio](./US-01-modelo-departamento-municipio.md) (FR-E8-01)
- [E8-US-02 — Asignación de líder a un nodo](./US-02-asignacion-lider-nodo.md) (FR-E8-02, FR-E8-06 — extendida el 21 ago 2026 para cubrir también la asignación de suplente, con los mismos permisos que el líder sobre su nodo)
- [E8-US-03 — Aislamiento de datos por nodo](./US-03-aislamiento-datos-por-nodo.md) (FR-E8-03, BR-06 — crítica de seguridad)
- [E8-US-04 — Rol de administrador nacional](./US-04-administrador-nacional.md) (FR-E8-04)
- [E8-US-05 — Registro de roles por usuario y nodo](./US-05-registro-roles-usuario-nodo.md) (FR-E8-05, FR-E8-06, FR-E8-07 — el registro cubre también las asignaciones de suplente y de operador de centro de acopio)

No se crea una story nueva para el rol de suplente (FR-E8-06): se
cubre extendiendo E8-US-02 (asignación) y E8-US-05 (registro), porque
el suplente reutiliza el mismo mecanismo de asignación y el mismo
registro consultable que el líder — no es un flujo ni un modelo de
datos distinto (decisión Gregorio Quintero, 21 ago 2026).

El rol de operador de centro de acopio (FR-E8-07) se registra con el
mismo mecanismo de nodo que líder y suplente (FR-E8-02, FR-E8-06):
tampoco requiere story nueva, se cubre extendiendo E8-US-05 (registro).
A diferencia del líder y del suplente, el operador no tiene visibilidad
de todo el nodo (FR-E8-03); su alcance práctico es el centro o los
centros de los que sea responsable (decisión Gregorio Quintero, 21 ago
2026).

## Dependencies

**Internal**
- Es la base de la que dependen E1, E2, E3, E5 y E9 — todas necesitan
  saber a qué nodo pertenece cada actor y cada registro antes de
  aplicar sus propias reglas de visibilidad.

**External**
- Ninguna API externa planeada para R1 (PRD sección 12).

**Technical**
- El aislamiento de contacto por nodo se aplica con RLS (Row Level
  Security) en Postgres, no con lógica de aplicación — decisión ya
  cerrada con Cristian (vault `03 - Decisiones cerradas`). La
  implementación formal del esquema corresponde a la fase de
  Architecture.
- Revisión cruzada pendiente contra `25-Core-Module-Strategy` del
  playbook VerticalOS antes de que Architecture defina el esquema de
  E8 (PRD sección 12; OpenSpec sección 9).

**Business**
- Aprobación de Cristian como stakeholder.
- Cada nodo requiere estructura mínima (líder + suplente + equipo de
  apoyo) antes de activarse (manual sección 04; OpenSpec sección 8).

## Risks

- **Dependencia de una sola persona por nodo.** Sin líder + suplente +
  equipo de apoyo, la plataforma es "una base de datos vacía con un
  formulario bonito adelante" (manual sección 04, citado en PRD sección
  15). ~~El suplente no estaba formalizado como rol del sistema con
  permisos propios — quedaba como gap abierto (ver US-02, Edge
  Cases).~~ Resuelto (Gregorio Quintero, 21 ago 2026): el suplente es
  ahora un rol formal de E8 (FR-E8-06), con los mismos permisos que el
  líder sobre su propio nodo — puede verificar necesidades, responder
  consultas de movilización (FR-E3-05) y actuar en general en ausencia
  del líder. No es un rol de menor jerarquía: es un segundo líder del
  mismo nodo, para que la operación no dependa de una sola persona.
- **Exposición de datos de familias damnificadas** si la restricción de
  contacto por nodo falla — mitigado por BR-06, a validar en
  Architecture (PRD sección 15).
- ~~**Municipios de Tolima y Chocó sin confirmar.** El modelo
  geográfico de esta epic depende de que Cristian confirme el
  municipio concreto en cada departamento — bloquea el go-live de R1
  ahí.~~ **Resuelto** — Cristian confirmó Tolima → Ibagué, Chocó →
  Quibdó el 20 ago 2026 (PRD sección 15; vault
  `06 - Pendientes y riesgos`).
- **Riesgo de plazo** (PRD sección 15).

## Acceptance Criteria

Extraídos de OpenSpec sección 5 y PRD sección 17:

- **AC-3 — Aislamiento de contacto por nodo.** Dado que un líder
  pertenece al nodo de Cali, cuando consulta necesidades o familias,
  entonces no puede ver el contacto de familias o propietarios de otro
  municipio.
- El modelo geográfico es departamento → municipio; todo nodo RISC
  cuelga de un municipio concreto, nunca de un departamento
  directamente (FR-E8-01).
- Existe un rol de administrador nacional con visibilidad de todos los
  nodos (FR-E8-04); queda registrado qué usuario tiene qué rol en qué
  nodo (FR-E8-05).
- Existe un rol de suplente de ciudad/nodo, con los mismos permisos
  que el líder sobre su propio nodo — no es un rol de menor jerarquía
  (FR-E8-06, decisión Gregorio Quintero, 21 ago 2026).
- Ningún usuario fuera del líder o del suplente de un nodo puede ver
  el contacto de una familia o propietario de ese nodo (PRD sección
  17; FR-E8-06).
- Existe un rol de operador de centro de acopio, registrado a nivel de
  nodo con el mismo mecanismo que líder y suplente, pero sin la
  visibilidad de todo el nodo que tienen ambos — su alcance práctico es
  el centro o los centros de los que sea responsable (FR-E8-07,
  decisión Gregorio Quintero, 21 ago 2026).

## Definition of Ready

- [x] PRD aprobado.
- [x] Valor de negocio identificado.
- [x] Dependencias conocidas (municipio de Tolima/Chocó ya confirmado
      — ver Risks).
- [x] Stories creadas.
- [x] Criterios de aceptación definidos.

## Definition of Done

- [ ] Todas las User Stories completadas.
- [ ] Criterios de aceptación cumplidos.
- [ ] Tests pasan.
- [ ] Documentación actualizada.
- [ ] Aprobación del Product Owner.
