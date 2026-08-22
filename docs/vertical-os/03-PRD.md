---
owner: Gregorio Quintero
status: approved
title: "PRD — RISC"
type: prd
version: 1
date: 2026-08-20
approved_by: Gregorio Quintero (mandato confirmado de Cristian)
approved_date: 2026-08-20
tier: 3
tags:
  - risc
  - prd
---

# PRD — RISC

> Traduce el `02-OpenSpec.md` aprobado en un plan de ejecución para
> Producto, Diseño, Ingeniería, QA y desarrollo asistido por IA. El
> OpenSpec sigue siendo la fuente de verdad del **qué**; este documento
> explica **cómo lo entrega el equipo de producto**, sin todavía elegir
> stack (eso es la fase de Architecture, después de Epics y User
> Stories).

## 1. Metadata

```yaml
Product: RISC — Red Inmobiliaria Solidaria Colombia
Module: Plataforma completa (Tier 3, vertical nuevo)
Feature: N/A — documento de producto completo
Version: 1
Author: Gregorio Quintero
Status: approved
Date: 2026-08-20
Related OpenSpec: docs/vertical-os/02-OpenSpec.md (approved, 20 ago 2026)
Related Epic: E1–E9, ver sección 6
```

## 2. Resumen ejecutivo

RISC es la plataforma de coordinación humanitaria y habitacional de la
Red Inmobiliaria Solidaria Colombia, creada por Cristian tras el sismo
del 10 de agosto de 2026 y lanzada públicamente el 15 de agosto.
Reemplaza la coordinación por WhatsApp e Instagram — que no guarda
estado, no asigna responsable y no deja trazabilidad — por un sistema
donde toda necesidad, donación y conexión de vivienda queda verificada,
registrada y auditable. Se construye para familias damnificadas,
líderes de ciudad, donantes, inmobiliarios y aliados logísticos, con un
primer release enfocado en el ciclo de donaciones porque es el más
urgente y el más simple de cerrar completo.

## 3. Contexto de negocio

**Situación actual.** La coordinación vive en WhatsApp, Instagram y
hojas de cálculo dispersas. Las necesidades se comunican por mensaje de
voz y se pierden en el hilo. Nadie puede responder cuánto falta de qué
ni quién lo está gestionando. El Manual Operativo v1.0 ya define
protocolos completos —responsable, prioridad, cantidad, ubicación,
fecha límite, estado— pero ningún protocolo se puede hacer cumplir
sobre un hilo de WhatsApp.

**Dolor.** Después de una emergencia la voluntad de ayudar aparece
rápido, pero sin organización pasan tres cosas: llegan donaciones que
no corresponden a lo que hace falta, se duplican esfuerzos, y las
familias siguen esperando.

**Oportunidad de negocio.** La red ya está constituida y anunciada
públicamente, con líderes designados y ciudades activas esperando
herramienta. CaliSolidario cubre el tablero público abierto pero
declara explícitamente que no verifica — RISC existe por la razón
contraria, y eso es lo que hay que hacer cumplir con software, no solo
con protocolo.

## 4. Declaración del problema

RISC opera hoy a la escala de la memoria de una persona. La regla de
oro del manual —"cada solicitud debe tener responsable, prioridad,
cantidad o alcance, ubicación, fecha límite y estado"— es inaplicable
sobre WhatsApp. Sin herramienta que la haga cumplir, la red se satura,
pierde credibilidad y se apaga en semanas, que es el destino habitual
de este tipo de iniciativas espontáneas.

*(No se describe la solución en esta sección — eso es el resto del
documento.)*

## 5. Objetivos

### Objetivos de negocio

- Sostener la credibilidad de RISC como la red que sí verifica, en
  contraste directo con CaliSolidario.
- Convertir el protocolo del Manual v1.0 en un sistema que cualquier
  líder pueda operar sin depender de su memoria.
- Salir al aire mientras la ventana operativa de la emergencia sigue
  abierta — el valor decae con cada semana de atraso.

### Objetivos de producto

- Cerrar el ciclo necesidad → donación → entrega sin pasos manuales de
  actualización.
- Que un líder pueda verificar y publicar una necesidad con fricción
  mínima, coordinando por teléfono en plena crisis.
