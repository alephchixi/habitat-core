# CONJURO V2 FINAL — HABITAT.md

> Versión consolidada y lista para ejecución del plan editorial-técnico de HABITAT.md.

> Prompt de ejecución completa para construir **HABITAT.md**: un portal editorial, crítico y experimental dedicado a explorar el hábitat cibernético contemporáneo desde perspectivas éticas, ecológicas, espirituales, cosmotécnicas y decoloniales.

---

## 0. CONTEXTO PARA EL AGENTE EJECUTOR

Eres un agente de desarrollo full-stack con sensibilidad editorial y estética. Vas a construir **HABITAT.md**, un proyecto web que es simultáneamente revista, observatorio, laboratorio, archivo, plataforma de recursos y espacio comunitario.

### Pregunta rectora del proyecto
**¿Cómo pensar, diseñar, habitar y subvertir el hábitat cibernético contemporáneo desde marcos éticos, ecológicos, espirituales, cosmotécnicos y decoloniales?**

### Lo que NO es HABITAT.md
- No es un blog tech genérico
- No es corporate AI ethics
- No es periodismo tech
- No es espiritualidad new age vacía
- No es activismo abstracto sin infraestructura
- No es un CMS genérico montado en WordPress

### Lo que SÍ es
- Una revista-laboratorio-observatorio del nuevo hábitat cibernético
- Riguroso, experimental, crítico, sensible, conceptualmente fuerte, técnicamente informado, estéticamente cuidado
- Un experimento editorial real donde conviven autores humanos y agentes

---

## 1. IDENTIDAD Y MARCA

### 1.1 Nombre
**HABITAT.md** — el `.md` no es decorativo: señala que el proyecto nace desde el markdown, desde el código, desde la escritura en texto plano como acto político y estético.

### 1.2 Tagline
> una revista-laboratorio-observatorio del nuevo hábitat cibernético

### 1.3 Fórmula completa
> Un portal editorial, crítico y experimental dedicado a explorar el hábitat cibernético contemporáneo desde perspectivas éticas, ecológicas, espirituales, cosmotécnicas y decoloniales, articulando teoría, herramientas, archivo, agentes, comunidad y experimentación.

### 1.4 Identidad visual — Directrices estrictas

La estética de HABITAT.md debe ser **anti-genérica**. Nada de fondos blancos con gradientes violetas. Nada de Inter. Nada de layouts predecibles de blog. Nada de SaaS-core.

**Dirección estética**: Tipografía-como-arquitectura. Monocromo austero. Densidad informacional alta. El diseño se construye con **bordes, celdas, grids visibles y jerarquía tipográfica** — no con decoración, color ni ilustración. La interfaz es un instrumento de navegación editorial, no un escaparate.

**Filosofía de diseño inspirada en CAN (CreativeApplications.Net), NO copiada**:
- La información es el ornamento. No se decora: se estructura.
- Cada sección tiene bordes explícitos (`border: 1px solid`) — la retícula es visible, no implícita.
- El contenido se presenta en densidad variable: grid, lista, feed cronológico, metadata expandida.
- Los datos cuantitativos (conteos, fechas, timestamps) son ciudadanos de primera clase, no metadata oculta.
- La comunidad (autores, colaboradores, agentes) es tan visible como el contenido.
- Múltiples modos de vista (Grid / List / Metadata) donde sea aplicable.
- El sidebar es un espacio funcional: filtros, settings, contexto — no decoración.

**Paleta cromática — Monocromo-first con acentos mínimos**:
- **Fondo principal (modo claro)**: Blanco puro (`#FFFFFF`) o blanco cálido (`#FAFAFA`)
- **Fondo principal (modo oscuro)**: Negro profundo (`#0A0A0A`) o carbón (`#111111`)
- **Superficies/celdas**: Gris claro (`#F0F0F0`) en light / gris húmedo (`#1A1A1A`) en dark
- **Bordes visibles**: Gris medio (`#D0D0D0`) en light / gris oscuro (`#333333`) en dark
- **Texto principal**: Negro (`#111111`) en light / blanco hueso (`#E8E4DE`) en dark
- **Texto secundario/timestamps**: Gris ceniza (`#888888`) en light / (`#8A8580`) en dark
- **Acento primario**: Negro (`#000000`) en light / blanco (`#FFFFFF`) en dark — **el acento es tipográfico, no cromático**
- **Acento funcional (links activos, hover)**: Un solo color sutil — verde-ámbar apagado (`#7A8B3A`) — usado con extrema moderación
- **Acento por eje**: Los colores de eje se usan SOLO en badges y como indicadores mínimos, nunca como fondos ni decoración
- **Error/alerta**: Rojo ceniza (`#C44B3B`)

**El sitio ofrece modo claro Y oscuro**. Modo oscuro como default. Toggle explícito disponible en header.

**Tipografía** (no usar Inter, Roboto, Arial, Space Grotesk, ni ninguna genérica):
- **Display/títulos**: `IBM Plex Mono` o `JetBrains Mono` — monoespaciada, el nombre del sitio y secciones principales siempre en mono
- **Body/lectura**: `Source Serif 4` o `Literata` — serif contemporáneo optimizado para lectura larga en artículos
- **UI/navegación/etiquetas/filtros**: `IBM Plex Sans` — sans-serif que dialoga con la mono sin ser genérica
- **Código/metadata/timestamps**: `IBM Plex Mono` en peso 300, tamaño reducido

**Sistema de grid y bordes (inspiración CAN)**:
- La retícula editorial es **visible**: `border: 1px solid var(--border)` en secciones, cards, paneles
- Secciones del home separadas por líneas horizontales explícitas, no por whitespace vacío
- Los bloques de contenido se organizan en **celdas definidas** (como una hoja de cálculo editorial)
- Grid de contenido con columnas definidas por CSS Grid, no flexbox centrado
- Los filtros y categorías se presentan como **pill bars horizontales** con conteo numérico visible (ej: `algorithm 83 · installation 657 · generative 365`)
- Cada item de listado muestra inline: autor, fecha, categoría, tools/tags — como metadata expandida

**Patrones de interacción**:
- **View Mode Toggle**: Grid / List / Metadata — disponible en Journal, Resources, Library
- **Activity Feed**: Pattern cronológico con timestamp, @autor, tipo de acción para Observatory
- **Stats Dashboard**: Contadores grandes y visibles para números clave del proyecto (artículos, autores, ejes, idiomas)
- **Filter Bar**: Barra horizontal de filtros tipo pill para navegar contenido por eje, tipo, autor, idioma
- **Sidebar contextual**: En vistas de listado, sidebar derecho con filtros profundos, settings, y links contextuales
- **Hover**: Sutil, funcional — underline o leve cambio de opacidad, NUNCA bounces ni escalas exageradas
- **Transiciones de página**: Fade-in mínimo (200ms), no transiciones dramáticas
- **Bordes de celda en hover**: Las cards/items se destacan con borde más oscuro en hover, no con sombras

**Texturas y ambiente**:
- NO grain overlay (el monocromo es suficiente textura)
- Líneas de grid visibles como estructura editorial real
- Micro-animaciones solo funcionales: reveal en scroll, opacity en hover
- Scroll containers con bordes definidos (no infinite scroll sin contexto)
- Counters numéricos como elemento visual (números grandes en mono, conteos inline)

**Referentes estéticos NO para copiar, sino para absorber el tono**:
- **CAN – CreativeApplications.Net** (grid visible, densidad de metadata, view modes, activity feeds, community-first, monocromo tipográfico)
- **aleph:ch'ixi** (performance radical, CSS mínimo, opacidad como jerarquía, líneas como estructura, grid tabular, reveal universal, grayscale images)
- e-flux journal (rigor editorial, texto como rey)
- Arena.are.na (archivo, conexiones, anti-feed)
- Critical AI de Rutgers/Duke (academia accesible)
- Strelka Mag (diseño editorial + teoría)
- Rhizome (arte digital + archivo)

### 1.5 Reglas de Performance y CSS — Lecciones de aleph:ch'ixi

El sitio aleph:ch'ixi carga extraordinariamente rápido con solo **3 dependencias de runtime, 119 líneas de CSS global, y 4 variables de color**. Estas son las reglas estrictas para HABITAT.md, derivadas de auditar ese proyecto:

