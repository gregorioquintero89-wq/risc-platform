---
owner: Gregorio Quintero
status: approved
title: "OpenSpec — RISC"
type: specification
version: 1
date: 2026-08-20
approved_by: Gregorio Quintero (mandato confirmado de Cristian)
approved_date: 2026-08-20
tier: 3
tags:
  - risc
  - openspec
---

# OpenSpec — RISC

> Puente entre Business Discovery y el PRD. Lenguaje de negocio puro:
> qué debe hacer el sistema, no cómo se construye. Sin stack, sin
> frameworks, sin esquema de base de datos — esas decisiones esperan a
> la fase de Arquitectura.

Fuente autoritativa del dominio: `RISC_Manual_Informativo_y_Operativo_v1.pdf`
(16 secciones). Visión técnica original: `RISC TECH.md` (39 secciones).
Decisiones de negocio cerradas: `~/Desktop/risc-vault/03 - Decisiones
cerradas.md`. Ninguna decisión de este documento contradice esas dos
fuentes; donde el manual y RISC TECH difieren, gana el manual, y donde
el vault cerró algo distinto a ambos, gana el vault (es la decisión más
reciente, confirmada con Cristian).

## 1. Objetivos de negocio

- **G1 — Sacar la coordinación de la memoria de una persona.** Hoy vive
  en WhatsApp e Instagram, que no guardan estado, no asignan
  responsable y no dejan trazabilidad. El sistema reemplaza eso con un
  registro verificable.
- **G2 — Cerrar el ciclo necesidad → donación sin intervención manual.**
  Que el faltante se actualice solo cuando entra una donación, no que
  alguien tenga que ir a corregir un número.
- **G3 — Proteger el contacto de población vulnerable.** Familias
  damnificadas y propietarios no deben quedar expuestos; su contacto
  solo lo ve el líder verificado de su ciudad.
- **G4 — Sostener la razón de ser de RISC frente a la competencia.**
  CaliSolidario declara explícitamente que no verifica. RISC existe por
  la razón contraria — si el sistema no hace cumplir la verificación,
  RISC se convierte en el mismo problema que dice venir a resolver.
- **G5 — Salir rápido.** La ventana operativa de una emergencia se mide
  en semanas; el valor de la plataforma decae mientras más tarde el R1.

## 2. Alcance por epic y release

Principio acordado con Cristian (17 ago 2026): **todo entra al PRD, no
todo entra al R1.** Las 9 capacidades se especifican todas en este
documento; el orden de construcción lo decide el release, no el
recorte de alcance.

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

## 3. Requisitos funcionales

### E1 — Gestión de necesidades verificadas (R1)

- FR-E1-01: Se debe poder reportar una necesidad indicando responsable,
  cantidad o alcance, ubicación y fecha límite (regla de oro, manual
  sección 03).
- FR-E1-02: Toda necesidad reportada inicia en estado `reportada` y no
  es visible públicamente hasta que un líder la verifique.
- FR-E1-03: El líder de la ciudad correspondiente verifica la necesidad
  y la mueve a `publicada`, o la descarta (falsa, duplicada, fuera de
  alcance).
- FR-E1-04: El faltante se calcula como máx(0, necesario − recibido), y
  se recalcula automáticamente con cada donación registrada. Nunca es
  negativo — donaciones concurrentes que en conjunto exceden el
  faltante se reciben igual; el excedente queda como inventario del
  centro de acopio (ver sección 6, casos límite).
- FR-E1-05: Una necesidad pasa a `resuelta` automáticamente cuando el
  faltante llega a 0 — sin acción manual del líder.
- FR-E1-06: No existe campo de prioridad editable; el orden de atención
  se deriva de fecha límite y faltante.
- FR-E1-07: Queda registrado quién verificó la necesidad y cuándo
  (manual sección 11).

### E2 — Captación y trazabilidad de donaciones (R1)

- FR-E2-01: Un donante ve las necesidades publicadas y filtra por
  ciudad y categoría.
- FR-E2-02: Un donante compromete una donación indicando cantidad, sus
  datos de contacto y el centro de acopio de entrega.