- Que una familia sin cuenta, sin batería y sin cabeza para formularios
  largos pueda quedar registrada igual, vía el líder.

### Objetivos técnicos

- Que el contacto de familias y propietarios sea estructuralmente
  inaccesible para cualquiera que no sea el líder de su nodo — no una
  convención de UI.
- Que toda acción relevante quede auditada (quién, qué, cuándo) sin
  trabajo adicional del usuario.
- Que la plataforma funcione bien en conexiones de datos móviles
  limitadas — no se asume wifi ni buena señal.

## 6. Alcance

### Dentro de alcance (todas las epics se documentan; el release decide el orden)

| Epic | Capacidad de negocio | Release |
|---|---|---|
| E1 | Gestión de necesidades verificadas | R1 |
| E2 | Captación y trazabilidad de donaciones | R1 |
| E3 | Operación de centros de acopio e inventario | R1 |
| E8 | Red, nodos, roles y permisos | R1 |
| E9 | Transparencia pública y auditoría | R1 (básico) |
| E5 | Banco de viviendas y reubicación de familias | R1.5 (registro) → R2 (cruce) |
| E6 | Banco de recursos logísticos | R2 |
| E4 | Distribución y entrega a albergues | R3 |
| E7 | Articulación institucional y programas de apoyo | R3 |

### Fuera de alcance (todos los releases)

- RISC no recibe, custodia ni intermedia dinero.
- No reemplaza a Gestión del Riesgo, alcaldías, Cruz Roja ni entidades
  competentes.
- No promete, tramita ni garantiza subsidios.
- No es aplicación nativa — web responsive primero.
- Sin motor de coincidencia automático con puntaje de compatibilidad.
- Sin campo de prioridad gestionado a mano.

## 7. Personas

**Persona primaria — Líder RISC de ciudad.** Ocupado, coordinando por
teléfono en medio de una crisis. Necesita la menor fricción posible
para verificar y publicar. Es el único rol que ve contacto de familias
y propietarios de su nodo.

**Personas secundarias:**

- **Donante** — quiere ayudar, no sabe qué hace falta hoy ni dónde.
- **Familia damnificada** — muchas veces sin cuenta, sin batería, sin
  cabeza para formularios largos. El registro asistido por el líder es
  el camino principal, no el autorregistro.
- **Propietario/inmobiliario** — tiene inventario disponible (vivienda,
  recursos) que no llega a quien lo necesita.
- **Operador de centro de acopio** — recibe, clasifica y confirma
  donaciones.
- **Aliado logístico** — ofrece transporte, bodega o voluntarios.
- **Administrador nacional** — visión de todos los nodos.

**Stakeholders:** Cristian (fundador, mandante del proyecto), Gregorio
Quintero (dueño técnico, con mandato confirmado para construir y
aprobar los artefactos de este pipeline).

## 8. User Journey

### Journey principal R1 — donante

```
Ve necesidades publicadas → elige ciudad y categoría → elige cantidad
→ registra sus datos → elige centro de acopio → recibe código →
entrega en el centro → centro confirma → donación registrada y
necesidad actualizada
```

(Diagrama completo en `README.md` del repo, ya versionado.)

### Journey principal R1 — líder

```
Recibe reporte de necesidad → verifica (¿es real?) → si no, descarta;
si sí, publica → necesidad visible para donantes → monitorea faltante
→ necesidad llega a 0 → queda resuelta sola
```

### Journey R1.5/R2 — vivienda (no entra en R1)

```
Familia se registra (asistida o autorregistro) → verificación →
propietario registra propiedad → líder verifica titularidad por
teléfono → [R2] líder cruza con filtros duros → presenta a las partes
→ prospera o vuelve a cruce → seguimiento → cierre
```

## 9. Requisitos funcionales

Heredados 1:1 de `02-OpenSpec.md` sección 3, con prioridad asignada por
release. Detalle completo (numeración FR-EX-XX) vive en el OpenSpec —
este PRD no lo duplica dos veces, lo referencia.