**Regla 1: CSS global ≤ 200 líneas.** El `globals.css` contiene SOLO: reset, variables, utility classes, y font rules. Todo lo demás es scoped al componente via CSS Modules o scoped styles.

**Regla 2: Utility classes globales** — exactamente estas, reutilizables en TODO el sitio:
```css
.text-mono    { font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em; }
.text-thin    { font-weight: 200; }
.text-regular { font-weight: 400; }
.text-sm      { font-size: 0.875rem; }
.text-xs      { font-size: 0.75rem; }
.hr-line      { width: 100%; height: 1px; background-color: var(--border); margin: 1rem 0; }
.hr-line-top  { border-top: 1px solid var(--border); }
```

**Regla 3: Opacidad como sistema de jerarquía** — NO color, pero sin comprometer legibilidad:
- `opacity: 0.7` → nav links inactivos, labels terciarios
- `opacity: 0.78` → títulos de sección (H1 como label), column headers
- `opacity: 0.86` → texto secundario, metadata
- `opacity: 0.92` → UI secundarios
- `opacity: 1.0` → hover, active states, texto principal

**Regla 3.1: Accesibilidad mínima de contraste.** Ningún texto funcional (links, filtros, labels interactivos) puede quedar por debajo de contraste WCAG AA. Evitar opacidades bajas en textos menores a 14px.

**Regla 4: H1 como label, no como hero.** El patrón de títulos de página es:
```html
<h1 class="text-mono text-sm" style="opacity: 0.78;">(Sección / Subtítulo)</h1>
<p class="text-thin" style="font-size: clamp(1.5rem, 3vw, 2.4rem);">Descripción grande</p>
```
El título es pequeño, mono, entre paréntesis, pero nunca ilegible en mobile. La descripción es grande, thin weight.

**Regla 5: Hover SOLO con opacity + underline.** Nunca escalar, nunca bouncear, nunca transform agresivo:
```css
.link:hover { opacity: 1; }
.row:hover { background-color: rgba(0,0,0,0.02); }
.title:hover { text-decoration-color: inherit; }
```

**Regla 6: Imágenes en grayscale** por defecto, color en hover:
```css
img { filter: grayscale(100%) contrast(1.05); transition: filter 0.5s ease; }
:hover img { filter: grayscale(0%) contrast(1.1); }
```

**Regla 7: Un solo patrón de reveal.** Clase `.gs-reveal` + Intersection Observer o framer-motion:
```
from: { y: 30, opacity: 0 }
to:   { y: 0, opacity: 1, duration: 1s, stagger: 0.1 }
```
Una sola animación. Un solo easing. Aplicable a cualquier elemento.

**Regla 8: Responsive por sustracción con preservación de contexto.** En mobile, se ocultan columnas secundarias, pero el contexto crítico (fuente/URL) debe sobrevivir como línea secundaria o acción expandible:
```css
@media (max-width: 768px) {
  .col-url, .col-platform, .col-access { display: none; }
}
```

**Regla 9: Footer como grid de 3 columnas** — `1fr 2fr 1fr`:
```
© 2026  |  revista-laboratorio-observatorio del hábitat cibernético  |  Guarne, Antioquia
```

**Regla 10: Minimizar dependencias de runtime.** Next.js + next-intl + MDX pipeline son el core. Fuera de eso, cada dependencia adicional necesita justificación explícita. No agregar librerías de UI, no agregar CSS frameworks, no agregar state managers.

**Regla 11: Interacción accesible por defecto.**
- Todos los controles interactivos tienen `:focus-visible` claro y consistente.
- Navegación completa por teclado en header, filtros, toggles y tablas.
- Tamaño mínimo recomendado de target táctil: 40x40px.
- Estado activo/inactivo no depende solo de color; usar texto, borde o iconografía.

---

## 2. ARQUITECTURA EDITORIAL — LOS 6 EJES

El contenido se organiza en 6 ejes temáticos. Cada eje funciona como una lente, no como un silo. Los contenidos pueden cruzar múltiples ejes.

### Eje 1: HABITAT
IA, agentes, interfaces, automatización, infraestructuras, plataformas, mercados algorítmicos, cripto y tokenización, dispositivos emergentes, robótica, nuevas relaciones humano-no humano.

### Eje 2: ETHICS
Justicia, verdad, bien común, dignidad, sufrimiento, compasión, solidaridad, cuidado, gobernanza, diseño ético. No moralismo: ética encarnada.

### Eje 3: ECOLOGY
Materialidad digital, energía, agua, residuos, extractivismo, sostenibilidad, ecologías técnicas, permacultura, coexistencia planetaria, dark ecology, hiperobjetos.

### Eje 4: SPIRIT
Espiritualidad experimental, teología no institucional, mística, simbolismo, mitología, magia, contemplación, ritual, tecnología y trascendencia, budismo contemporáneo.

### Eje 5: COSMOTECHNICS
Cosmotécnica (Yuk Hui), decolonialidad, ch'ixi (Rivera Cusicanqui), ancestralidad, lenguajes indígenas, pluralidad ontológica, subversión técnica, refuncionalización, xenofeminismo, pensamiento latinoamericano/Abya Yala.

### Eje 6: LAB
Herramientas, agentes, souls, skills, experimentos, metodologías, workflows, talleres, documentación de procesos, prototipos, bitácoras técnicas.

---

## 3. TIPOS DE CONTENIDO

Cada pieza de contenido tiene un `type` en su modelo de datos:

| Tipo | Descripción | Longitud típica |
|------|-------------|-----------------|
| `essay` | Ensayo largo, argumentativo, profundo | 2000-8000 palabras |
| `note` | Nota breve, reacción rápida, observación | 200-800 palabras |
| `column` | Columna editorial periódica | 800-2000 palabras |
| `interview` | Entrevista en formato Q&A o narrativo | 1500-5000 palabras |
| `manifesto` | Declaración de principios, programática | 500-3000 palabras |
| `review` | Reseña de libro, herramienta, proyecto | 500-2000 palabras |
| `dossier` | Conjunto temático de piezas relacionadas | Variable |
| `bibliography` | Bibliografía comentada | Variable |
| `resource-map` | Mapa curado de recursos sobre un tema | Variable |
| `tutorial` | Guía práctica, how-to | 1000-4000 palabras |
| `observatory` | Brief de tendencias, análisis corto | 300-1000 palabras |
| `field-note` | Diario de campo, bitácora | 200-1500 palabras |
| `experiment` | Pieza experimental, hybrid form | Variable |
| `agentic-text` | Texto producido por agente, declarado | Variable |
| `hybrid-text` | Texto humano-agente, transparente | Variable |

---

## 4. MODOS DE AUTORÍA

Tres firmas posibles. Cada contenido debe declarar su modo:

1. **`human`** — Autor humano explícito con byline personal
2. **`agent`** — Agente redactor explícito, con marco metodológico visible. Se declara qué modelo, qué fuentes, qué protocolo
3. **`habitat`** — Voz de casa / pseudónimo ambiguo. No engañosa: el lector sabe que la firma "HABITAT" puede ser humana, agéntica o híbrida. Es la firma editorial del proyecto

Cada contenido lleva un campo `authorship_mode` y un campo `authorship_note` opcional para transparencia.

---

## 5. IDIOMA — ESTRATEGIA BILINGÜE

### Estructura
- **Inglés (en)**: Lengua de interlocución internacional. La mayoría del contenido público
- **Español (es)**: Lengua estructural y situada, NO secundaria. No es un botón de Google Translate

### Reglas
1. Manifiesto, About y páginas principales: bilingües, redactadas (no traducidas automáticamente)
2. Textos centrales: bilingües cuando sea posible
3. Sección **LatAm / Ch'ixi / Decolonial**: contenido exclusivo en español, esto es parte del proyecto intelectual
4. Colaboradores escriben en la lengua que elijan
5. Traducciones asistidas por agente, pero revisadas editorialmente
6. Los metadatos del sitio (navegación, labels, footer) siempre en ambos idiomas