- FR-E2-03: Al comprometer una donación se genera un código único.
- FR-E2-04: El estado de una donación pasa de `comprometida` a
  `recibida` solo cuando el centro de acopio confirma la entrega.
- FR-E2-05: Si el código presentado no coincide con una donación
  registrada, queda marcada para revisión de un operador — no se
  rechaza automáticamente.
- FR-E2-06: El donante puede consultar el estado de su donación.

### E3 — Operación de centros de acopio e inventario (R1)

- FR-E3-01: Cada centro de acopio tiene ciudad, ubicación, responsable
  y horario. El responsable asignado debe tener ya un rol registrado
  en el nodo de ese centro — líder, suplente u operador de centro de
  acopio (FR-E8-05, FR-E8-07) — no se puede asignar a alguien sin rol
  previo; es un bloqueo duro, no una validación opcional (decisión
  Gregorio Quintero, 21 ago 2026).
- FR-E3-02: El operador registra la recepción de una donación (quién
  entrega, qué entrega, cantidad).
- FR-E3-03: Se mantiene inventario por producto y por centro, con
  entradas y salidas. Una salida no puede registrarse por una cantidad
  mayor a la disponible — el sistema la bloquea (decisión Gregorio
  Quintero, 20 ago 2026).
- FR-E3-04: Registrar una entrada de inventario actualiza
  automáticamente el faltante de la necesidad asociada. Si la
  necesidad asociada ya fue `descartada` antes de confirmarse la
  recepción, la entrada se recibe igual y pasa a inventario general del
  centro — mismo tratamiento que el excedente por donaciones
  concurrentes (decisión Gregorio Quintero, 20 ago 2026).
- FR-E3-05: El centro de acopio no opera como depósito sin control —
  solicitar o movilizar grandes cantidades sin una necesidad
  identificada requiere consultar antes al líder o al suplente del
  nodo (FR-E8-06) (manual sección 06). Umbral de "gran cantidad"
  (decisión Gregorio Quintero, 20 ago 2026, punto de partida
  ajustable): más de 50 unidades de un mismo producto, o 50 litros/kg
  para productos a granel (agua, alimento).
- FR-E3-06: El operador de un centro de acopio puede registrar una
  donación presencial sin código previo (walk-in) — un donante que
  llega a entregar directamente, sin haber pasado antes por el
  compromiso online de E2. El registro usa el mismo modelo de datos
  que ya existe para una Donación (cantidad, centro de acopio), pero
  nace directamente en estado `recibida`, sin pasar por `comprometida`
  — no hay una promesa previa que rastrear, comprometer y recibir son
  el mismo instante para este caso. Los datos de contacto del donante
  son opcionales en este flujo, a diferencia de FR-E2-02 (donde son
  obligatorios): el contacto del flujo online sirve para rastrear una
  promesa a distancia, y acá el operador ya está viendo la entrega en
  persona. El efecto en inventario y en el faltante de la necesidad
  asociada (si aplica) ocurre en el mismo momento del registro,
  consistente con la regla de que el inventario solo se afecta al
  recibir, nunca al comprometer (FR-E2-04, FR-E3-04) — decisión
  Gregorio Quintero, 21 ago 2026.

### E8 — Red, nodos, roles y permisos (R1)

- FR-E8-01: El modelo geográfico es departamento → municipio; todo nodo
  RISC cuelga de un municipio concreto, nunca de un departamento
  directamente.
- FR-E8-02: Existe un rol de líder de ciudad/nodo, asignado a un
  municipio específico.
- FR-E8-03: Un líder solo ve y gestiona la información (necesidades,
  familias, contacto) de su propio municipio/nodo.
- FR-E8-04: Existe un rol de administrador nacional con visibilidad de
  todos los nodos. Puede haber más de un administrador nacional
  simultáneamente — mismo principio de no depender de una sola persona
  que rige líder/suplente a nivel de nodo (manual sección 04; decisión
  Gregorio Quintero, 21 ago 2026).
