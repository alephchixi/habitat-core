import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { LibraryClient } from "@/components/ui/LibraryClient";
import { getLibraryItems } from "@/lib/library";
import { createPageMetadata } from "@/lib/seo";
import type { LibraryItem, Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    type?: string;
    axis?: string;
    year?: string;
    region?: string;
    theme?: string;
    bundle?: string;
    view?: string;
  }>;
};

type CurationBundle = {
  id: string;
  author?: string;
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  theme: string;
  item_ids: string[];
  status?: string;
};

const READING_LISTS_PATH = path.join(process.cwd(), "content", "shared", "reading-lists.json");
const DOSSIERS_PATH = path.join(process.cwd(), "content", "shared", "dossiers.json");

function readBundles(filePath: string): CurationBundle[] {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as CurationBundle[];
  } catch {
    return [];
  }
}

const LIBRARY_META = {
  en: {
    title: "Library",
    description: "Bibliography, concepts, and references linked to the six editorial axes.",
  },
  es: {
    title: "Biblioteca",
    description: "Bibliografia, conceptos y referencias vinculadas a los seis ejes editoriales.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = LIBRARY_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en/library",
      es: "/es/library",
    },
  });
}

export default async function LibraryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const query = await searchParams;

  const readingLists = readBundles(READING_LISTS_PATH);
  const dossiers = readBundles(DOSSIERS_PATH);
  const bundles = [...dossiers, ...readingLists];
  const activeBundle = query.bundle ? bundles.find((bundle) => bundle.id === query.bundle) : undefined;
  const activeBundleItemIds = activeBundle?.item_ids || [];

  const libraryData: LibraryItem[] = getLibraryItems();
  const byLabel = safeLocale === "es" ? "Creada por" : "Created by";

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <p className="page-label" style={{ marginBottom: "var(--space-xl)" }}>
        {safeLocale === "es" ? "(BIBLIOTECA)" : "(THE_LIBRARY)"}
      </p>

      {(dossiers.length > 0 || readingLists.length > 0) && (
        <section style={{ marginBottom: "var(--space-2xl)", display: "grid", gap: "1px", background: "var(--border)" }}>
          {dossiers.map((dossier) => (
            <article key={dossier.id} style={{ background: "var(--bg)", padding: "var(--space-md)" }}>
              <p className="text-mono text-xs" style={{ opacity: "var(--op-label)", marginBottom: "var(--space-xs)" }}>
                DOSSIER
              </p>
              <h2 style={{ fontSize: "1.05rem", marginBottom: "var(--space-xs)", fontFamily: "var(--font-body)" }}>
                {dossier.title[safeLocale]}
              </h2>
              {dossier.author ? (
                <p className="text-mono text-xs" style={{ opacity: "var(--op-label)", marginBottom: "var(--space-xs)" }}>
                  {byLabel} {dossier.author}
                </p>
              ) : null}
              <p style={{ opacity: "var(--op-secondary)", marginBottom: "var(--space-sm)" }}>{dossier.description[safeLocale]}</p>
              <Link
                href={`/${safeLocale}/library?bundle=${encodeURIComponent(dossier.id)}`}
                className="text-mono text-xs"
                style={{ border: "1px solid var(--border)", padding: "var(--space-xs) var(--space-sm)" }}
              >
                {safeLocale === "es" ? "Abrir dossier" : "Open dossier"}
              </Link>
            </article>
          ))}

          {readingLists.map((list) => (
            <article key={list.id} style={{ background: "var(--bg)", padding: "var(--space-md)" }}>
              <p className="text-mono text-xs" style={{ opacity: "var(--op-label)", marginBottom: "var(--space-xs)" }}>
                READING LIST
              </p>
              <h2 style={{ fontSize: "1.05rem", marginBottom: "var(--space-xs)", fontFamily: "var(--font-body)" }}>
                {list.title[safeLocale]}
              </h2>
              {list.author ? (
                <p className="text-mono text-xs" style={{ opacity: "var(--op-label)", marginBottom: "var(--space-xs)" }}>
                  {byLabel} {list.author}
                </p>
              ) : null}
              <p style={{ opacity: "var(--op-secondary)", marginBottom: "var(--space-sm)" }}>{list.description[safeLocale]}</p>
              <Link
                href={`/${safeLocale}/library?bundle=${encodeURIComponent(list.id)}`}
                className="text-mono text-xs"
                style={{ border: "1px solid var(--border)", padding: "var(--space-xs) var(--space-sm)" }}
              >
                {safeLocale === "es" ? "Ver lista" : "View list"}
              </Link>
            </article>
          ))}
        </section>
      )}

      <LibraryClient
        key={[
          query.q || "",
          query.type || "",
          query.axis || "",
          query.year || "",
          query.region || "",
          query.theme || "",
          query.bundle || "",
          query.view || "",
        ].join("|")}
        initialData={libraryData}
        locale={safeLocale}
        initialFilters={{
          query: query.q,
          type: query.type,
          axis: query.axis,
          year: query.year,
          region: query.region,
          theme: query.theme,
          bundle: query.bundle,
          view: query.view,
        }}
        bundleItemIds={activeBundleItemIds}
      />
    </div>
  );
}
