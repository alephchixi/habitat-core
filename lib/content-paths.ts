import path from "path";
import type { ContentType, Locale } from "./types";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

const DIR_BY_TYPE: Record<Locale, Record<ContentType, string>> = {
  en: {
    essay: "essays",
    note: "notes",
    column: "columns",
    interview: "interviews",
    manifesto: "essays",
    review: "reviews",
    dossier: "dossiers",
    bibliography: "bibliographies",
    "resource-map": "resources",
    tutorial: "tutorials",
    observatory: "observatory",
    "field-note": "field-notes",
    experiment: "experiments",
    "agentic-text": "agentic-texts",
    "hybrid-text": "hybrid-texts",
  },
  es: {
    essay: "ensayos",
    note: "notas",
    column: "columnas",
    interview: "entrevistas",
    manifesto: "ensayos",
    review: "resenas",
    dossier: "dossiers",
    bibliography: "bibliografias",
    "resource-map": "recursos",
    tutorial: "tutoriales",
    observatory: "observatorio",
    "field-note": "notas-de-campo",
    experiment: "experimentos",
    "agentic-text": "textos-agenticos",
    "hybrid-text": "textos-hibridos",
  },
};

const WRITABLE_TYPES: Set<ContentType> = new Set([
  "essay",
  "note",
  "column",
  "interview",
  "manifesto",
  "review",
  "dossier",
  "bibliography",
  "resource-map",
  "tutorial",
  "observatory",
  "field-note",
  "experiment",
  "agentic-text",
  "hybrid-text",
]);

export function isSupportedLocale(value: string): value is Locale {
  return value === "en" || value === "es";
}

export function isWritableContentType(value: string): value is ContentType {
  return WRITABLE_TYPES.has(value as ContentType);
}

export function getContentDir(locale: Locale, type: ContentType): string {
  return path.join(CONTENT_ROOT, locale, DIR_BY_TYPE[locale][type]);
}

export function getContentDirs(locale: Locale, type: ContentType): string[] {
  const canonical = getContentDir(locale, type);

  if (locale === "es" && type === "observatory") {
    const legacy = path.join(CONTENT_ROOT, "es", "observatory");
    return [canonical, legacy];
  }

  return [canonical];
}

export function buildContentFilePath(locale: Locale, type: ContentType, slug: string): string {
  return path.join(getContentDir(locale, type), `${slug}.mdx`);
}