- FR-E8-05: Queda registrado qué usuario tiene qué rol en qué nodo.
  Cada usuario tiene como máximo un rol activo a la vez en todo el
  sistema — un rol por persona, sin excepciones (BR-11, decisión
  Gregorio Quintero, 21 ago 2026).
- FR-E8-06: Existe un rol de suplente de ciudad/nodo, con los mismos
  permisos que el líder sobre su propio nodo — puede verificar
  necesidades, responder consultas de movilización de grandes
  cantidades (FR-E3-05) y, en general, actuar en ausencia del líder.
  No es un rol de menor jerarquía: es un segundo líder del mismo nodo,
  para que la operación no dependa de una sola persona (manual sección
  04; decisión Gregorio Quintero, 21 ago 2026).
- FR-E8-07: Existe un rol de operador de centro de acopio, registrado
  a nivel de nodo con el mismo mecanismo que líder y suplente
  (FR-E8-05) — no a nivel de un centro específico, porque el centro
  puede no existir todavía en el momento de registrar el rol. A
  diferencia del líder y el suplente (FR-E8-03), el operador no tiene
  visibilidad de todo el nodo; su alcance práctico es el centro o los
  centros de los que sea responsable (decisión Gregorio Quintero, 21
  ago 2026).

### E9 — Transparencia pública y auditoría (R1, básico)

- FR-E9-01: El portal público muestra un contador de necesidades
  resueltas.
- FR-E9-02: Toda acción relevante (verificar, publicar, comprometer
  donación, recibir, cerrar) queda registrada con quién y cuándo
  (manual sección 29).
- FR-E9-03: El portal público muestra de forma visible que RISC
  verifica antes de publicar — a diferencia explícita de CaliSolidario.

### E5 — Banco de viviendas y reubicación de familias (R1.5 → R2)

- FR-E5-01 (R1.5): Un propietario registra una propiedad disponible:
  ciudad, zona, tipo, habitaciones, capacidad, canon, mascotas,
  amoblada/no amoblada, disponibilidad.
- FR-E5-02 (R1.5): El líder verifica la titularidad de la propiedad por
  teléfono — sin carga de documentos de terceros.
- FR-E5-03 (R1.5): Una familia se registra por dos caminos: asistido
  por el líder (principal, nace verificada) o autorregistro público
  (secundario, entra como `reportada` y pasa por la misma
  verificación).
- FR-E5-04 (R1.5): Queda registrado quién cargó cada registro de
  familia (manual sección 11).
- FR-E5-05 (R2): Se puede cruzar familias con propiedades mediante
  filtros duros (ciudad, capacidad, mascotas, presupuesto) — sin
  puntaje de compatibilidad.
- FR-E5-06 (R2): El líder decide y presenta las coincidencias a las
  partes; el sistema no asigna automáticamente.
- FR-E5-07 (R2): Se hace seguimiento del proceso hasta cierre (prospera
  / no prospera → vuelve a cruce).

### E6 — Banco de recursos logísticos (R2)

- FR-E6-01: Un aliado ofrece recursos: transporte, bodega, voluntarios,
  otros.
- FR-E6-02: Los recursos se agrupan por ciudad en un banco de recursos.
- FR-E6-03: Un líder solicita transporte y el sistema notifica a los
  aliados disponibles.

### E4 — Distribución y entrega a albergues (R3)

- FR-E4-01: Se asigna inventario disponible a un albergue.
- FR-E4-02: El albergue confirma la recepción de la entrega.
- FR-E4-03: La confirmación actualiza la necesidad correspondiente.

### E7 — Articulación institucional y programas de apoyo (R3)

- FR-E7-01: Se mantiene un listado de programas institucionales
  verificados: entidad, requisitos, documentos, canal oficial.
- FR-E7-02: Se registra el estado de un caso remitido a una entidad
  (orientado / remitido / en trámite / cerrado).
- FR-E7-03: Se muestra siempre la advertencia: la aprobación depende
  exclusivamente de la entidad responsable, no de RISC.

## 4. Reglas de negocio

- BR-01: La regla de oro — toda necesidad debe tener responsable,
  cantidad o alcance, ubicación, fecha límite y estado (manual sección
  03).
