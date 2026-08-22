---
owner: Gregorio Quintero
status: draft
title: "US-E8-04 — Rol de administrador nacional"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E8
---

# US-E8-04 — Rol de administrador nacional

## Metadata

```yaml
Story ID: E8-US-04
Title: Rol de administrador nacional
Business Capability: E8 — Red, nodos, roles y permisos
Epic: E8
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** administrador nacional de RISC

> **I want** tener visibilidad de todos los nodos activos de la red,
> no solo de uno

> **So that** pueda supervisar el estado general de la operación sin
> depender de que cada líder reporte manualmente lo que pasa en su
> ciudad (extensión de G1 — sacar la coordinación de la memoria de una
> persona — a nivel nacional).

---

## Business Context

El PRD (sección 7) define al administrador nacional como una persona
secundaria con "visión de todos los nodos". A diferencia de un líder,
que está estructuralmente limitado a su propio municipio (E8-US-03),
el administrador nacional necesita ver la red completa para poder
supervisarla — sin este rol, no hay forma de responder preguntas de
alcance nacional sin pedirle a cada líder que reporte por separado, que
es exactamente el problema que RISC busca eliminar (G1).

---

## Acceptance Criteria

### AC-001

Given un administrador nacional autenticado

When consulta la red de nodos

Then puede ver todos los nodos activos, sin importar el municipio
(FR-E8-04).

---

### AC-002

Given un administrador nacional autenticado

When consulta un nodo específico

Then puede ver la misma información que vería el líder de ese nodo
(necesidades, familias, contacto) — la restricción de E8-US-03 aplica
al rol de líder, no al rol de administrador nacional.

---

### AC-003

Given que el sistema tiene definido el rol de administrador nacional

When se audita quién tiene ese rol

Then queda registrado igual que cualquier otro rol de la red
(FR-E8-05, ver E8-US-05) — el administrador nacional no es una cuenta
implícita ni fuera de registro.

---

## Business Rules

- FR-E8-04 — Existe un rol de administrador nacional con visibilidad de
  todos los nodos.
- BR-10 — Aunque el administrador nacional tenga visibilidad total de
  la red, esa visibilidad no convierte a RISC en un reemplazo de
  Gestión del Riesgo, alcaldías, Cruz Roja ni entidades competentes, ni
  le da a RISC la facultad de prometer o tramitar subsidios (manual
  sección 10). La visibilidad total es de datos operativos de la red,
  no una autoridad institucional.
- BR-11 — Un rol por persona: el administrador nacional no puede tener
  registrado ningún otro rol (líder, suplente, operador de centro de
  acopio) en el sistema, y viceversa — sin excepciones (decisión
  Gregorio Quintero, 21 ago 2026).

---

## Edge Cases

- ~~¿Puede haber más de un administrador nacional al mismo tiempo?~~
  Resuelto (Gregorio Quintero, 21 ago 2026): **sí** — mismo principio
  que ya rige a nivel de nodo (líder + suplente, "la operación no debe
  depender de una sola persona", manual sección 04), extendido a nivel
  nacional. No hay límite de un solo admin nacional.
- ~~¿Puede un usuario que ya tiene otro rol (líder, suplente, operador
  de centro de acopio) ser asignado también como administrador
  nacional, o viceversa? Quedaba abierto por referencia cruzada en
  E8-US-05 ("igual que en E8-US-02 y E8-US-04").~~ Resuelto (Gregorio
  Quintero, 21 ago 2026): **no** — cada persona tiene exactamente un
  rol. El administrador nacional no puede tener registrado ningún
  otro rol, y un usuario con otro rol ya registrado no puede además
  ser administrador nacional. Sin excepciones (BR-11).
- Activación de un nodo nuevo (crecimiento futuro de la red más allá de
  las ciudades ya confirmadas): el administrador nacional debe verlo
  automáticamente en su visibilidad, sin configuración adicional por
  nodo — consistente con el requisito de escalabilidad del PRD (sección
  10: "el modelo debe soportar activar un nodo nuevo sin rediseño").

---

## Dependencies

**Internal Modules**
- Ninguno adicional a la epic misma.

**Other Stories**
- Depende de E8-US-01 (modelo de nodos) y E8-US-02 (nodos con líder
  asignado) para tener algo que supervisar.
- Es la contraparte explícita de E8-US-03 — el administrador nacional
  es la única excepción documentada a la restricción de aislamiento por
  nodo (AC-004 de E8-US-03).
- Se relaciona con E8-US-05 (el registro de roles incluye también al
  administrador nacional, no solo a los líderes).
- Es insumo para E9 (transparencia pública y auditoría) — la
  visibilidad nacional es lo que permite operar el módulo de auditoría
  a nivel de red completa, aunque E9 tiene su propio alcance y no se
  especifica acá.

**External APIs**
- Ninguna planeada para R1 (PRD sección 12).

**Infrastructure**
- Ninguna definida todavía — corresponde a la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel, sin stack:

- El rol de administrador nacional debe modelarse como una excepción
  explícita y auditable a la regla de aislamiento por nodo (E8-US-03),
  no como un mecanismo separado que sortee esa restricción de forma
  ad-hoc en cada consulta.
- El mecanismo concreto para implementar esa excepción corresponde a la
  fase de Architecture.

---

## Test Cases

### Unit Tests

- Un usuario con rol de administrador nacional puede resolver el
  contacto de familias y propietarios de cualquier nodo, sin filtro de
  nodo.
- Un usuario con rol de administrador nacional queda registrado como
  tal, con el mismo mecanismo de registro que un líder.

### Integration Tests

- Una consulta de necesidades sin filtro de nodo, hecha por un
  administrador nacional, retorna registros de todos los nodos
  activos.
- Un administrador nacional consulta el nodo de Ibagué y el nodo de
  Cali en la misma sesión, sin restricción entre uno y otro.

### Playwright E2E

- Login como administrador nacional, navegar a la vista de red, y
  verificar que todos los nodos activos aparecen listados, cada uno con
  su líder asignado.

---

## Technical Tasks

- [ ] **TASK-E8-US04-01** (Dominio/datos) — Modelar el rol de
      administrador nacional como una excepción explícita y auditable a
      la restricción de aislamiento por nodo (E8-US-03), registrada con
      el mismo mecanismo que cualquier otro rol (AC-003, Technical
      Notes).
- [ ] **TASK-E8-US04-02** (Lógica de negocio) — Implementar la consulta
      de red sin filtro de nodo, de forma que el administrador nacional
      vea todos los nodos activos en una misma consulta (AC-001).
- [ ] **TASK-E8-US04-03** (Lógica de negocio) — Asegurar que, al
      consultar un nodo específico, el administrador nacional obtenga la
      misma información (necesidades, familias, contacto) que vería el
      líder de ese nodo, sin quedar sujeto a la restricción de E8-US-03
      (AC-002).
- [ ] **TASK-E8-US04-04** (Interfaz) — Construir la vista de red para
      el administrador nacional, listando todos los nodos activos junto
      con su líder asignado.
- [ ] **TASK-E8-US04-05** (Tests) — Cubrir los unit tests (resolución
      de contacto de cualquier nodo sin filtro, registro del rol con el
      mismo mecanismo que un líder), los integration tests (consulta sin
      filtro retorna todos los nodos activos, consulta de dos nodos
      distintos en la misma sesión) y el flujo E2E de login como
      administrador nacional con verificación de la vista de red,
      definidos en Test Cases.
- [ ] **TASK-E8-US04-06** (Lógica de negocio) — Implementar la
      validación que rechaza asignar el rol de administrador nacional
      a un usuario que ya tenga cualquier otro rol registrado
      (consultando el registro central de E8-US-05), y que rechaza
      asignar cualquier otro rol a un usuario que ya sea administrador
      nacional — un rol por persona, sin excepciones (BR-11).

---

## Definition of Done

- [ ] Acceptance Criteria satisfechos.
- [ ] Unit Tests pasan.
- [ ] Integration Tests pasan.
- [ ] Playwright tests pasan.
- [ ] Documentación actualizada.
- [ ] Product Owner aprueba.

---

## Story Sizing

**Size:** S (medio día)

Justificación: es en gran medida la cara opuesta del aislamiento
construido en E8-US-03 — una vez que esa restricción existe como
mecanismo estructural, definir el rol que queda exento de ella es un
trabajo acotado, no una construcción desde cero.
