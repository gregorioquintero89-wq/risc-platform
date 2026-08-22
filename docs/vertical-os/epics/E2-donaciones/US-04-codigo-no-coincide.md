---
owner: Gregorio Quintero
status: draft
title: "US-E2-04 — Código de donación no coincide"
type: user-story
version: 1
date: 2026-08-20
tier: 3
tags:
  - risc
  - user-story
  - E2
---

# US-E2-04 — Código presentado no coincide: revisión de operador, no rechazo automático

## Metadata

```yaml
Story ID: E2-US-04
Title: Código presentado no coincide con ninguna donación registrada
Business Capability: E2 — Captación y trazabilidad de donaciones
Epic: E2
PRD: docs/vertical-os/03-PRD.md
Priority: Alta (R1)
Status: draft
Owner: Gregorio Quintero
```

---

## Story Statement

> **As a** operador de centro de acopio

> **I want** que una entrega cuyo código no coincide con ninguna donación registrada quede marcada para mi revisión en vez de rechazarse sola

> **So that** una donación real no se pierda ni se rechace por un error de digitación o un código extraviado, sin que un humano la revise primero.

---

## Business Context

RISC existe frente a alternativas como CaliSolidario precisamente porque verifica en vez de dejar todo librado al sistema (OpenSpec G4). Aplicado a la recepción de donaciones: un código que no coincide no significa automáticamente una donación inválida — puede ser un error de digitación del donante o del operador. El sistema no decide solo; enruta el caso a una persona (FR-E2-05), consistente con que nada se resuelve sin verificación humana (BR-04).

---

## Acceptance Criteria

### AC-001

Given un donante presenta un código en el centro de acopio

When ese código no coincide con ninguna donación registrada

Then la entrega queda marcada para revisión de un operador (FR-E2-05).

---

### AC-002

Given una entrega quedó marcada para revisión

When eso ocurre

Then el sistema no la rechaza automáticamente.

---

### AC-003

Given un código presentado sí coincide con una donación `comprometida` registrada

When el operador lo verifica

Then sigue el flujo normal de confirmación de recepción (US-E2-03), no el de revisión.

---

## Business Rules

- Si el código presentado no coincide con una donación registrada, queda marcada para revisión de un operador — no se rechaza automáticamente (FR-E2-05).
- La decisión final sobre una entrega marcada para revisión la toma un humano (operador), no el sistema — consistente con que nada se publica ni se resuelve sin verificación humana (BR-04).

---

## Edge Cases

- El código no coincide con ninguna donación registrada (por error de digitación, código extraviado u otro motivo) → la entrega queda marcada para revisión de un operador; el sistema no la rechaza automáticamente (FR-E2-05, caso límite documentado en OpenSpec sección 6).
- Un código coincide pero corresponde a una donación comprometida con destino a otro centro de acopio distinto al que recibe → OpenSpec no define ese subcaso específicamente; queda fuera del alcance de esta story y no se resuelve acá.

---

## Dependencies

**Internal Modules**
- E3 (Operación de centros de acopio e inventario) — el rol de operador y el flujo de recepción conviven con el flujo de revisión de esta story (FR-E3-02).

**External APIs**
- Ninguna.

**Other Stories**
- US-E2-02 — la existencia de una donación registrada con código es prerequisito para poder determinar que un código "no coincide".
- US-E2-03 — es el flujo alternativo al que se compara: cuando el código sí coincide, sigue ese camino.

**Infrastructure**
- Pendiente de la fase de Architecture.

---

## UX Notes

Pendiente — el mockup de accesos por rol aún no se hizo. No inventar wireframes acá.

---

## Technical Notes

Necesita un estado o cola de "revisión" distinta de `comprometida` y `recibida`, y distinta de cualquier estado de rechazo automático (que no existe). El sistema no determina el resultado del caso — solo lo enruta a un operador humano para que decida.

---

## Test Cases

### Unit Tests

- Lógica de comparación de código presentado contra donaciones registradas.
- Verificar que "no coincide" nunca dispara un estado de rechazo automático.

### Integration Tests

- Una entrega con código no coincidente queda visible en una cola/vista de revisión para el operador.
- Ninguna donación cambia a un estado de "rechazada" automáticamente como resultado de un código no coincidente.

### Playwright E2E

- El operador intenta confirmar una entrega con un código inexistente y ve que el sistema la deja marcada para revisión en lugar de rechazarla.

---

## Technical Tasks

- [ ] **TASK-E2-US04-01** — Dominio/datos: modelar un estado o cola de "revisión" para entregas cuyo código no coincide con ninguna donación registrada, distinto de `comprometida`, `recibida` y de cualquier estado de rechazo automático (que no existe).
- [ ] **TASK-E2-US04-02** — Lógica de negocio: implementar la comparación del código presentado por el donante contra los códigos de donaciones registradas.
- [ ] **TASK-E2-US04-03** — Lógica de negocio: enrutar a la cola de revisión toda entrega cuyo código no coincida, sin generar ningún rechazo automático — la decisión final queda en manos del operador (FR-E2-05, BR-04).
- [ ] **TASK-E2-US04-04** — Interfaz: construir la vista/cola de revisión del operador donde aparecen las entregas con código no coincidente.
- [ ] **TASK-E2-US04-05** — Tests (unit): lógica de comparación de código y verificación de que "no coincide" nunca dispara un estado de rechazo automático.
- [ ] **TASK-E2-US04-06** — Tests (integration + E2E): una entrega con código no coincidente queda visible en la cola de revisión sin que ninguna donación pase a un estado de "rechazada"; el operador confirma este comportamiento desde el flujo real.

---

## Definition of Done

- [ ] Acceptance Criteria satisfied.
- [ ] Unit Tests pass.
- [ ] Integration Tests pass.
- [ ] Playwright tests pass.
- [ ] Documentation updated.
- [ ] Product Owner approves.

---

## Story Sizing

**S — Medio día.** Lógica acotada: comparación de código y marcado para revisión, sin flujo de decisión automática.