- BR-02: Cuatro estados de necesidad, no más: `reportada` →
  `publicada` → `resuelta`, o `reportada` → `descartada`.
- BR-03: No existe campo de prioridad manual; el orden se deriva de
  fecha límite y faltante.
- BR-04: Nada se publica sin verificación humana de ambas partes
  (manual secciones 07–08, 11–12).
- BR-05: RISC no recibe, custodia ni intermedia dinero en ningún
  release planeado.
- BR-06: El contacto de una familia o propietario debe ser visible
  únicamente para el líder verificado de su ciudad/nodo — es una
  restricción de sistema, no una convención de interfaz.
- BR-07: No existe motor de coincidencia con puntaje de compatibilidad
  (%) — solo filtros duros más decisión humana del líder.
- BR-08: El registro asistido por el líder es el camino principal para
  familias; el autorregistro es secundario y pasa por la misma
  verificación.
- BR-09: La verificación de titularidad de propiedad se hace por
  teléfono; no se cargan documentos de terceros.
- BR-10: RISC no reemplaza a Gestión del Riesgo, alcaldías, Cruz Roja
  ni entidades competentes, y no promete ni tramita subsidios (manual
  sección 10).
- BR-11: Un rol por persona. Cada usuario tiene exactamente un rol
  registrado en el sistema y, cuando el rol lo requiere, en un solo
  nodo — sin multi-rol, sin excepciones. Un líder no puede ser también
  administrador nacional, no puede ser líder de dos nodos, ni además
  suplente u operador en otro nodo. Única excepción: el administrador
  nacional, por definición, no está atado a un nodo (FR-E8-04), pero
  sigue sin poder acumular ningún otro rol (FR-E8-02, FR-E8-04,
  FR-E8-05, FR-E8-06, FR-E8-07; decisión Gregorio Quintero, 21 ago
  2026).

## 5. Criterios de aceptación

- **AC-1 — Verificación y publicación.** Dado que un líder revisa una
  necesidad `reportada`, cuando confirma que es real y completa la
  regla de oro, entonces la necesidad pasa a `publicada` y se vuelve
  visible en el portal público.
- **AC-2 — Donación cierra el ciclo.** Dado que una necesidad publicada
  tiene faltante mayor a 0, cuando un centro de acopio registra la
  recepción de una donación comprometida, entonces el faltante se
  recalcula y, si llega a 0, la necesidad pasa a `resuelta` sin
  intervención manual.
- **AC-3 — Aislamiento de contacto por nodo.** Dado que un líder
  pertenece al nodo de Cali, cuando consulta necesidades o familias,
  entonces no puede ver el contacto de familias o propietarios de otro
  municipio.
- **AC-4 — Registro asistido de familia.** Dado que un líder registra
  una familia en campo, cuando completa el registro, entonces la
  familia queda verificada, con constancia de quién la cargó.
- **AC-5 — Autorregistro de familia.** Dado que una familia se
  autorregistra por el formulario público, cuando lo envía, entonces el
  registro entra como `reportada` y requiere verificación antes de
  estar disponible para cruce.
- **AC-6 — Cruce sin puntaje.** Dado que existen propiedades y familias
  verificadas, cuando el líder aplica los filtros duros, entonces el
  sistema muestra únicamente las propiedades que cumplen todos los
  filtros, sin ordenarlas por un puntaje de compatibilidad.

## 6. Casos límite

- Una donación entregada no coincide con el código registrado → pasa a
  revisión de un operador, no se rechaza sola.
- ~~Donaciones que exceden el faltante de una necesidad — no está
  cerrado qué pasa con el excedente.~~ Resuelto (Gregorio Quintero, 20
  ago 2026): el faltante **no se reserva** en el momento en que una
  donación se compromete (FR-E2-02) — solo se resta cuando el centro de
  acopio confirma la recepción (FR-E3-04). El sistema no limita cuántas
  donaciones se pueden comprometer en simultáneo para una misma
  necesidad; si donaciones concurrentes terminan excediendo el
  faltante, se reciben igual y el excedente queda como inventario
  disponible del centro de acopio — no se rechaza ni se redirige. El
  faltante nunca es negativo: se calcula como máx(0, necesario −
  recibido).