### Implementación técnica
- Usar `next-intl` con App Router y estructura `app/[locale]/`
- Archivos de mensajes en `messages/en.json` y `messages/es.json`
- Middleware de detección de locale
- Contenido MDX con frontmatter que declara `locale: en|es` y `translation_key` único para vincular versiones EN/ES de una misma pieza

---

## 6. TECH STACK — DECISIONES DE ARQUITECTURA

### 6.1 Framework
**Next.js 15** (App Router) — SSG/ISR para contenido, RSC para componentes server-side.

### 6.2 Contenido
**MDX file-based (Git-driven)** — No CMS externo en MVP. Razones:
- El equipo inicial es técnico (eme + filósofo + agente)
- El contenido nace en Obsidian y markdown
- Control de versiones vía Git es consistente con la filosofía del proyecto
- Zero runtime overhead
- Type-safe frontmatter

**Herramienta de procesamiento (decisión cerrada)**: `next-mdx-remote/rsc` + `gray-matter` + plugins `remark/rehype` (`remark-gfm`, `rehype-slug`, `rehype-highlight`, `rehype-sanitize`) leyendo archivos MDX desde `content/`.
No usar `Velite` en MVP.

### 6.3 Estructura de archivos MDX
```
content/
├── en/
│   ├── essays/
│   │   └── cosmotechnics-of-the-feed.mdx
│   ├── notes/
│   ├── observatory/
│   └── resources/
├── es/
│   ├── ensayos/
│   │   └── cosmotecnica-del-feed.mdx
│   ├── notas/
│   ├── observatorio/
│   └── recursos/
└── shared/
    ├── authors/
    │   ├── eme.json
    │   └── habitat.json
    └── tags.json
```

### 6.4 Frontmatter del contenido MDX
```yaml
---
title: string
slug: string
locale: en | es
translation_key: string
type: essay | note | column | interview | manifesto | review | dossier | bibliography | resource-map | tutorial | observatory | field-note | experiment | agentic-text | hybrid-text
axes: string[]
author: string
authorship_mode: human | agent | habitat
authorship_note?: string
status: draft | review | approved | published
date: YYYY-MM-DD
updated?: YYYY-MM-DD
featured: boolean
excerpt: string
tags: string[]
reading_time?: number
cover_image?: string
sources?: [{title: string, url: string, kind: primary | secondary, checked_at: YYYY-MM-DD}]
model_info?: {provider: string, model: string, version?: string}
human_review?: {reviewed: boolean, by?: string, at?: YYYY-MM-DD}
---
```

### 6.5 Estilos
**Vanilla CSS** con custom properties (CSS variables) para el design system. NO Tailwind. Razones:
- Control total sobre la estética
- Coherencia con el espíritu minimal/editorial del proyecto
- Archivo CSS legible y mantenible como artefacto propio

### 6.6 Despliegue
**Vercel** — integración nativa con Next.js, preview deployments para review editorial, edge functions.

### 6.7 Dependencias clave
```json
{
  "core": {
    "next": "^15",
    "react": "^19",
    "next-intl": "^4",
    "next-mdx-remote": "^5",
    "gray-matter": "^4",
    "remark-gfm": "^4",
    "rehype-slug": "^6",
    "rehype-highlight": "^7",
    "rehype-sanitize": "^6",
    "reading-time": "^1",
    "rss": "^1",
    "sharp": "^0.33"
  }
}
```

### 6.8 Seguridad Base (obligatoria desde Fase 0)

**Baseline obligatorio (sin excepción):**
- Sanitización de contenido MDX con `rehype-sanitize` antes de render.
- Security headers base (`Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`).
- CSP inicial estricta para scripts, estilos, imágenes y fuentes permitidas.
- Validación de origen y método HTTP para cualquier endpoint interno del dashboard/API.
- Política de secretos: no credenciales en repo, uso de variables de entorno por entorno (dev/preview/prod).

**Regla de publicación interna:**
- No se publica `/dashboard` ni CRUD editorial sin autenticación robusta y control de roles (`admin`, `editor`, `reviewer`).

**Checklist mínimo de hardening (preview y producción):**
- [ ] Sanitización MDX activa y testeada.
- [ ] Headers de seguridad presentes en respuestas HTML.
- [ ] CSP activa sin romper render de fuentes ni assets permitidos.
- [ ] `.env*` excluidos de VCS y rotación de secretos documentada.
- [ ] Logs de errores sin exponer secretos ni datos sensibles.
- [ ] Validación de entrada en route handlers (schema + límites de tamaño).

---

## 7. ESTRUCTURA DEL SITIO — MAPA COMPLETO

### 7.1 Público

```
/                          → Home (editorial, no landing page)
/about                     → Manifiesto + qué es + quiénes somos
/journal                   → Índice de todas las publicaciones (filtrable por eje, tipo, idioma)
/journal/[slug]            → Página de artículo individual
/observatory               → Noticias, briefs, tendencias
/library                   → Bibliografía, libros, papers, autores (fase posterior)
/resources                 → Herramientas, repos, newsletters, colectivos, links curados
/lab                       → Experimentos, prototipos, bitácoras agénticas
/authors                   → Directorio de autores humanos y agentes
/authors/[slug]            → Perfil de autor con sus publicaciones
/latam                     → Sección exclusiva en español: pensamiento latinoamericano, decolonial, ch'ixi
/tags/[tag]                → Páginas de tag
/feed.xml                  → RSS feed
```

### 7.2 Interno (Fase 4 — dashboard)

```
/dashboard                 → Panel de estado editorial
/dashboard/drafts          → Textos en borrador
/dashboard/review          → Cola de revisión
/dashboard/publish         → Cola de publicación
/dashboard/sources         → Biblioteca de fuentes y materiales
/dashboard/agents          → Estado del agente editorial
```

---

## 8. COMPONENTES — DISEÑO POR COMPONENTE

### 8.1 Layout base — Sistema CAN-inspired