| Epic | Requisitos | Prioridad |
|---|---|---|
| E1 | FR-E1-01 a FR-E1-07 | Alta (R1) |
| E2 | FR-E2-01 a FR-E2-06 | Alta (R1) |
| E3 | FR-E3-01 a FR-E3-05 | Alta (R1) |
| E8 | FR-E8-01 a FR-E8-05 | Alta (R1) |
| E9 | FR-E9-01 a FR-E9-03 | Alta (R1, básico) |
| E5 | FR-E5-01 a FR-E5-04 | Alta (R1.5, registro) |
| E5 | FR-E5-05 a FR-E5-07 | Media (R2, cruce) |
| E6 | FR-E6-01 a FR-E6-03 | Media (R2) |
| E4 | FR-E4-01 a FR-E4-03 | Baja (R3) |
| E7 | FR-E7-01 a FR-E7-03 | Baja (R3) |

## 10. Requisitos no funcionales

- **Performance.** El portal público (ver necesidades, comprometer
  donación) debe cargar en conexión de datos móvil limitada — es el
  contexto real de uso en emergencia, no wifi de oficina.
- **Seguridad.** El contacto de familias y propietarios debe ser
  inaccesible fuera del líder de su nodo — a nivel de sistema, no de
  interfaz (BR-06 del OpenSpec). Auditoría inmutable de quién verificó
  y cuándo.
- **Accesibilidad.** Formularios cortos, lenguaje simple, sin
  dependencia de buena visión o alta destreza digital — la población
  que reporta necesidades no es técnica.
- **Disponibilidad.** Sin ventanas de downtime planeadas durante la
  fase activa de la emergencia (semanas críticas post-sismo). No se
  exige SLA formal para R1.
- **Escalabilidad.** El modelo debe soportar activar un nodo nuevo
  (ciudad) sin rediseño — la red está pensada para crecer ante futuras
  emergencias (TECH.md sección 39, fases 1–4).
- **Mantenibilidad.** Definida en la fase de Architecture — fuera de
  alcance de este PRD.

## 11. Reglas de negocio

Heredadas de `02-OpenSpec.md` sección 4 (BR-01 a BR-11). No se
duplican acá — este PRD las referencia como contrato vigente.

## 12. Dependencias

- **Módulos internos:** ninguno — vertical nuevo, sin plataforma Core
  activada todavía.
- **APIs externas:** ninguna planeada para R1.
- **Servicios de terceros:** pendiente de la fase de Architecture.
- **Infraestructura:** pendiente de la fase de Architecture (ADR-0001).
- **Revisión cruzada:** los dos candidatos a módulo Core detectados en
  Discovery (multi-tenancy geográfico con auditoría; registro de
  propiedades, posible solape con Propertia) deben revisarse contra
  `25-Core-Module-Strategy` antes de que Architecture defina el
  esquema de E8 y E5.

## 13. Consideraciones de UX

- **Wireframes:** no existen todavía — TECH.md sección 4 y 7 describe
  la intención (home de dos botones grandes, ficha de necesidad con
  barra de progreso) a nivel de inspiración, no como spec cerrada.
- **Navegación:** portal público sin cuenta (ver, filtrar, comprometer
  donación) separado del panel autenticado (líder, centro, admin).
- **Validaciones:** formulario de reporte de necesidad exige los campos
  de la regla de oro antes de enviar.
- **Estados de carga/vacío/error:** por definir en User Stories — a
  nivel PRD solo se marca que deben existir para los tres flujos R1
  (reportar, donar, recibir en centro).

## 14. Analítica y eventos

Eventos mínimos a instrumentar desde R1:

- `necesidad_reportada`
- `necesidad_verificada`
- `necesidad_publicada`
- `necesidad_descartada`
- `necesidad_resuelta`
- `donacion_comprometida`
- `donacion_recibida`
- `centro_acopio_creado`

R1.5/R2 agrega: `familia_registrada`, `propiedad_registrada`,
`match_presentado`, `caso_cerrado`.

## 15. Riesgos

**Técnicos**

- Ninguno identificado todavía — la fase de Architecture es donde
  aparecen (stack, RLS, integraciones).

**Operacionales**

- Dependencia de una sola persona por nodo. El manual (sección 04) ya
  lo advierte: sin líder + suplente + equipo de apoyo, la plataforma es
  "una base de datos vacía con un formulario bonito adelante".