- Reportes falsos o duplicados → `descartada`, con motivo registrado.
- Se intenta registrar una salida de inventario mayor a la cantidad
  disponible en el centro. Resuelto (Gregorio Quintero, 20 ago 2026):
  **se bloquea** — el sistema no permite registrar la salida hasta que
  la cantidad cuadre con lo disponible (FR-E3-03).
- Una donación comprometida llega al centro para una necesidad que
  mientras tanto quedó `descartada`. Resuelto (Gregorio Quintero, 20
  ago 2026): la entrada se recibe igual y **pasa a inventario general
  del centro**, disponible para la próxima necesidad del mismo
  producto — mismo criterio que el excedente por donaciones
  concurrentes, no se rechaza ni se pierde (FR-E3-04).
- ~~Un municipio de Tolima o Chocó aún sin definir — bloquea que R1
  salga al aire ahí, no bloquea el resto del PRD.~~ Resuelto: Tolima →
  Ibagué, Chocó → Quibdó (confirmado por Cristian, 20 ago 2026).
- Propiedad ofrecida sin prueba clara de titularidad → el líder no
  publica hasta verificar por teléfono; no hay carga de documentos como
  alternativa.
- ~~Ausencia del líder de un nodo — la estructura mínima exige
  suplente, pero el suplente no estaba formalizado como rol del
  sistema con permisos propios.~~ Resuelto (Gregorio Quintero, 21 ago
  2026): el suplente es un rol formal de E8, con los mismos permisos
  que el líder sobre su propio nodo — puede verificar necesidades,
  responder consultas de movilización de grandes cantidades (FR-E3-05)
  y actuar en general en ausencia del líder. No es un rol de menor
  jerarquía: es un segundo líder del mismo nodo, para que la operación
  no dependa de una sola persona (manual sección 04; FR-E8-06).
- Un operador moviliza una gran cantidad sin necesidad identificada
  (FR-E3-05) sin que la consulta previa al líder o al suplente del
  nodo quede registrada. Resuelto (Gregorio Quintero, 21 ago 2026):
  **bloqueo duro** — el sistema no permite confirmar el movimiento
  hasta que la respuesta del líder o del suplente (FR-E8-06) quede
  registrada. No es una alerta posterior al movimiento; es un bloqueo
  previo a la confirmación (FR-E3-05).
- El responsable asignado a un centro de acopio no tiene ningún rol
  registrado en el nodo de ese centro (FR-E3-01). Resuelto (Gregorio
  Quintero, 21 ago 2026): **bloqueo duro** — no se puede registrar un
  centro de acopio con un responsable que no tenga ya un rol
  registrado en el nodo (líder, suplente u operador — FR-E8-05,
  FR-E8-07). El rol de operador se registra a nivel de nodo, igual que
  líder y suplente, precisamente para que pueda existir antes de que
  el centro se cree — evita el problema de huevo-y-gallina de exigir
  un rol ligado a un centro que todavía no existe.
- ¿Un mismo usuario puede tener más de un rol registrado a la vez —
  por ejemplo, líder de un nodo y también administrador nacional, o
  líder de dos nodos? Quedó abierto en E8-US-02, E8-US-04 y E8-US-05.
  Resuelto (Gregorio Quintero, 21 ago 2026): **no** — cada persona
  tiene exactamente un rol y, cuando el rol lo requiere, en un solo
  nodo. Un líder no puede ser también administrador nacional, no
  puede ser líder de dos nodos, ni además suplente u operador en otro
  lado. Única excepción: el administrador nacional no está atado a un
  nodo, por definición (FR-E8-04) (BR-11).