El layout base usa un sistema de **header pegajoso + área de contenido flexible + footer informacional**. Las páginas de listado (Journal, Resources, Library) usan un layout con **sidebar contextual** a la derecha en desktop.

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│  HABITAT.md (mono)  │  Nav pills (Activity, Journal,        │
│                      │  Resources, Lab, About, LatAm)        │
│                      │  Search input  │  ◐ Theme  │  EN/ES  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────┬──────────────────────┐  │
│  │                                 │                      │  │
│  │  MAIN CONTENT                   │  SIDEBAR (opcional)  │  │
│  │  (varía por sección)            │  Filtros, stats,     │  │
│  │                                 │  links contextuales  │  │
│  │                                 │                      │  │
│  └─────────────────────────────────┴──────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│  About │ Manifiesto │ RSS │ Ejes │ Social │ Analytics │ ©   │
│  (border-top visible, tipografía mono pequeña)               │
└──────────────────────────────────────────────────────────────┘
```

**Para páginas de lectura (artículos individuales):** layout centrado sin sidebar, max-width ~700px, serif, footnotes, metadata top visible.

**Para páginas de listado (Journal, Resources, Library, Observatory):** layout con sidebar y view mode toggles.

### 8.2 Componentes clave a implementar

#### Estructura y navegación

| Componente | Descripción |
|------------|-------------|
| `<Header />` | Logo en mono (`HABITAT.md`), nav como pills horizontales (inspirado en CAN: Activity, Archives, Community, People, Tools...), input de búsqueda inline, theme toggle (◐), lang toggle (EN/ES). Borde inferior visible. |
| `<Footer />` | Links en mono, RSS, ejes como links, créditos, versión. Borde superior visible. Tipografía mono pequeña. |
| `<Sidebar />` | Panel lateral derecho para páginas de listado. Contiene: filtros por eje, tipo, autor, idioma; stats rápidos; links contextuales. Solo en desktop, colapsable. |
| `<ViewModeToggle />` | Toggle Grid / List / Metadata para vistas de listado. Tres botones inline, el activo se marca con borde más grueso. |
| `<FilterBar />` | Barra horizontal de pills filtrantes: `Show All · Essays · Notes · Observatory · Reviews...` con conteo numérico inline (ej: `Essays 12`). |
| `<Navigation />` | Nav principal tipo pills horizontales. Cada sección es un link con separadores `│`. |

#### Contenido

| Componente | Descripción |
|------------|-------------|
| `<ArticleCard />` | Card con borde visible. Muestra: título (mono bold), excerpt, eje(s) como indicators mínimos, @autor, fecha ISO, reading time, tipo. En vista Grid: card con imagen opcional + metadata. En vista List: una línea densa con toda la metadata inline. En vista Metadata: toda la info expandida incluyendo tags, tools, conceptos. |
| `<ArticleLayout />` | Layout de lectura: tipografía serif, ancho máximo ~700px, margen generoso, footnotes. Metadata top en mono: fecha, autor, eje, tipo, reading time, modo de autoría. Borde inferior separando metadata de cuerpo. Links a traducción si existe. |
| `<ActivityDigest />` | Resumen cronológico mínimo para Home MVP: últimas 5 acciones (publicaciones y updates) con timestamp y enlace. |
| `<ActivityFeed />` | Feed cronológico completo (Fase 2): `▶ 2h ago ✉ @eme published "Cosmotechnics of the Feed" in Ethics`, filtrable por tipo de acción y autor. |
| `<ObservatoryFeed />` | Feed cronológico de notas breves, briefs, señales. Formato denso, timestamps visibles, @autor inline. |
| `<ResourceTable />` | Tabla/listado de recursos (MVP) con bordes visibles por fila, filtros por categoría y metadata de curaduría. |
| `<TagCloud />` | Tags con conteo numérico inline, en tipografía mono. Formato: `algorithm 83 · generative 365 · installation 657`. Horizontal, scrollable si excede ancho. |
| `<StatsPanel />` | Panel de contadores tipo dashboard CAN: números grandes en mono (`Articles: 47`, `Authors: 12`, `Axes: 6`). Celdas con borde visible. Aparece en Home y en sidebars. |
| `<TableOfContents />` | TOC flotante para ensayos largos (sticky sidebar en desktop). Tipografía mono pequeña. |

#### UI primitivas

| Componente | Descripción |
|------------|-------------|
| `<AxisBadge />` | Indicador mínimo por eje temático. Un punto de color (`●`) + nombre del eje en texto. El color es sutil, no dominante. |
| `<AuthorBadge />` | Indicador de autoría: `@eme` (humano), `◊agente` (agent), `◆habitat` (voz de casa). Formato @handle como CAN. Con tooltip explicativo del modo de autoría. |
| `<BilingualToggle />` | Si el artículo tiene traducción, enlace directo: `[EN]` / `[ES]` como pills en la metadata del artículo. |
| `<ThemeToggle />` | Toggle light/dark (◐). Mínimo, en el header. |
| `<Callout />` | Bloque de cita especial con variantes: note, warning, insight, voice. Borde izquierdo visible, no background colorido. |
| `<SearchBar />` | Input de búsqueda inline en el header. Borde visible, mono, placeholder en gris. Búsqueda client-side sobre el índice. |
| `<MDXComponents />` | Map de componentes custom para MDX: headings con anchor links, code blocks, blockquotes, callouts, inline metadata. |
| `generateMetadata()` | API nativa de App Router para metadata dinámica por página (OG, Twitter cards, JSON-LD), apoyada por `lib/seo.ts`. |

### 8.3 Colores por eje (solo para badges e indicadores mínimos, NUNCA como fondos)

| Eje | Color | Hex | Uso |
|-----|-------|-----|-----|
| Habitat | Azul frío | `#4A7C9B` | `●` dot en badge |
| Ethics | Ámbar cálido | `#C9A84C` | `●` dot en badge |
| Ecology | Verde apagado | `#6B8E3A` | `●` dot en badge |
| Spirit | Púrpura profundo | `#8B6BAE` | `●` dot en badge |
| Cosmotechnics | Terracota | `#B85C38` | `●` dot en badge |
| Lab | Gris técnico | `#6B7B8D` | `●` dot en badge |

> Los colores de eje se reducen a un `●` dot de 8px junto al nombre del eje. No se usan como fondos, bordes coloridos ni gradientes. El monocromo manda.

### 8.4 Accesibilidad y jerarquía responsive (obligatorio)

- Contraste mínimo AA en texto e interfaz interactiva, en light y dark mode.
- `:focus-visible` explícito en links, pills, filtros, toggles, inputs y filas clicables.
- Navegación completa por teclado (header, filtros, tablas, paginación, cambio de idioma/tema).
- Tamaño mínimo de texto interactivo: 14px; evitar labels críticos por debajo de ese umbral.
- Targets táctiles recomendados: 40x40px.
- Densidad editorial en desktop, jerarquía por sustracción en mobile (primario visible, secundario plegable, nunca opaco al punto de perder legibilidad).

---

## 9. HOME — PORTADA EDITORIAL + DASHBOARD

La home NO es una landing page de producto. NO es un blog con cards bonitas. Es una **portada editorial-informacional** que combina contenido destacado con densidad de datos, inspirada en el approach de CAN: contenido + actividad + stats + comunidad visibles desde el primer scroll.

### Estructura de la Home

```
┌──────────────────────────────────────────────────────────────┐
│ STATS BAR                                                    │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │ Articles     │ Authors      │ Axes         │ Languages  │ │
│  │ 47           │ 12           │ 6            │ 2          │ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ EDITORIAL DESTACADA                                          │
│  Pieza featured: título grande en mono, excerpt en serif,    │
│  eje como ● dot, @autor, fecha ISO, reading time.            │
│  Sin imagen hero — el texto es el protagonista.              │
│  Borde inferior.                                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────┬─────────────────────────────┐  │
│  │ RECENT PUBLICATIONS      │ ACTIVITY                    │  │
│  │ (List view)              │ (Feed cronológico)          │  │
│  │                          │                             │  │
│  │ ▶ título — @autor — eje  │ ▶ 2h @eme published...     │  │
│  │ ▶ título — @autor — eje  │ ▶ 5h @habitat noted...     │  │
│  │ ▶ título — @autor — eje  │ ▶ 1d @agente drafted...    │  │
│  │ ▶ título — @autor — eje  │ ▶ 2d new resource added    │  │
│  │ ▶ título — @autor — eje  │ ▶ 3d @eme reviewed...      │  │
│  │                          │                             │  │
│  │ → See all in Journal     │ → See all activity          │  │
│  └──────────────────────────┴─────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ AXES — Grid de 6 celdas con borde visible                    │
│  ┌──────────┬──────────┬──────────┐                          │
│  │●HABITAT  │●ETHICS   │●ECOLOGY  │                          │
│  │ último   │ último   │ último   │                          │
│  │ artículo │ artículo │ artículo │                          │
│  ├──────────┼──────────┼──────────┤                          │
│  │●SPIRIT   │●COSMOTEK │●LAB      │                          │
│  │ último   │ último   │ último   │                          │
│  │ artículo │ artículo │ artículo │                          │
│  └──────────┴──────────┴──────────┘                          │
├──────────────────────────────────────────────────────────────┤
│ TOPICS — Tag cloud horizontal con conteos                    │
│  algorithm 83 · generative 365 · installation 657 ·         │
│  cosmotechnics 12 · decolonial 8 · ecology 23 · ...         │
├──────────────────────────────────────────────────────────────┤
│ MANIFESTO BRIEF                                              │
│  Una línea del manifiesto en serif italic + enlace → About   │
└──────────────────────────────────────────────────────────────┘
```

### 9.1 Reglas de usabilidad real para Home

- El primer viewport debe comunicar qué es HABITAT.md sin depender de scroll.
- En MVP, el bloque de activity usa `ActivityDigest` (5 eventos). `ActivityFeed` completo entra en Fase 2.
- En mobile, la columna de Activity se mueve debajo de publicaciones recientes (no desaparece).
- Stats y metadata se mantienen visibles, pero con prioridad: `featured > recent > activity > axes > topics`.
- No sacrificar legibilidad por densidad: spacing mínimo consistente en bloques de lectura.
- Todos los módulos de Home deben ser navegables por teclado y lector de pantalla.

### 9.2 About / Manifesto — Wireframe MVP

