---
owner: Gregorio Quintero
status: draft
title: "US-E3-06 — Registrar una donación presencial sin código previo"
type: user-story
version: 1
date: 2026-08-21
tier: 3
tags:
  - risc
  - user-story
  - E3
---

# US-E3-06 — Registrar una donación presencial sin código previo

## Metadata

```yaml
Story ID: E3-US-06
Title: Registrar una donación presencial sin código previo
Business Capability: E3 — Operación de centros de acopio e inventario
Epic: E3
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As an** operador de centro de acopio

> **I want** registrar directamente una donación que un donante entrega
> en persona, sin que haya pasado antes por el compromiso online de E2
> (sin código)

> **So that** esa donación también quede registrada, sume al inventario
> y, si corresponde, al faltante de una necesidad — sin obligar al
> donante a pasar por un flujo online que nunca vivió.

---

## Business Context

El flujo de E2 (compromiso online, E2-US-02) y el de E3-US-02
(confirmación de una donación previamente comprometida) asumen que
siempre existe una promesa previa con código. En la práctica, un
donante puede llegar directamente al centro de acopio a entregar sin
haber pasado por ese paso online. Antes de esta decisión, E3-US-02
dejaba ese caso explícitamente fuera de alcance. Gregorio Quintero
decidió (21 ago 2026, opción A de dos opciones presentadas): el
operador registra él mismo la donación, en el momento, con el mismo
modelo de datos que ya existe para una Donación — pero el registro
nace directamente en estado `recibida`, porque comprometer y recibir
son el mismo instante cuando no hay una promesa a distancia que
rastrear.

---

## Acceptance Criteria

### AC-001

Given un donante que llega directamente a un centro de acopio a
entregar, sin código de una donación comprometida en E2

When el operador registra la donación indicando cantidad y centro de
acopio

Then el sistema crea el registro directamente en estado `recibida`,
sin pasar por `comprometida` (FR-E3-06).

---

### AC-002

Given el operador está registrando una donación presencial sin código
previo

When completa el formulario de registro

Then los datos de contacto del donante son opcionales — a diferencia
del flujo online, donde son obligatorios (FR-E2-02, FR-E3-06).

---

### AC-003

Given una donación presencial sin código se registra exitosamente

When se guarda el registro

Then la entrada de inventario del centro se genera en el mismo
momento, y si la donación está asociada a una necesidad con faltante,
el faltante se recalcula también en ese mismo momento — consistente
con la regla de que el inventario solo se afecta al recibir, nunca al
comprometer (FR-E2-04, FR-E3-04).

---

### AC-004

Given un registro de donación presencial sin código ya guardado

When se consulta junto con donaciones recibidas por el flujo con
código (E3-US-02)

Then usa el mismo modelo de datos de Donación (cantidad, centro de
acopio) — no es una entidad distinta ni un registro paralelo; solo
carece de la transición `comprometida` → `recibida` y puede tener el
contacto vacío.

---

## Business Rules

- FR-E3-06 — El operador de un centro de acopio puede registrar una
  donación presencial sin código previo; nace en estado `recibida`
  directamente; los datos de contacto del donante son opcionales
  (decisión Gregorio Quintero, 21 ago 2026).
- FR-E2-02 — Contraste: en el flujo online, los datos de contacto del
  donante son obligatorios, porque sirven para rastrear una promesa a
  distancia. Esa obligatoriedad no aplica a esta historia.
- FR-E2-04, FR-E3-04 — El inventario solo se afecta al recibir, nunca
  al comprometer. Para esta historia, registrar y recibir son la misma
  acción, así que el efecto en inventario (y en el faltante, si
  aplica) ocurre en el mismo momento del registro.
- BR-05 — RISC no recibe, custodia ni intermedia dinero; lo que se
  registra acá es siempre entrega física de bienes, nunca de dinero.

---

## Edge Cases

- El operador no ingresa ningún dato de contacto del donante — está
  permitido, no es un error de validación (a diferencia del flujo
  online, FR-E2-02).
- Una donación presencial sin código está asociada a una necesidad
  cuyo faltante termina siendo menor a la cantidad entregada — mismo
  tratamiento que el caso ya resuelto de donaciones concurrentes que
  exceden el faltante (OpenSpec sección 6): el excedente queda como
  inventario disponible del centro, no se rechaza ni se redirige.
- Esta donación nunca pasa por `comprometida`, así que no existe (ni
  se genera) un código único para ella — a diferencia de FR-E2-03, que
  aplica solo al flujo online.
- Queda constancia de qué operador registró la donación y cuándo,
  igual que cualquier otra acción relevante del sistema (FR-E9-02).

---

## Dependencies

**Internal Modules**
- E2 (Captación y trazabilidad de donaciones) — reutiliza el mismo
  modelo de datos de Donación definido en E2-US-02 (cantidad, centro
  de acopio), pero no depende del flujo de compromiso online en sí:
  esta historia lo evita por diseño.

**Other Stories**
- Depende de E3-US-01 — el centro de acopio debe existir antes de
  poder registrar una recepción presencial en él.
- Relacionada con E2-US-02 — mismo modelo de datos de Donación; el
  contacto pasa de obligatorio a opcional en este flujo.
- Relacionada con E3-US-02 — esa historia cubre la recepción de una
  donación previamente comprometida con código; esta historia cubre el
  caso sin código previo. Son flujos de entrada separados sobre el
  mismo modelo de datos, no se duplican entre sí.

**External APIs**
- Ninguna prevista para R1.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar
wireframes acá.

---

## Technical Notes

Solo consideraciones de alto nivel, sin stack:

- El registro reutiliza el mismo modelo de datos de Donación (cantidad,
  centro de acopio) que ya existe para el flujo online (E2-US-02) — no
  es una entidad nueva ni un modelo paralelo.
- A diferencia del flujo online, el registro nace directamente en
  estado `recibida`: no hay transición desde `comprometida`, porque no
  hay una promesa previa que rastrear — comprometer y recibir son el
  mismo instante para este caso (decisión Gregorio Quintero, 21 ago
  2026).
- Los campos de contacto del donante deben poder guardarse vacíos en
  este flujo, sin que se aplique la validación de campos obligatorios
  que sí exige FR-E2-02 en el flujo online.
- El efecto en inventario y en el faltante de la necesidad asociada (si
  aplica) se dispara en el mismo momento del registro, reutilizando el
  mismo mecanismo que ya usa FR-E3-04 al confirmar una recepción — no
  un mecanismo nuevo.
- El esquema concreto de almacenamiento corresponde a la fase de
  Architecture.

---

## Test Cases

### Unit Tests

- Registrar una donación presencial sin código crea el registro
  directamente en estado `recibida`, sin pasar por `comprometida`.
- Registrar una donación presencial sin datos de contacto no produce
  error de validación (contacto opcional).
- Registrar una donación presencial con datos de contacto los persiste
  igual — opcional no significa prohibido.

### Integration Tests

- Registrar una donación presencial genera la entrada de inventario
  correspondiente en el mismo momento del registro.
- Si la donación presencial está asociada a una necesidad con
  faltante, el faltante se recalcula en el mismo momento del registro
  (mismo mecanismo de FR-E3-04).
- Una donación presencial que excede el faltante de la necesidad
  asociada se recibe igual, y el excedente queda como inventario
  disponible del centro (mismo criterio ya resuelto en OpenSpec
  sección 6).

### Playwright E2E

- Flujo completo: el operador registra una donación presencial
  indicando cantidad y centro de acopio, sin completar datos de
  contacto, y confirma que queda registrada directamente como
  `recibida`, con el inventario actualizado de inmediato.

---

## Technical Tasks

- [ ] **TASK-E3-US06-01** (Dominio/datos) — Modelar el registro de una
      donación presencial reutilizando el mismo modelo de datos de
      Donación (cantidad, centro de acopio) ya existente para el flujo
      online (E2-US-02), con estado inicial `recibida` y campos de
      contacto opcionales (FR-E3-06, a diferencia de FR-E2-02).
- [ ] **TASK-E3-US06-02** (Lógica de negocio) — Implementar el registro
      directo en estado `recibida`, sin transición desde `comprometida`
      — comprometer y recibir son el mismo instante para este flujo
      (FR-E3-06, AC-001).
- [ ] **TASK-E3-US06-03** (Lógica de negocio) — Garantizar que los
      campos de contacto del donante puedan guardarse vacíos sin
      disparar la validación de campos obligatorios que sí aplica en el
      flujo online (FR-E2-02, AC-002).
- [ ] **TASK-E3-US06-04** (Lógica de negocio) — Disparar la
      actualización del inventario del centro y, si aplica, el
      recálculo del faltante de la necesidad asociada, en el mismo
      momento del registro, reutilizando el mecanismo ya definido por
      FR-E3-04 (AC-003).
- [ ] **TASK-E3-US06-05** (Interfaz) — Construir la pantalla de
      operador para registrar una donación presencial sin código:
      cantidad, centro de acopio y datos de contacto opcionales
      (mockup de accesos por rol pendiente; no se inventa acá).
- [ ] **TASK-E3-US06-06** (Tests) — Cubrir los unit tests (registro
      directo en `recibida`, contacto opcional sin error de
      validación) y los integration tests (generación de entrada de
      inventario y recálculo de faltante en el mismo momento, excedente
      tratado igual que el caso ya resuelto en OpenSpec) definidos en
      Test Cases.

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

Justificación: reutiliza el modelo de datos de Donación (E2-US-02) y
el mecanismo de actualización de inventario/faltante ya construido en
FR-E3-04 — el trabajo real es el punto de entrada directo a `recibida`
y la validación de contacto opcional, no un modelo de datos nuevo.