- Un donante llega a un centro de acopio a entregar directamente, sin
  haber pasado antes por el compromiso online de E2 (sin código).
  Quedó abierto en E3-US-02. Resuelto (Gregorio Quintero, 21 ago
  2026): el operador registra la donación él mismo, en el momento, con
  el mismo modelo de datos de una Donación (cantidad, centro de
  acopio) — pero el registro nace directamente en estado `recibida`,
  sin pasar por `comprometida`, porque comprometer y recibir son el
  mismo instante para este caso. Los datos de contacto del donante son
  opcionales en este flujo, a diferencia del flujo online (FR-E2-02).
  El efecto en inventario y en el faltante de la necesidad asociada
  (si aplica) ocurre en el mismo momento del registro, consistente con
  que el inventario solo se afecta al recibir, nunca al comprometer
  (FR-E2-04, FR-E3-04). Cubierto por FR-E3-06 y por la story nueva
  E3-US-06 — E3-US-02 sigue cubriendo únicamente el flujo con código.

## 7. Restricciones

- RISC no recibe, custodia ni intermedia dinero en ningún release
  planeado.
- Sin aplicación nativa — web responsive primero.
- Sin motor de coincidencia automático con puntaje de compatibilidad.
- Sin campo de prioridad gestionado a mano.
- Sin carga de documentos de titularidad de propiedad.

## 8. Supuestos

- Cristian confirmó el municipio de Tolima (Ibagué) y de Chocó
  (Quibdó) el 20 de agosto de 2026 — ya no es supuesto, es decisión
  cerrada (ver `03 - Decisiones cerradas` del vault).
- Cada ciudad activa cuenta con estructura mínima (líder + suplente +
  equipo de apoyo) antes de activar su nodo.
- E5 (registro de propiedades) puede solaparse con Propertia — se
  verifica antes de especificar E5 a nivel de PRD; no bloquea R1
  porque E5 no entra en R1.

## 9. Dependencias

- `RISC_Manual_Informativo_y_Operativo_v1.pdf` — fuente autoritativa
  del dominio, citada en cada sección de este documento.
- Aprobación de Cristian como stakeholder (paso 3–4 del flujo
  OpenSpec) — pendiente, ver checklist abajo.
- Revisión contra `25-Core-Module-Strategy` del playbook VerticalOS
  para los dos candidatos a módulo Core detectados en Discovery
  (multi-tenancy geográfico con auditoría; registro de propiedades) —
  corresponde a la fase de Arquitectura, no bloquea este documento.
- Nota jurídica aparte para cualquier futuro "fondo de ayuda" con
  manejo de dinero — explícitamente fuera de alcance de todos los
  releases actuales.
- Notificación al líder/suplente ante una consulta pendiente de
  respuesta (FR-E3-05, FR-E8-06) — excepción puntual y acotada a
  "Notificaciones fuera de R1" (ver README, sección Arquitectura): el
  resto de notificaciones sigue fuera de R1. El canal (push, email,
  SMS, WhatsApp) no se define acá — queda pendiente de la fase de
  Architecture (decisión Gregorio Quintero, 21 ago 2026).

## 10. Fuera de alcance (heredado de Business Discovery)

- RISC no recibe, custodia ni intermedia dinero.
- No reemplaza a Gestión del Riesgo, alcaldías, Cruz Roja ni entidades
  competentes.
- No promete, tramita ni garantiza subsidios.
- No es aplicación nativa.
- Sin motor de coincidencia automático con puntaje de compatibilidad.
- Sin campo de prioridad gestionado a mano.

## 11. Checklist de revisión (estándar VerticalOS)

- [x] Problema de negocio entendido.
- [x] Objetivos documentados.
- [x] Alcance definido (9 epics, con release asignado a cada una).
- [x] Reglas de negocio identificadas.
- [x] Criterios de aceptación medibles.
- [x] Casos límite documentados (todos resueltos — sección 6; los más
      recientes, un rol por persona (BR-11) y donación presencial sin
      código previo (FR-E3-06, E3-US-06), cerrados 21 ago 2026).
- [x] Dependencias listadas.
- [x] **Aprobación** — Gregorio Quintero, 20 ago 2026, bajo mandato
      confirmado de Cristian. Documento pasa a `approved`.

## Siguiente paso

PRD (`13-PRD Standard`, 18 secciones) — `docs/vertical-os/03-PRD.md`.