```
┌──────────────────────────────────────────────────────────────┐
│ (About / Manifesto)                                          │
│ HABITAT.md as editorial infrastructure                        │
├──────────────────────────────────────────────────────────────┤
│ BLOQUE 1: MANIFIESTO BREVE                                   │
│ 3-5 párrafos, bilingüe, tesis central + pregunta rectora     │
├──────────────────────────────────────────────────────────────┤
│ BLOQUE 2: LOS 6 EJES (tabla compacta)                        │
│ eje | problema que aborda | tipo de piezas                   │
├──────────────────────────────────────────────────────────────┤
│ BLOQUE 3: MODOS DE AUTORÍA                                   │
│ human | agent | habitat + protocolo de transparencia         │
├──────────────────────────────────────────────────────────────┤
│ BLOQUE 4: MÉTODO EDITORIAL                                   │
│ cómo se investiga, escribe, revisa y publica                 │
├──────────────────────────────────────────────────────────────┤
│ BLOQUE 5: ENLACES DE CONTEXTO                                │
│ Journal | Resources | LatAm | RSS                            │
└──────────────────────────────────────────────────────────────┘
```

Reglas:
- En MVP, About es informativo y operativo, no solo poético.
- Debe leerse bien en `en` y `es` sin depender de traducción automática.
- Incluir fecha de última actualización editorial.

---

## 10. RESOURCES — DIRECTORIO EXPANDIDO

La página de Resources hereda directamente el diseño y contenido del directorio de enlaces de **aleph:ch'ixi** (`/Users/navi/Documents/alephchixi/src/data/enlaces.ts` + `src/pages/recursos.astro`). Se traslada la estructura, la estética tabular y los ~190 enlaces curados como seed content para HABITAT.md.

### 10.1 Diseño de la página

**Diseño tabular con filter bar** — NO es un grid de cards. Es una **tabla/lista** densa, monoespaciada, con tres columnas y un filtro por categoría. Inspirada en el diseño existente de alephchixi y consistente con la estética CAN-inspired de HABITAT.md.

```
┌──────────────────────────────────────────────────────────────┐
│ (Resources / Expanded Directory)                              │
│  Resources we recommend                                       │
├──────────────────────────────────────────────────────────────┤
│ FILTER BAR                                                    │
│  ● ALL  ○ HERRAMIENTAS  ○ EDITORIALES  ○ PORTALES           │
│  ○ PLATAFORMAS  ○ HABITAT                                    │
├──────────────────────────────────────────────────────────────┤
│ TIPO            │ NOMBRE              │ URL                   │
├─────────────────┼─────────────────────┼───────────────────────┤
│ HERRAMIENTAS    │ Obsidian            │ obsidian.md           │
│ HERRAMIENTAS    │ Ollama              │ ollama.com            │
│ EDITORIALES     │ Caja Negra          │ cajanegraeditora.com  │
│ EDITORIALES     │ MIT Press           │ mitpress.mit.edu      │
│ PORTALES        │ e-flux              │ e-flux.com            │
│ PORTALES        │ The Wire            │ thewire.co.uk         │
│ PLATAFORMAS     │ Ars Electronica     │ ars.electronica.art   │
│ PLATAFORMAS     │ Sonic Acts          │ sonicacts.com         │
│ HABITAT         │ CreativeApps.Net    │ creativeapplications… │
│ ...             │ ...                 │ ...                   │
└─────────────────┴─────────────────────┴───────────────────────┘
```

**Comportamiento:**
- Filter bar con pills: cada categoría es un botón con dot indicator (`●` activo / `○` inactivo)
- Grid CSS de 3 columnas (`190px minmax(220px, 1fr) minmax(280px, 420px)`)
- Cada fila es un `<a>` con border-bottom, hover sutil con background-color change
- URL column muestra el dominio limpio (sin `https://`)
- Column URL se compacta en mobile (<1180px) como segunda línea o campo expandible, sin perder trazabilidad de fuente
- Filas ordenadas alfabéticamente por `label`
- Transición de opacidad al filtrar (no animación pesada)

### 10.2 Modelo de datos

```typescript
// content/shared/enlaces.ts

export type LinkType = "herramientas" | "editoriales" | "portales" | "plataformas" | "habitat";

export interface LinkItem {
  id: string;
  type: LinkType;
  label: string;
  href: string;
  description?: string;  // Opcional: nota breve sobre el enlace
  axes?: string[];       // Opcional: ejes temáticos relacionados
  source: string;        // Fuente de curaduría (proyecto/persona/documento)
  curation_status: "seed" | "reviewed" | "verified";
  last_checked_at: string; // YYYY-MM-DD
  license_note?: string;
  region?: string;       // Global | LatAm | etc.
}
```

### 10.3 Categorías

| Categoría | Qué incluye | Count (seed) |
|-----------|-------------|:------------:|
| `herramientas` | Software, DAWs, terminales, editores, AI tools, trading tools | ~14 |
| `editoriales` | Sellos editoriales: Caja Negra, Urbanomic, MIT Press, Verso, Tinta Limón... | ~60 |
| `portales` | Revistas, journals, blogs, plataformas de contenido: e-flux, The Wire, Rhizome, K-punk... | ~67 |
| `plataformas` | Instituciones, labs, festivales, redes, colectivos: Ars Electronica, CCCB Lab, Sonic Acts... | ~42 |
| `habitat` | Meta-categoría propia de HABITAT.md: recursos del propio proyecto, partners, alianzas | nueva |

### 10.4 Seed content

Los ~190 enlaces de seed se toman directamente de `alephchixi/src/data/enlaces.ts`. Al migrar:
- La categoría `"aleph:ch'ixi"` se renombra a `"habitat"` (o se elimina y redistribuye)
- Se mantienen las 4 categorías restantes: `herramientas`, `editoriales`, `portales`, `plataformas`
- Se pueden agregar enlaces adicionales relevantes al contexto de HABITAT.md
- El archivo fuente está en: `/Users/navi/Documents/alephchixi/src/data/enlaces.ts`

### 10.5 Componente y ruta

- **Ruta**: `app/[locale]/resources/page.tsx`
- **Componente principal**: importa datos de `content/shared/enlaces.ts`
- **Filter bar**: componente client-side que filtra filas por `data-type`
- **Responsive**: 3 columnas desktop → 2 columnas tablet → 2 columnas stacked mobile
- **Bilingüe**: labels de categorías y header traducidos vía `next-intl`, los nombres de enlaces se mantienen en su idioma original

### 10.6 Política de curaduría (obligatoria)

Cada enlace en Resources debe cumplir una ficha mínima:
- `source`: de dónde proviene el enlace (curador, publicación, comunidad).
- `last_checked_at`: fecha de última validación.
- `curation_status`: `seed`, `reviewed` o `verified`.
- Criterio de inclusión: relevancia para los 6 ejes, valor de uso real, y consistencia con la línea editorial.

Reglas:
- No listar enlaces sin trazabilidad de fuente.
- Enlaces rotos o desactualizados pasan a estado `seed` o se retiran.
- Priorización editorial: calidad y contexto por encima de volumen.

---

## 11. ROADMAP DE DESARROLLO — FASES

### ═══════════════════════════════════════
### FASE 0 — SCAFFOLDING (Pre-MVP)
### ═══════════════════════════════════════

**Duración estimada**: 1-2 sesiones (~6-10 horas)

**Objetivo**: Andamiaje técnico + baseline de seguridad + contrato de contenido.

