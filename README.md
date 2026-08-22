# RISC Platform

**Red Inmobiliaria Solidaria Colombia** — plataforma de coordinación de
emergencia humanitaria y habitacional para el sector inmobiliario
colombiano, tras el sismo del 10 de agosto de 2026.

RISC conecta necesidades verificadas con quienes pueden resolverlas
—donantes, centros de acopio, propietarios— sin depender de la memoria
de un líder ni de un hilo de WhatsApp. Nada llega al público sin pasar
antes por verificación humana.

## Estado del proyecto

Metodología **VerticalOS**, Tier 3. Pipeline en curso:

```
Business Discovery   ✅ docs/vertical-os/01-Business-Discovery.md
OpenSpec              ✅ docs/vertical-os/02-OpenSpec.md
PRD                    ✅ docs/vertical-os/03-PRD.md
Epic Planning          ✅ docs/vertical-os/epics/ (9 epics, E1–E9)
User Stories           ✅ R1 (E1,E2,E3,E8,E9) — 24 historias
Technical Tasks        ✅ R1 — sin stack, checklist en cada US
                          Sin puntos abiertos conocidos en R1.
Arquitectura            ⬅ siguiente paso (elegir stack, ADR-0001)
```

Contexto de negocio, decisiones cerradas y roadmap completo:
`~/Desktop/risc-vault` (Obsidian).

---

## Flujos

### Ciclo de vida de una necesidad (R1)

Cuatro estados. Sin campo de prioridad — la cola se ordena sola por
fecha límite y cuánto falta, no por un nivel de urgencia que todos
marcarían igual.

```mermaid
stateDiagram-v2
    [*] --> reportada
    reportada --> publicada: líder verifica
    reportada --> descartada: falsa / duplicada / fuera de alcance
    publicada --> publicada: donación registrada\n(faltante decrece)
    publicada --> resuelta: faltante llega a 0
    descartada --> [*]
    resuelta --> [*]
```

### Flujo del donante

```mermaid
flowchart LR
    A[Ve necesidades\npublicadas] --> B[Elige ciudad\ny categoría]
    B --> C[Elige cantidad\na donar]
    C --> D[Registra sus\ndatos]
    D --> E[Elige centro\nde acopio]
    E --> F[Recibe código\nde donación]
    F --> G[Entrega en\nel centro]
    G --> H{Centro\nconfirma}
    H -->|coincide| I[Donación registrada\ny necesidad actualizada]
    H -->|no coincide| J[Operador revisa]
```

### Recepción en el centro de acopio

```mermaid
flowchart LR
    A[Donante presenta\ncódigo] --> B[Operador busca\nla donación]
    B --> C{Coincide}
    C -->|sí| D[Recibir y contar]
    C -->|no| E[Revisar]
    D --> F[Registrar entrada\nen inventario]
    F --> G[Actualizar\nnecesidad]
    G --> H{Faltante = 0}
    H -->|sí| I[Necesidad → resuelta]
    H -->|no| J[Necesidad sigue\npublicada]
```

### Vivienda y reubicación — R1.5 → R2

No entra en R1. El registro empieza en R1.5 con cruce manual; el motor
de cruce llega en R2. Sin puntaje de compatibilidad — filtros duros
(ciudad, capacidad, mascotas, presupuesto) y el líder decide.

```mermaid
flowchart TD
    subgraph Familia
    F1[Registro asistido\npor el líder] --> F3[Verificación]
    F2[Autorregistro\npúblico] --> F3
    end
    subgraph Propiedad
    P1[Propietario\nregistra oferta] --> P2[Declaración de\ntitularidad]
    P2 --> P3[Líder verifica\npor teléfono]
    end
    F3 --> M{Líder cruza:\nfiltros duros,\nsin puntaje}
    P3 --> M
    M --> N[Líder presenta\na las partes]
    N --> O{Prospera}
    O -->|sí| S[Seguimiento →\ncerrado]
    O -->|no| M
```

---

## Arquitectura (aprobada — ADR-0001)

