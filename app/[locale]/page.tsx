import Link from "next/link";
import type { Metadata } from "next";
import { getAllAuthors } from "@/lib/authors";
import { getAllContent } from "@/lib/content";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import styles from "./HomePage.module.css";

type Props = { params: Promise<{ locale: string }> };

const HOME_META = {
  en: {
    title: "Home",
    description:
      "A journal-lab-observatory of the contemporary cybernetic habitat from ethical, ecological, spiritual, cosmotechnical, and decolonial perspectives.",
  },
  es: {
    title: "Inicio",
    description:
      "Una revista-laboratorio-observatorio del habitat cibernetico contemporaneo desde perspectivas eticas, ecologicas, espirituales, cosmotecnicas y decoloniales.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = HOME_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en",
      es: "/es",
    },
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";

  // Fetch everything to create Activity Digest
  const essays = await getAllContent(safeLocale, "essay");
  const notes = await getAllContent(safeLocale, "note");
  const observatory = await getAllContent(safeLocale, "observatory");
  const authors = await getAllAuthors();

  const digest = [...essays, ...notes, ...observatory]
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
    .slice(0, 5);

  const activityItems = [...essays, ...notes, ...observatory]
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
    .slice(0, 30)
    .map((item) => ({
      slug: item.slug,
      title: item.frontmatter.title,
      type: item.frontmatter.type,
      author: item.frontmatter.author || item.frontmatter.authors?.[0] || "habitat",
      date: item.frontmatter.date,
    }));

  const stats = [
    {
      label: safeLocale === "es" ? "Articulos" : "Articles",
      value: String(essays.length + notes.length + observatory.length),
    },
    { label: safeLocale === "es" ? "Autores" : "Authors", value: String(authors.length) },
    { label: safeLocale === "es" ? "Ejes" : "Axes", value: "6" },
    { label: safeLocale === "es" ? "Idiomas" : "Languages", value: "2" },
  ];

  return (
    <div className={`${styles.root} home`}>
      <section className={styles.activitySection}>
        <div className={styles.activityHeader}>
          <h2 className={`text-mono ${styles.activityTitle}`}>
            Activity
          </h2>
          <Link href={`/${safeLocale}/journal`} className={`link-subtle text-xs text-mono ${styles.activityLink}`}>
            View Full Index →
          </Link>
        </div>

        <ActivityFeed items={activityItems} locale={safeLocale} />

        <div className={styles.digestList}>
          {digest.map((item) => (
            <Link 
              key={item.slug} 
              href={`/${safeLocale}/journal/${item.slug}`} 
              className={`row-hover ${styles.digestItem}`}
            >
              <span className={styles.digestTitle}>
                {item.frontmatter.title}
              </span>
              <div className={styles.digestMeta}>
                <span className={styles.digestType}>
                  {item.frontmatter.type || "global"}
                </span>
                <time dateTime={item.frontmatter.date}>
                  {new Date(item.frontmatter.date).toLocaleDateString(safeLocale === "es" ? "es-CO" : "en-US", {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </time>
              </div>
            </Link>
          ))}
          {digest.length === 0 && (
            <p className={`text-mono ${styles.digestEmpty}`}>Awaiting first transceive...</p>
          )}
        </div>
      </section>

      <section className={styles.statsGrid}>
        {stats.map((item) => (
          <div key={item.label} className={styles.statCard}>
            <p className={`text-mono text-xs ${styles.statLabel}`}>
              {item.label}
            </p>
            <p className={`text-mono ${styles.statValue}`}>
              {item.value}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
