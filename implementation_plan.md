# HABITAT.md Implementation Plan (Recovery -> Fase 7)

> Documento operativo para recuperar integridad del proyecto y completar todas las fases definidas en `conjuro.md`.
> Este plan asume que hubo corrupcion parcial de archivos y mezcla de avances entre fases.

---

## 0) Pivot operativo 2026-04 (GitHub-first + OSS mirror)

Se adopta un modelo de operacion editorial sin dashboard online:

- Repo operativa privada: `/Users/navi/Documents/habitat`.
- Publicacion editorial por GitHub PR (branch -> review -> merge -> deploy).
- Dashboard/auth/API interna de escritura eliminados del runtime.

Arquitectura de repos resultante:

- `habitat-web` (privada): producto vivo + contenido real + drafts.
- `habitat-core` (publica): mirror open source en `/Users/navi/Documents/habitat-core`.

Regla de mirror para `habitat-core` (opcion 1 confirmada):

- Se conserva el codigo de la web y datos no sensibles.
- Se elimina contenido editorial real (`content/en/**/*.mdx`, `content/es/**/*.mdx`).
- Sin credenciales ni historial previo (repo nueva inicializada desde cero).

Plan de ejecucion (6 fases):

1. Remover dashboard/login/API de escritura en `habitat`.
2. Formalizar flujo editorial GitHub-first.
3. Actualizar docs, seguridad, scripts y endpoints (newsletter in-app deshabilitada).
4. Crear `habitat-core` limpio en `/Users/navi/Documents/habitat-core`.
5. Establecer modelo dual privado/publico en la org.
6. Auditoria completa en `habitat` (funcionalidad/seguridad/performance) y luego sync a `habitat-core`.

---

## 1) Estado actual y enfoque

### 1.1 Diagnostico base

El repositorio tiene avances reales en varias fases, pero con inconsistencias tecnicas que bloquean el cierre formal de gates:

- Inconsistencia de rutas de contenido ES (`observatory` vs `observatorio`) y escritura/lectura no alineadas.
- Seguridad incompleta en API interna (`/api/content`) por matcher de middleware.
- Frontmatter sin validacion runtime estricta (hay casts, no gate de schema).
- Tokens CSS rotos por corrupcion (`--op-primary`, `--space-3xl`, `--font-serif`, `--duration-normal`).
- SEO/RSS y rutas de error incompletas para el cierre MVP.

### 1.2 Fase actual operativa

**Fase actual recomendada:** `R0 (Recovery)` + `cierre formal Fase 0/Fase 1`.

Razon: avanzar a Fase 2+ sin cerrar integridad de base incrementa deuda y riesgo de regresiones.

### 1.3 Regla de avance

No se avanza a la siguiente fase sin cumplir **DoD + gates** de la fase actual.

---

## 2) Principios de ejecucion

1. **No saltar fases.**
2. **Seguridad y calidad desde la base.**
3. **Contenido y trazabilidad primero, feature hype despues.**
4. **Server-first architecture**, client solo donde se justifica.
5. **Cada merge con validacion automatica minima** (`lint`, `typecheck`, `build`, `content schema`).

---

## 3) Plan por ondas y fases

## ONDA R0 - RECOVERY E INTEGRIDAD (Pre-Fase 0 gate)

**Objetivo:** estabilizar el proyecto despues de corrupcion parcial.

### Tareas obligatorias (P0)

- [x] Unificar mapa de rutas EN/ES en una sola fuente (ej. `lib/content-paths.ts`).
- [x] Migrar y normalizar contenido ES para resolver `observatory` vs `observatorio`.
- [x] Alinear editor dashboard y API con el mismo mapper de rutas de contenido.
- [x] Endurecer API `/api/content`: validar `slug/type/locale`, bloquear path traversal, limites de payload.
- [x] Corregir matcher de middleware para proteger endpoints internos reales.
- [x] Eliminar fallback de credenciales por defecto y exigir secrets por entorno.
- [x] Corregir design tokens rotos y referencias invalidas en CSS/TSX.
- [x] Crear script de validacion de frontmatter y ejecutar limpieza de contenido invalido.

### DoD R0

- [x] Lectura/escritura de contenido consistente EN/ES.
- [x] API interna no expuesta sin auth esperada.
- [x] No hay frontmatter invalido en contenido publicado.
- [x] Build sin errores de rutas/tokens/casts peligrosos.

---

## FASE 0 - SCAFFOLDING (Cierre formal)

**Objetivo:** cerrar baseline tecnico, i18n, MDX y seguridad de base.

### Tareas

