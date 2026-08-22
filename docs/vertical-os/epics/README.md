# Epics — convención de carpeta

Estándar: `~/Desktop/Vertical OS-Play book/Product/14-Epic Standard.md`
y `15-User Story standard.md`.

No se llena hasta que `03-PRD.md` esté aprobado — un Epic sin PRD
detrás es lo que el estándar llama "Definition of Ready" incompleta.

## Jerarquía

Para RISC, Business Capability = Epic, 1:1 (las 9 capacidades de
`~/Desktop/risc-vault/02 - Alcance y Epics.md` ya cumplen el Golden
Rule del Epic Standard por sí solas — no se agrega una capa de
Business Capability separada a menos que un epic crezca y necesite
partirse).

```
Epic (business capability)
   └── User Story
          └── Technical Tasks (checklist TASK-XXX dentro de la Story)
```

## Estructura por epic

```
epics/
  E1-gestion-necesidades/
    00-epic.md              ← template de 14-Epic Standard
    US-01-<titulo>.md       ← template de 15-User Story standard
    US-02-<titulo>.md
  E2-donaciones/
    00-epic.md
    ...
```

IDs de epic y release, ver tabla en `02-OpenSpec.md` sección 2.

## Tasks y Tests — no tienen carpeta propia

- **Technical Tasks**: viven como checklist `TASK-XXX` dentro de cada
  `US-*.md` (sección de trazabilidad del User Story Standard). Se
  promueven a GitHub Issues solo cuando esa historia entra en
  desarrollo activo — no antes.
- **Test Cases** (qué se debe probar, nivel negocio): sección
  `## Test Cases` dentro de cada `US-*.md`.
- **Tests reales** (Vitest, Playwright): no van en `docs/` — viven en
  el código del repo, una vez que la fase de Architecture (ADRs)
  defina el stack. Hoy esa carpeta todavía no existe.