> Decisión cerrada del pipeline VerticalOS, no una hipótesis de
> trabajo. Razonamiento completo, alternativas descartadas y cuándo
> reconsiderar cada elección: `docs/adr/0001-stack-selection.md`.

Stack: **Next.js + Supabase, sin ORM aparte**. El riesgo central del
dominio —proteger el contacto de familias y propietarios
damnificados— se resuelve con RLS en Postgres, no con lógica de
aplicación: un endpoint mal escrito no puede exponer una fila que la
base nunca le devuelve. Sin ORM porque la mayoría se conecta con una
credencial de servicio que evita RLS por completo — ver el ADR para el
detalle.

```mermaid
flowchart TB
    subgraph L1["1. ENTRADAS"]
        E1["Formulario público\nReportar necesidad"]
        E2["Formulario público\nQuiero donar"]
        E3["Panel del Líder\nRISC (autenticado)"]
        E4["Panel del centro\nde acopio (autenticado)"]
    end

    subgraph L2["2. APLICACIÓN — Next.js"]
        A1["Frontend público\n(SSR / formularios)"]
        A2["Panel líder /\ncentro de acopio"]
        A3["API routes /\nServer Actions"]
    end

    subgraph L3["3. DATOS — Supabase"]
        D1[(necesidades)]
        D2[(donaciones)]
        D3[(centros_acopio)]
        D4[(inventario_movimientos)]
        D5[(nodos / ciudades /\nmunicipios)]
        D6[(usuarios / roles)]
        D7[(auditoria)]
    end

    subgraph L4["SERVICIOS TRANSVERSALES"]
        S1["Auth\n(líderes, admin)"]
        S2["RLS por ciudad\n(contacto protegido)"]
        S3["Auditoría\n(quién verificó, cuándo)"]
        S4["Notificaciones\n(fuera de R1, salvo\nconsulta líder/suplente —\ncanal pendiente de Architecture)"]
    end

    subgraph L5["INFRAESTRUCTURA"]
        I1["Vercel\n(despliegue Next.js)"]
        I2["Supabase Cloud\n(Postgres + Auth)"]
    end

    E1 --> A1
    E2 --> A1
    E3 --> A2
    E4 --> A2
    A1 --> A3
    A2 --> A3
    A3 <--> D1
    A3 <--> D2
    A3 <--> D3
    A3 <--> D4
    A3 <--> D5
    A3 <--> D6
    A3 <--> D7

    S1 -.-> A3
    S2 -.-> D1
    S2 -.-> D5
    S3 -.-> D7

    A2 -.-> I1
    A1 -.-> I1
    D1 -.-> I2
    D2 -.-> I2
```

### Entidades principales de datos (alcance R1)

| Tabla | Contiene |
|---|---|
| `necesidades` | La regla de oro: responsable, ubicación, cantidad, fecha límite, estado |
| `donaciones` | Compromiso del donante, código, estado de entrega |
| `centros_acopio` | Ubicación, responsable, horario por ciudad |
| `inventario_movimientos` | Entradas y salidas del centro |
| `nodos` / `ciudades` / `municipios` | Cali, Manizales, Armenia, Pereira + municipios de Tolima y Chocó (pendiente) |
| `usuarios` | Líderes RISC y admin, con rol y ciudad asignada |
| `auditoria` | Quién verificó, cuándo, qué cambió |

Vivienda (`familias`, `propiedades`) entra en R1.5/R2 — ver
`~/Desktop/risc-vault/02 - Alcance y Epics.md`.

### Decisiones de seguridad que ya están cerradas

- El contacto de una familia o propietario solo lo ve el líder de esa
  ciudad — RLS en Postgres, no lógica de aplicación.
- Nada se publica sin verificación humana.
- RISC no recibe, custodia ni intermedia dinero.
- Sin carga de documentos de titularidad — el líder verifica por
  teléfono, no se almacenan escrituras de terceros.

---

## Pipeline VerticalOS

- `docs/vertical-os/01-Business-Discovery.md`
- Contexto completo, decisiones y roadmap: `~/Desktop/risc-vault`
