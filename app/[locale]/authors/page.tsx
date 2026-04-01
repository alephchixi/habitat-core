import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAllAuthors } from "@/lib/authors";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import styles from "../journal/JournalList.module.css"; 

type Props = { params: Promise<{ locale: string }> };

const AUTHORS_META = {
  en: {
    title: "Authors",
    description: "Contributors and editorial voices across human and agentic modes.",
  },
  es: {
    title: "Autores",
    description: "Colaboradores y voces editoriales en modos humanos y agenticos.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = AUTHORS_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en/authors",
      es: "/es/authors",
    },
  });
}

export default async function AuthorsPage({ params }: Props) {
  const t = await getTranslations("authors");
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  
  const authors = await getAllAuthors();

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
        ({t("title")})
      </p>

      <div className={styles.list} style={{ marginTop: "var(--space-2xl)" }}>
        {authors.map((author) => (
          <Link 
            key={author.slug} 
            href={`/${locale}/authors/${author.slug}`} 
            className={`${styles.item} row-hover`}
          >
            <div className={styles.itemHeader}>
              <h2 className={styles.title}>{author.name}</h2>
              <div className={styles.metadata}>
                <span className={styles.tag}>{author.authorship_mode.toUpperCase()}</span>
                <span>@{author.slug}</span>
              </div>
            </div>
            {author.bio[safeLocale] && (
              <p className={styles.description}>
                {author.bio[safeLocale]}
              </p>
            )}
          </Link>
        ))}
        {authors.length === 0 && (
          <p className="text-mono" style={{ opacity: "var(--op-secondary)" }}>
            No entities connected.
          </p>
        )}
      </div>
    </div>
  );
}
