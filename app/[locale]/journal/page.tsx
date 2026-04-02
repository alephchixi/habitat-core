import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllContent } from "@/lib/content";
import { ClientSearch } from "@/components/ui/ClientSearch";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
};

const JOURNAL_META = {
  en: {
    title: "Journal",
    description: "Index of essays, notes, and observatory entries.",
  },
  es: {
    title: "Journal",
    description: "Indice de ensayos, notas y entradas de observatorio.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = JOURNAL_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en/journal",
      es: "/es/journal",
    },
  });
}

export default async function JournalPage({ params, searchParams }: Props) {
  const t = await getTranslations("journal");
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const query = await searchParams;

  const essays = await getAllContent(safeLocale, "essay");
  const notes = await getAllContent(safeLocale, "note");
  const observatory = await getAllContent(safeLocale, "observatory");

  // Typecasting until slug is fully populated on the return signature of types.ts
  const contents = [...essays, ...notes, ...observatory].sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
        ({t("title")})
      </p>

      <ClientSearch initialData={contents} locale={safeLocale} initialType={query.type} />
    </div>
  );
}