#### Tareas:
- [ ] Crear proyecto Next.js 15 con App Router en `/Users/navi/Documents/habitat`
- [ ] Instalar dependencias core: `next-intl`, `next-mdx-remote`, `gray-matter`, `reading-time`, `rehype-highlight`, `rehype-slug`, `rehype-sanitize`, `remark-gfm`, `rss`, `sharp`
- [ ] Configurar estructura `app/[locale]/` con `next-intl`
- [ ] Crear `messages/en.json` y `messages/es.json` con strings base de UI
- [ ] Crear middleware de i18n
- [ ] Configurar CSS variables globales con el design system monocromo completo (paleta light/dark, tipografía, spacing, bordes)
- [ ] Importar fuentes: IBM Plex Mono, Source Serif 4, IBM Plex Sans (Google Fonts o `next/font`)
- [ ] Crear layout base con `<Header />` (logo mono + nav pills + search + theme toggle + lang toggle) y `<Footer />` (mono, border-top)
- [ ] Implementar sistema de grid con bordes visibles (CSS Grid + border-box pattern)
- [ ] Implementar theme toggle (light/dark) con CSS custom properties y localStorage
- [ ] Crear estructura de directorios para contenido MDX
- [ ] Configurar pipeline MDX único: lectura `content/**.mdx` + `gray-matter` + `next-mdx-remote/rsc` + `remark/rehype`
- [ ] Definir y validar schema de frontmatter (`translation_key`, `status`, trazabilidad editorial)
- [ ] Crear archivo `content/en/essays/_template.mdx` como plantilla
- [ ] Configurar `next.config.js` para optimizaciones de imágenes y headers base de seguridad
- [ ] Activar baseline de seguridad: sanitización MDX + security headers + CSP inicial
- [ ] Verificación de entorno local funcional en pre-vuelo

#### Definition of Done (DoD + gates)
- [ ] `npm run dev` y `npm run build` pasan sin errores.
- [ ] Frontmatter inválido rompe build (gate de calidad de contenido).
- [ ] MDX sanitizado y headers de seguridad visibles en preview (gate de seguridad).
- [ ] Layout base funcional (header/footer/theme/i18n) verificado en local.

---

### ═══════════════════════════════════════
### FASE 1 — MVP (Mínimo Viable)
### ═══════════════════════════════════════

**Duración estimada**: 3-4 sesiones (~18-28 horas)

**Objetivo**: El primer portal funcional con contenido real publicable.

#### Incluye SOLAMENTE:
1. **Home editorial** — Portada con pieza destacada, recientes, ejes y `ActivityDigest` mínimo
2. **About / Manifesto** — Página bilingüe con el manifiesto del proyecto
3. **Journal** — Índice de publicaciones con filtros por eje y tipo
4. **[slug] article page** — Página de lectura con tipografía editorial, MDX rendering, metadata, badges de eje y autoría
5. **Authors** — Directorio con perfiles mínimos (eme + habitat como voz de casa)
6. **Resources / Directorio** — Directorio expandido de enlaces curados con diseño tabular (3 columnas: TIPO, NOMBRE, URL) y filter bar tipo pill con categorías: `herramientas`, `editoriales`, `portales`, `plataformas`, `habitat`. Trasladado directamente desde aleph:ch'ixi con contenido adaptado. ~190 enlaces de seed.
7. **Bilingüe funcional** — Toggle en/es, contenido en ambos idiomas donde exista
8. **RSS feed** — `/feed.xml` generado estáticamente
9. **SEO base** — OG tags, meta descriptions, canónicos/hreflang y JSON-LD para artículos
10. **Primer contenido real** — Mínimo 1 ensayo + 1 nota + el manifiesto en ambos idiomas

#### Tareas detalladas Fase 1

**Contenido**
- [ ] Escribir manifiesto bilingüe usando el wireframe de About.
- [ ] Crear 1 ensayo y 1 nota reales (no lorem ipsum).
- [ ] Crear perfiles mínimos de autor `eme` y firma editorial `habitat`.

**Componentes (MVP)**
- [ ] `<Header />` con nav, theme toggle y lang toggle.
- [ ] `<Footer />` con links editoriales y RSS.
- [ ] `<ArticleCard />`, `<ArticleLayout />`, `<AxisBadge />`, `<AuthorBadge />`.
- [ ] `<FilterBar />` para Journal y Resources.
- [ ] `<StatsPanel />` para Home.
- [ ] `<ActivityDigest />` (no feed avanzado todavía).
- [ ] `<ResourceTable />` con columnas y comportamiento responsive definidos.
- [ ] `<BilingualToggle />` en artículos con traducción.
- [ ] `<MDXComponents />` y `<Callout />`.

**Páginas (MVP)**
- [ ] `app/[locale]/page.tsx` (Home).
- [ ] `app/[locale]/about/page.tsx` (About/Manifesto).
- [ ] `app/[locale]/journal/page.tsx`.
- [ ] `app/[locale]/journal/[slug]/page.tsx`.
- [ ] `app/[locale]/authors/page.tsx`.
- [ ] `app/[locale]/authors/[slug]/page.tsx`.
- [ ] `app/[locale]/resources/page.tsx`.
- [ ] `app/[locale]/not-found.tsx` y `app/[locale]/error.tsx`.

**Estados vacíos y fallos**
- [ ] Empty state en Journal sin resultados de filtro.
- [ ] Empty state en Resources sin resultados por categoría.
- [ ] Empty state en Authors cuando no hay publicaciones.
- [ ] Mensajería de error legible y no técnica para usuario final.

**Utilidades**
- [ ] `lib/content.ts` (lectura/parsing/listado de MDX en `content/`).
- [ ] `lib/mdx.ts` (compilación y sanitización con `next-mdx-remote/rsc`).
- [ ] `lib/authors.ts`.
- [ ] `lib/seo.ts` con `generateMetadata()`.
- [ ] `lib/feed.ts` para RSS.
- [ ] `generateStaticParams` en rutas dinámicas (`journal/[slug]`, `authors/[slug]`, `tags/[tag]` cuando aplique).

**Estilo y performance**
- [ ] Sistema monocromo + bordes visibles + tipografía definida.
- [ ] Responsive mobile-first en breakpoints 768 y 1200.
- [ ] Dark mode default con toggle funcional.
- [ ] `:focus-visible` y contraste AA en rutas MVP.
- [ ] Separación explícita Server vs Client components (Server-first).

#### Entra a Fase 2 (se difiere del MVP)
- Activity feed avanzado con acciones filtrables (`<ActivityFeed />`).
- TOC sticky para ensayos largos.
- View modes completos (Grid/List/Metadata) en todos los listados.
- Búsqueda refinada con ranking, atajos y facets.

#### Definition of Done (DoD + gates)
- [ ] Home, About, Journal, artículo, Authors y Resources funcionan en `en/es`.
- [ ] Publicadas al menos 3 piezas núcleo: manifiesto (en+es), 1 ensayo, 1 nota.
- [ ] RSS válido y metadata SEO base correcta en páginas clave.
- [ ] Accesibilidad mínima: focus visible + navegación por teclado + contraste AA en rutas MVP.
- [ ] Security gate: contenido renderizado sin HTML peligroso ni scripts inyectados.
- [ ] `generateStaticParams` cubre rutas dinámicas MVP sin fallback roto.
- [ ] Deploy oficial del MVP a Vercel o hosting de preferencia.

---

### ═══════════════════════════════════════
### FASE 2 — OBSERVATORY + LATAM
### ═══════════════════════════════════════

**Duración estimada**: 2-3 sesiones (~10-16 horas)

**Objetivo**: Activar la capa de contenido breve y la línea editorial en español.

#### Incluye:
- [ ] **Observatory** (`/observatory`) — Feed cronológico de notas breves, briefs de tendencias, análisis cortos
- [ ] **LatAm** (`/latam`) — Sección exclusiva en español con contenido decolonial, ch'ixi, pensamiento latinoamericano
- [ ] **Tags** (`/tags/[tag]`) — Páginas de tag con listado de contenidos relacionados
- [ ] **ActivityFeed avanzado** — acciones filtrables por tipo/autor
- [ ] **Búsqueda refinada** — búsqueda client-side con ranking básico y filtros
- [ ] **TableOfContents sticky** — TOC flotante para ensayos largos
- [ ] **Filtros mejorados en Journal** — Por eje, tipo, idioma, fecha
- [ ] **View modes completos** — Grid/List/Metadata en Journal y Resources donde aplique
- [ ] **Paginación controlada** en listings (evitar infinite scroll sin contexto)

#### Definition of Done (DoD + gates)
- [ ] Observatory activo con al menos 3 entradas.
- [ ] LatAm activo con al menos 2 piezas propias.
- [ ] Tags y búsqueda devuelven resultados correctos en ambos idiomas.
- [ ] Gate de UX: tiempo de hallazgo de contenido < 3 clics desde Home.

---