- [x] Implementar validacion estricta de frontmatter en build-time (rompe build si falla).
- [x] Tipar `ContentItem` con `slug` nativo (eliminar `unknown as`).
- [x] Verificar sanitizacion MDX + CSP + headers en preview y produccion.
- [x] Asegurar layout base: header/footer/theme/i18n consistentes.
- [x] QA responsive y focus-visible en rutas base.

### DoD Fase 0

- [x] `npm run dev` y `npm run build` pasan.
- [x] Frontmatter invalido rompe build.
- [x] Sanitizacion MDX y headers activos.
- [x] Layout base funcional en desktop/mobile.

---

## FASE 1 - MVP (Cierre real)

**Objetivo:** dejar el MVP publicable con gates completos.

### Tareas de cierre

- [x] Implementar `app/[locale]/not-found.tsx` y `app/[locale]/error.tsx`.
- [x] Implementar RSS real (`/feed.xml`) con `lib/feed.ts`.
- [x] Implementar SEO base centralizado (`lib/seo.ts`):
  - [x] OG/Twitter metadata.
  - [x] Canonical + hreflang EN/ES.
  - [x] JSON-LD para articulo/autor.
- [x] Completar Home editorial con digest/estadisticas consistentes.
- [x] Agregar links editoriales + RSS en footer.
- [x] Implementar bilingual toggle entre traducciones por `translation_key`.
- [x] Completar empty states y mensajes no tecnicos en rutas MVP.
- [x] Revisar accesibilidad minima (teclado, foco, contraste AA).

### DoD Fase 1

- [x] Home/About/Journal/Article/Authors/Resources en EN/ES sin regresiones.
- [x] Minimo 3 piezas nucleo validas por schema (manifesto EN+ES, 1 essay, 1 note).
- [x] RSS valido y SEO base correcto.
- [x] Rutas de error/empty listas.
- [ ] Deploy MVP estable.

---

## FASE 2 - OBSERVATORY + LATAM

**Objetivo:** activar capa breve y linea editorial situada en espanol.

### Tareas

- [x] Implementar `/latam` con contenido ES exclusivo.
- [x] Consolidar `/observatory` con entradas en EN y ES.
- [x] Mejorar busqueda client-side con ranking simple y filtros por eje/tipo/idioma.
- [x] Implementar ActivityFeed avanzado filtrable.
- [x] Implementar view modes (Grid/List/Metadata) en Journal y Resources.
- [x] Implementar paginacion controlada en listados.
- [x] Verificar TOC sticky robusto en ensayos largos.

### DoD Fase 2

- [x] Observatory activo (>=3 entradas).
- [x] LatAm activo (>=2 piezas).
- [x] Tags y busqueda correctos en EN/ES.
- [ ] Hallazgo de contenido en < 3 clics desde Home.

---

## FASE 3 - LIBRARY + RESOURCES EXPANDIDOS

**Objetivo:** construir archivo de referencia y gobernanza de curaduria.

### Tareas

- [x] Expandir `library.json` a >=20 entradas (book/paper/concept).
- [x] Filtros por tema/anio/region/tipo/eje.
- [x] Implementar `dossier` y `reading lists`.
- [x] Implementar interlink interno articulo <-> library.
- [x] Activar gobernanza de resources:
  - [x] Auditoria de enlaces rotos.
  - [x] Migrar estados `seed -> reviewed -> verified`.
  - [x] Actualizar `last_checked_at` por lote.

### DoD Fase 3

- [x] Library con >=20 entradas y filtros funcionales.
- [x] Resources con estados reviewed/verified activos.
- [x] 1 dossier + 2 reading lists publicadas.

---

## FASE 4 - PIPELINE EDITORIAL (Dashboard)

**Objetivo:** flujo interno seguro y trazable.

### Tareas

- [x] Migrar de basic auth a auth robusta (Auth.js o equivalente).
- [x] Implementar roles reales: `admin`, `editor`, `reviewer`.
- [x] Completar colas de workflow: draft/review/approved/published.
- [x] CRUD interno protegido (schema + origen + metodo + size limits).
- [x] Registrar auditoria de cambios (quien, cuando, que cambio).
- [x] Notificaciones basicas de pendientes.

### DoD Fase 4

- [x] Workflow editorial completo y estable.
- [x] Ninguna ruta sensible accesible sin sesion valida/rol.
- [x] Gate de seguridad aprobado para dashboard/API interna.

---

## FASE 5 - AGENTE EDITORIAL

**Objetivo:** autoria no-humana con transparencia y control humano.

### Tareas

- [x] Pipeline para drafts agenticos (observatory + bibliography).
- [x] Protocolo obligatorio por pieza agentica/hibrida:
  - [x] `model_info`
  - [x] `sources`
  - [x] `human_review`
  - [x] `authorship_note`