- ~~Municipios de Tolima y Chocó sin confirmar — bloquea el go-live de
  R1 en esos dos departamentos, no bloquea el resto del PRD.~~
  Resuelto: Tolima → Ibagué, Chocó → Quibdó (confirmado por Cristian,
  20 ago 2026).

**De negocio**

- Exposición de datos de familias damnificadas si la restricción de
  contacto por nodo falla — mitigado por BR-06, a validar en
  Architecture.
- Estafas en el banco de viviendas (arrendador falso) — mitigado por
  cero dinero en plataforma y verificación de titularidad por el
  líder.
- Gouging en "arriendo solidario" — necesita tope de precio publicado
  antes de que E5 entre en R2. Gregorio Quintero decidió (20 ago 2026)
  diferir explícitamente esa definición a una fase posterior; no
  bloquea la planeación actual de E5/R2, pero sigue siendo un
  requisito pendiente antes de que E5 entre en producción — el riesgo
  de gouging no está mitigado mientras el tope no se defina.
- Riesgo de plazo: la ventana operativa de la emergencia se mide en
  semanas: no es un proyecto donde "tomarse el tiempo necesario" sea
  gratis.

## 16. Métricas de éxito

**KPIs de negocio**

- Necesidades resueltas / necesidades publicadas (tasa de cierre).
- Tiempo promedio entre publicación y resolución.

**KPIs de producto**

- Donaciones comprometidas vs. recibidas (tasa de conversión —
  detecta fricción en la entrega física).
- % de necesidades reportadas que se verifican en menos de 24 h.

**KPIs técnicos**

- Definidos en Architecture, junto a las NFR de performance y
  disponibilidad.

## 17. Criterios de aceptación

A nivel de producto completo (cada Epic tendrá los suyos, más
específicos, en su propio documento):

- Un líder puede verificar y publicar una necesidad desde su teléfono
  sin fricción innecesaria.
- Un donante puede comprometer una donación y saber exactamente dónde
  entregarla.
- Un centro de acopio puede confirmar una entrega y ver el inventario
  actualizado en el momento.
- Ningún usuario fuera del líder de un nodo puede ver el contacto de
  una familia o propietario de ese nodo.
- El portal público muestra, sin necesidad de cuenta, que RISC verifica
  antes de publicar.

## 18. Estrategia de release

- **Plan de despliegue:** progresivo por ciudad — Cali, Manizales,
  Armenia, Pereira primero (ciudades con líder confirmado); Ibagué
  (Tolima) y Quibdó (Chocó) — municipios confirmados por Cristian el
  20 ago 2026 — se incorporan a la misma ola progresiva sujeto a que
  cada nodo tenga su estructura mínima (líder + suplente + equipo de
  apoyo) activa. R1 (donaciones) antes que R1.5 (registro de vivienda)
  antes que R2 (cruce + logística) antes que R3 (distribución +
  articulación institucional).
- **Plan de migración:** no aplica — proyecto greenfield, sin sistema
  previo que migrar.
- **Plan de rollback:** se define en Architecture, junto al pipeline de
  CI/CD.
- **Plan de comunicación:** el canal ya existe — Instagram
  (@cristianelcorredorinmobiliario) y WhatsApp de la red, los mismos
  que anunciaron RISC el 15 de agosto.

## Checklist de revisión (estándar VerticalOS)

- [x] OpenSpec existe y está aprobado.
- [x] Problema de negocio claro.
- [x] Alcance definido, con fuera-de-alcance explícito.
- [x] Personas identificadas.
- [x] User Journey documentado.
- [x] Reglas de negocio documentadas (por referencia al OpenSpec).
- [x] Requisitos funcionales completos (por referencia al OpenSpec).
- [x] Requisitos no funcionales completos.
- [x] Criterios de aceptación medibles.
- [x] Métricas de éxito definidas.
- [x] Eventos de analítica definidos.
- [x] Riesgos documentados.
- [x] Dependencias identificadas.
- [x] **Aprobación** — Gregorio Quintero, 20 ago 2026.

## Siguiente paso

Epic Planning — `docs/vertical-os/epics/` (convención ya documentada
en `epics/README.md`). Con 9 epics documentadas acá, cada una se
convierte en su propio `00-epic.md` siguiendo `14-Epic Standard`.