### ═══════════════════════════════════════
### FASE 3 — LIBRARY + RESOURCES EXPANDIDOS
### ═══════════════════════════════════════

**Duración estimada**: 2-3 sesiones (~12-18 horas)

**Objetivo**: Construir el archivo y la capa de referencia del proyecto.

#### Incluye:
- [ ] **Library** (`/library`) — Bibliografía filtrable: libros, papers, autores, conceptos
- [ ] Modelo de datos para `Book`, `Paper`, `Author`, `Concept` (archivos JSON o MDX)
- [ ] Filtros por: tema, año, región, tipo de publicación, eje
- [ ] **Resources expandido** — Agregar nuevas categorías, permitir contribuciones externas, implementar view modes Grid/List (el diseño tabular del MVP se convierte en la vista "List")
- [ ] **Dossier** — Agrupación de piezas bajo un tema común (como un número especial)
- [ ] **Reading lists** — Listas curadas de lectura
- [ ] **Interlink system** — Cuando un artículo cita un libro/autor de la Library, el enlace es interno
- [ ] Gobernanza de Resources activa: `source`, `curation_status`, `last_checked_at`

#### Definition of Done (DoD + gates)
- [ ] Library con al menos 20 entradas y filtros funcionales.
- [ ] Resources con auditoría de enlaces (estado reviewed/verified).
- [ ] Al menos 1 dossier y 2 reading lists publicadas.

---

### ═══════════════════════════════════════
### FASE 4 — PIPELINE EDITORIAL (Dashboard)
### ═══════════════════════════════════════

**Duración estimada**: 3-5 sesiones (~18-30 horas)

**Objetivo**: Infraestructura interna para el flujo editorial.

#### Incluye:
- [ ] **Dashboard interno** (`/dashboard`) — Autenticación robusta (Auth.js o equivalente) + control de roles (`admin`, `editor`, `reviewer`)
- [ ] **Drafts** — Ver textos en borrador, su metadata, su estado
- [ ] **Review queue** — Cola de textos pendientes de revisión
- [ ] **Publishing queue** — Textos aprobados listos para publicar
- [ ] **Source library** — Materiales de referencia, links, excerpts, notas de investigación
- [ ] **Workflow de estados**: `draft → review → approved → published`
- [ ] **Agent workspace** — Panel para ver el output del agente editorial, comparar versiones
- [ ] **API interna** — Route handlers para CRUD de contenido (solo accesible desde dashboard)
- [ ] **Notificaciones simples** — Estado de contenido, alertas de review pendiente

**Diseño del dashboard:**
- Sobrio, funcional, monoespaciado
- No es un producto bonito para vender — es una herramienta de trabajo
- Tipografía mono, alto contraste, sin decoración
- Tablas y listas, no cards lujosas

#### Definition of Done (DoD + gates)
- [ ] Flujo completo de estado editorial funcional con auditoría de cambios.
- [ ] CRUD interno protegido por auth + roles + validación de origen.
- [ ] Gate de seguridad: ninguna ruta interna sensible accesible sin sesión válida.

---

### ═══════════════════════════════════════
### FASE 5 — AGENTE EDITORIAL (Autoría no-humana)
### ═══════════════════════════════════════

**Duración estimada**: 3-4 sesiones (~15-24 horas)

**Objetivo**: Implementar la dimensión más singular del proyecto: la editorialidad humano-no humana.

#### Incluye:
- [ ] **Agente redactor** — Un agente (basado en LLM con prompt engineered) capaz de:
  - Generar drafts de observatory notes a partir de fuentes curadas
  - Producir bibliografías comentadas
  - Escribir field notes sobre su propio proceso
  - Asistir traducciones con revisión editorial
- [ ] **Protocolo de transparencia** — Cada texto agéntico incluye:
  - Modelo usado
  - Fuentes consultadas
  - Protocolo de escritura
  - Nivel de intervención humana
- [ ] **Governance agéntica**:
  - Fuentes permitidas (primarias y secundarias declaradas).
  - Revisión humana obligatoria antes de publicar.
  - Prohibiciones explícitas: sin citas inventadas, sin fuentes opacas, sin publicación directa sin review.
- [ ] **Firma `habitat`** — La voz ambigua de casa, con sus propias notas editoriales
- [ ] **Texts híbridos** — Formato donde se visualiza la contribución humana y agéntica (side-by-side, annotations, o metadata)
- [ ] **Bitácoras agénticas** — El agente publica su propio diario de proceso en Lab
- [ ] **Integración con pipeline** — Los drafts agénticos entran al mismo workflow (draft → review → publish)

#### Definition of Done (DoD + gates)
- [ ] El agente genera al menos 1 note de observatory y 1 bibliografía comentada.
- [ ] 100% de piezas `agentic-text` y `hybrid-text` con `sources` + `human_review`.
- [ ] Gate editorial: cero publicaciones con trazabilidad incompleta.

---

### ═══════════════════════════════════════
### FASE 6 — LAB + EXPERIMENTOS
### ═══════════════════════════════════════

**Duración estimada**: 2-3 sesiones (~12-18 horas)

**Objetivo**: Activar el laboratorio como espacio de experimentación pública.

#### Incluye:
- [ ] **Lab** (`/lab`) — Sección con formato distinto: más crudo, más técnico, más bitácora
- [ ] **Experimentos publicados** — Cada experimento tiene: hipótesis, proceso, resultado, código/herramientas
- [ ] **Agentes documentados** — Perfiles de agentes con su metodología, sus capacidades, sus limitaciones
- [ ] **Talleres** — Estructura para documentar y compartir talleres (formato, materiales, resultados)
- [ ] **Metodologías** — Páginas que documentan workflows y protocolos de trabajo
- [ ] **Code snippets / repos** — Embeds de código, links a repositories
- [ ] Diseño visual del Lab: más lo-fi que el resto, más monoespaciado, más raw

#### Definition of Done (DoD + gates)
- [ ] Lab tiene al menos 2 experimentos documentados y 1 perfil de agente.
- [ ] Cada experimento declara hipótesis, método, resultados y límites.
- [ ] Gate de reproducibilidad: cada experimento tiene referencias técnicas verificables.

---

### ═══════════════════════════════════════
### FASE 7 — COMUNIDAD + EXPANSIÓN
### ═══════════════════════════════════════

**Duración estimada**: Variable, ongoing

**Objetivo**: Abrir el proyecto más allá del equipo fundador.

#### Incluye:
- [ ] **Community** (`/community`) — Espacio para convocatorias, talleres, colaboraciones
- [ ] **Convocatorias abiertas** — Call for papers/texts con formulario
- [ ] **Autores invitados** — Perfiles y piezas de colaboradores externos
- [ ] **Talleres abiertos** — Registro, materiales, documentación post-taller
- [ ] **Newsletter** — Integración con servicio de email (Resend, Buttondown, o similar)
- [ ] **Cross-posting** — Puentes con otros proyectos de eme (Sonic Field, Cosiámpira, El Diario)
- [ ] **Analytics** — Plausible o Umami (privacy-first, no Google Analytics)
- [ ] **Alianzas** — Infraestructura para contenido cruzado con otras publicaciones

#### Definition of Done (DoD + gates)
- [ ] Al menos 1 convocatoria publicada y 1 autor invitado con pieza publicada.
- [ ] Newsletter funcional con al menos 1 envío.
- [ ] Gate de gobernanza: colaboraciones nuevas cumplen reglas editoriales y de trazabilidad.

---

## 12. ESTRUCTURA DE ARCHIVOS DEL PROYECTO