- [x] Bloquear publicacion sin review humana.
- [x] Integrar piezas hibridas con metadata clara de contribucion.

### DoD Fase 5

- [x] 1 observatory note agentica + 1 bibliografia comentada.
- [x] 100% de `agentic-text`/`hybrid-text` con trazabilidad completa.
- [x] Cero publish sin `human_review.reviewed=true`.

---

## FASE 6 - LAB + EXPERIMENTOS

**Objetivo:** abrir laboratorio reproducible.

### Tareas

- [x] Completar `/lab` con estructura publica de experimentos.
- [x] Publicar >=2 experimentos con hipotesis/metodo/resultado/limites.
- [x] Publicar >=1 perfil de agente documentado.
- [x] Integrar snippets/repos y referencias tecnicas verificables.

### DoD Fase 6

- [x] Experimentos reproducibles y documentados.
- [x] Perfiles de agentes con capacidades/limites transparentes.

---

## FASE 7 - COMUNIDAD + EXPANSION

**Objetivo:** abrir colaboracion externa con gobernanza editorial.

### Tareas

- [x] Implementar `/community`.
- [x] Publicar convocatoria abierta.
- [x] Integrar newsletter (Resend/Buttondown o equivalente).
- [x] Integrar analytics privacy-first (Plausible/Umami).
- [x] Implementar flujo para autores invitados y alianzas.

### DoD Fase 7

- [x] 1 convocatoria + 1 autor invitado publicado.
- [x] Newsletter operativa (>=1 envio).
- [x] Gobernanza de colaboraciones activa.

---

## 4) Mejoras transversales (optimizar/reforzar)

## 4.1 Calidad y DX

- [x] CI minima: `lint + typecheck + build + content-check`.
- [x] Script `content-check` (schema, translation pairs, tags/axes validos).
- [x] Reducir inline styles y mover a CSS Modules donde aporta mantenibilidad.
- [x] Eliminar casts `unknown as` y fortalecer tipos compartidos.

## 4.2 Seguridad

- [x] Validacion de entrada en todos los route handlers.
- [x] Politica de secretos por entorno (dev/preview/prod).
- [x] Revisiones periodicas de CSP y headers.

## 4.3 Performance + UX

- [x] Medir budgets por plantilla (home/listing/article).
- [x] QA mobile (375/768/1200/1440).
- [x] Auditoria de accesibilidad en flujos clave.

## 4.4 Editorial y gobernanza

- [x] No publicar agentic/hybrid sin trazabilidad completa.
- [x] No ingresar resources sin `source`, `curation_status`, `last_checked_at`.
- [ ] Mantener paridad bilingue en piezas clave por `translation_key`.

---

## 5) Plan de auditoria final detallada (post Fase 7)

## 5.1 Auditoria tecnica

- [ ] Arquitectura, deuda tecnica, consistencia de rutas y tipado.
- [ ] Cobertura de tests y salud de CI.

## 5.2 Auditoria de seguridad

- [ ] Superficie dashboard/API.
- [ ] AuthZ/AuthN por rol.
- [ ] Sanitizacion, CSP, headers, secretos.

## 5.3 Auditoria editorial

- [ ] Trazabilidad de autoria (human/agent/habitat).
- [ ] Integridad de `translation_key`.
- [ ] Calidad y estado de fuentes/resources.

## 5.4 Auditoria UX + accesibilidad + performance

- [x] Navegacion por teclado.
- [x] Contraste AA.
- [x] Lighthouse >=90 en rutas criticas.
- [x] Core Web Vitals dentro de objetivos.


### Criterio de cierre global

- [ ] Todas las fases con DoD cumplido.
- [ ] Sin hallazgos criticos abiertos en auditoria final.
- [ ] Release candidate estable y documentado.

---

## 6) Orden de ejecucion recomendado

`R0 -> Fase 0 -> Fase 1 -> Fase 2 -> Fase 3 -> Fase 4 -> Fase 5 -> Fase 6 -> Fase 7 -> Auditoria final`

---

## 7) Primer sprint sugerido (inmediato)

### Sprint R0.1 (alta prioridad)

- [x] Corregir rutas EN/ES y carpeta observatory/observatorio.
- [x] Endurecer middleware/API para proteger `/api/content`.
- [x] Corregir tokens CSS rotos.
- [x] Implementar `content-check` y limpiar frontmatter invalido.

### Exit criteria Sprint R0.1

- [x] Build estable.
- [x] API interna no expuesta.
- [x] Contenido legible y escribible sin inconsistencias de ruta.
