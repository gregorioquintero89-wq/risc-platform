---
owner: Gregorio Quintero
status: draft
title: "Business Discovery — RISC"
type: discovery
version: 1
date: 2026-08-18
tier: 3
tags:
  - risc
  - discovery
---

# Business Discovery — RISC

## Tier

**Tier 3.** Es un Vertical OS completo: seis perfiles de usuario, operación
multi-ciudad, entidades y flujos de negocio nuevos, y datos personales
sensibles de población damnificada. Pipeline completo obligatorio.

## Problema

Después de una emergencia la voluntad de ayudar aparece rápido, pero sin
organización la ayuda no coincide con la necesidad: llegan donaciones que
nadie pidió, se duplican esfuerzos y las familias siguen esperando. Hoy la
coordinación de RISC vive en WhatsApp, que no es una base de datos: no
guarda estado, no asigna responsable y no deja trazabilidad.

## Quién lo sufre

- **Familias damnificadas** en albergues de Cali, Manizales, Armenia,
  Pereira y los municipios por definir de Tolima y Chocó.
- **Líderes RISC de ciudad**, que sostienen la coordinación a pulso y de
  memoria.
- **Donantes** que quieren ayudar y no saben qué hace falta hoy ni dónde.
- **Inmobiliarios y propietarios** con inventario disponible que no llega a
  quien lo necesita.

Vertical nuevo en el portafolio: gestión de emergencia humanitaria y
habitacional.

## Estado actual

WhatsApp, Instagram y hojas de cálculo dispersas. Las necesidades se
comunican por mensaje de voz y se pierden en el hilo. Nadie puede responder
cuánto falta de qué, ni quién lo está gestionando. CaliSolidario cubre el
tablero público abierto, pero declara explícitamente que no verifica los
avisos — RISC nace del supuesto contrario.

## Impacto si no se construye

RISC opera a la escala de la memoria de una persona. El Manual v1.0 define
protocolos que ningún medio actual puede hacer cumplir: la regla de oro
—responsable, prioridad, cantidad, ubicación, fecha límite y estado— es
inaplicable sobre WhatsApp. Sin herramienta, la red se satura, pierde
credibilidad y se apaga en semanas, que es el destino habitual de estas
iniciativas.

## Por qué ahora

Sismo del 10 de agosto de 2026. La red ya está constituida y anunciada
públicamente, con líderes designados y ciudades activas esperando
herramienta. La ventana operativa de una emergencia se mide en semanas: el
valor de la plataforma decae mientras más tarde llegue.

## No-objetivos de esta iteración

- RISC no recibe, custodia ni intermedia dinero.
- No reemplaza a Gestión del Riesgo, alcaldías, Cruz Roja ni entidades
  competentes.
- No promete, tramita ni garantiza subsidios.
- No es aplicación nativa.
- Sin motor de coincidencia automático con puntaje de compatibilidad.
- Sin campo de prioridad gestionado a mano.
- Vivienda, logística, articulación institucional, mapa y alertas entran al
  PRD pero no al R1.

## Candidato a Core

Revisar contra `25-Core-Module-Strategy` antes de construir:

- **Multi-tenancy geográfico con roles por nodo y bitácora de auditoría.**
  Patrón recurrente en el portafolio; candidato fuerte a módulo Core.
- **Registro y ficha de propiedades (E5).** Posible solape con Propertia.
  Verificar antes de especificar E5, no antes de R1.

## Siguiente paso

OpenSpec (`12-Open Spec integration Standard`), luego PRD
(`13-PRD Standard`, 18 secciones).