```
habitat/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── journal/
│   │   │   ├── page.tsx                # Listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Article
│   │   ├── observatory/
│   │   │   └── page.tsx
│   │   ├── library/
│   │   │   └── page.tsx
│   │   ├── resources/
│   │   │   └── page.tsx
│   │   ├── lab/
│   │   │   └── page.tsx
│   │   ├── authors/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── latam/
│   │   │   └── page.tsx
│   │   ├── tags/
│   │   │   └── [tag]/
│   │   │       └── page.tsx
│   │   └── dashboard/                   # Fase 4
│   │       ├── page.tsx
│   │       ├── drafts/
│   │       ├── review/
│   │       └── sources/
│   ├── api/                             # Route handlers
│   │   └── feed/
│   │       └── route.ts                 # RSS
│   ├── not-found.tsx                    # fallback global
│   ├── error.tsx                        # fallback global
│   ├── globals.css
│   └── layout.tsx                       # Root layout
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   └── ThemeToggle.tsx
│   ├── content/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleLayout.tsx
│   │   ├── ActivityDigest.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── StatsPanel.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── ObservatoryFeed.tsx
│   │   └── ResourceTable.tsx
│   ├── ui/
│   │   ├── AxisBadge.tsx
│   │   ├── AuthorBadge.tsx
│   │   ├── BilingualToggle.tsx
│   │   ├── ViewModeToggle.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Callout.tsx
│   │   ├── TagCloud.tsx
│   │   └── SearchBar.tsx
│   └── mdx/
│       └── MDXComponents.tsx
├── content/
│   ├── en/
│   │   ├── essays/
│   │   ├── notes/
│   │   ├── observatory/
│   │   └── resources/
│   ├── es/
│   │   ├── ensayos/
│   │   ├── notas/
│   │   ├── observatorio/
│   │   └── recursos/
│   └── shared/
│       ├── authors/
│       ├── enlaces.ts
│       └── tags.json
├── lib/
│   ├── content.ts
│   ├── mdx.ts
│   ├── authors.ts
│   ├── seo.ts
│   ├── feed.ts
│   └── types.ts
├── messages/
│   ├── en.json
│   └── es.json
├── public/
│   ├── fonts/
│   ├── images/
│   └── og/
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── middleware.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 13. SEO Y RENDIMIENTO

### SEO
- Cada página tiene `<title>`, `<meta description>`, Open Graph tags, Twitter Cards
- JSON-LD para artículos (`Article` schema) y autores (`Person` schema)
- `robots.txt` y `sitemap.xml` generados automáticamente
- URL canónicas para contenido bilingüe (hreflang tags)
- RSS feed accesible desde `<head>`

### Rendimiento
- SSG para todo el contenido publicado
- ISR para actualizaciones sin rebuild completo
- Imágenes optimizadas con `next/image` y `sharp`
- Font loading optimizado con `next/font`
- Estrategia de render:
  - **Server Components por defecto** para páginas, layouts, listados y lectura de contenido.
  - **Client Components solo donde sea necesario** (`ThemeToggle`, `SearchBar`, filtros interactivos, view toggles).
  - Evitar hidratar tablas/listados completos cuando el filtrado pueda resolverse con payload mínimo.
- Core Web Vitals como target: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Performance budget por plantilla:
  - Home: JS inicial <= 180KB gzip
  - Listing (Journal/Resources): JS inicial <= 170KB gzip
  - Article: JS inicial <= 150KB gzip
- Presupuesto de imágenes above-the-fold por página: <= 250KB optimizado
- Bundle analysis periódico

---

## 14. RIESGOS A MITIGAR

| Riesgo | Impacto | Mitigación | Gate |
|--------|---------|------------|------|
| Abarcar demasiado sin centro | Alto | No avanzar de fase sin DoD y gates cumplidos | Review de fase obligatoria |
| Seguridad insuficiente en etapas tempranas | Crítico | Baseline de seguridad desde Fase 0 (sanitize + headers + CSP + validación de origen) | Checklist de hardening aprobado |
| Deriva editorial (tono genérico tech) | Alto | Manifiesto y 6 ejes como contrato editorial | Revisión editorial previa a publish |
| Diluir la línea en español | Alto | LatAm estructural con backlog propio en español | Mínimo de piezas ES por fase |
| Volver gimmick la presencia de agentes | Alto | Trazabilidad + revisión humana obligatoria | Sin `human_review` no se publica |
| Deuda técnica por sobre-feature temprana | Alto | MVP reducido y funciones avanzadas movidas a Fase 2+ | No se aprueban extras fuera de alcance |
| Sesgo o baja calidad de fuentes | Alto | Política de curaduría (`source`, `status`, `checked_at`) | Auditoría periódica de enlaces/fuentes |
| Experiencia mobile deficiente por densidad excesiva | Medio | Jerarquía responsive por sustracción con contexto preservado | QA manual mobile + teclado |
| Mezclar con otros proyectos sin fronteras | Medio | HABITAT.md mantiene URL/identidad editorial propia | Control de branding y voz por release |

---

## 15. VERIFICACIÓN

### 15.1 QA automatizado (obligatorio)
- `npm run build` exitoso sin errores.
- Validación de schema de frontmatter (tipos requeridos + `translation_key` + estados).
- Validación i18n: rutas EN/ES, `hreflang`, canónicos y fallback.
- Sanitización MDX efectiva y sin regresiones.
- Core Web Vitals dentro de objetivo por plantilla (home/listing/article).
- Lighthouse >= 90 en Performance, Accessibility y SEO en rutas críticas.
- RSS feed válido (`feed.xml`).
- HTML semántico válido.
- Responsive verificado en 375px, 768px, 1200px, 1440px.

### 15.2 QA manual (editorial + UX)
- Leer un ensayo completo en mobile y desktop: experiencia de lectura excelente.
- Verificar navegación por teclado completa (header, filtros, tablas, toggles).
- Verificar contraste/foco visible en light y dark mode.
- Cambiar idioma y verificar UI labels + contenido.
- Verificar claridad de badges de autoría/eje y metadata.
- Share link en social media y verificar OG preview.

### 15.3 QA por fase (gates)
- **Fase 0**: build + schema + baseline de seguridad activos.
- **Fase 1**: rutas MVP completas + contenido mínimo publicado + SEO base.
- **Fase 2**: observatory/latam/tags/search funcionando en EN/ES.
- **Fase 3**: library/resources con gobernanza de curaduría activa.
- **Fase 4**: dashboard y CRUD protegidos por auth + roles.
- **Fase 5**: piezas agénticas con trazabilidad completa y review humana.
- **Fase 6/7**: reproducibilidad en lab y gobernanza en colaboraciones externas.

### 15.4 Checklist contractual de publicación
- Ningún `agentic-text` o `hybrid-text` se publica sin `sources` y `human_review.reviewed=true`.
- Ninguna pieza pasa a `published` sin `status: approved` previo.
- Ningún recurso externo entra a Resources sin `source`, `curation_status` y `last_checked_at`.
- Ninguna publicación bilingüe sale sin validar `translation_key` y enlaces cruzados.

### El test final
Si alguien llega al sitio por primera vez:
1. ¿Entiende en 5 segundos que esto NO es un blog tech genérico?
2. ¿La estética le produce la sensación de estar ante algo serio, editorial, informado — no decorativo?
3. ¿Puede encontrar y leer un ensayo sin fricción, y la lectura se siente excelente?
4. ¿Puede cambiar de idioma, vista (Grid/List/Metadata), y tema (light/dark) sin perderse?
5. ¿Siente que hay densidad de información sin caos, y quiere explorar más?

Si las 5 respuestas son **sí**, el MVP está completo.

---

## 16. ORDEN DE EJECUCIÓN

```
FASE 0 → FASE 1 (MVP) → FASE 2 → FASE 3 → FASE 4 → FASE 5 → FASE 6 → FASE 7
   ↑                        ↑
   │                        │
   └── NO SALTAR ───────────┘
```

**Empieza por FASE 0. No saltes fases. El MVP (Fase 1) es el primer hito real.**

Cada fase debe pasar su Definition of Done (DoD) y sus gates de calidad/seguridad antes de avanzar a la siguiente.

El contenido es más importante que las features. Publica primero, optimiza después.

---

## 17. SUPUESTOS Y DEFAULTS EXPLÍCITOS

- Se conserva la identidad conceptual y estética original; se optimiza ejecución, no se corporativiza el proyecto.
- No habrá UGC abierto en MVP.
- Seguridad y calidad mínima entran desde Fase 0; no se postergan.
- Se prioriza publicar contenido excelente pronto sobre construir infraestructura compleja temprana.

---

> *El hábitat cibernético ya está aquí. La pregunta no es si habitarlo, sino cómo hacerlo con dignidad, lucidez y belleza.*

**— HABITAT.md**
