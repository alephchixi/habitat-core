import Link from "next/link";
import type { Metadata } from "next";
import launchesData from "@/content/shared/nest-launches.json";
import { getAllAuthors } from "@/lib/authors";
import { getAllContent } from "@/lib/content";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import styles from "./HomePage.module.css";

type Props = { params: Promise<{ locale: string }> };

type LocalizedText = {
  en: string;
  es: string;
};

type NestLaunch = {
  id: string;
  title: LocalizedText;
  creator: string;
  repository: string;
  date: string;
  summary: LocalizedText;
};

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
  const activityLabel = safeLocale === "es" ? "ACTIVIDAD" : "Activity";
  const fullIndexLabel = safeLocale === "es" ? "VER INDICE COMPLETO ->" : "View Full Index ->";
  const developmentsLabel = "Latest developments";
  const kernelLabel = "KERNEL";

  const essays = await getAllContent(safeLocale, "essay");
  const notes = await getAllContent(safeLocale, "note");
  const observatory = await getAllContent(safeLocale, "observatory");
  const authors = await getAllAuthors();

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
  const latestDevelopments = (launchesData as NestLaunch[]).filter((item) => item.id === "launch-chixi-skills-eme");

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
      <h1 className="srOnly">{safeLocale === "es" ? "Inicio" : "Home"}</h1>
      <section className={styles.activitySection}>
        <div className={styles.activityHeader}>
          <h2 className={`text-mono ${styles.activityTitle}`}>{activityLabel}</h2>
          <Link href={`/${safeLocale}/journal`} className={`link-subtle text-xs text-mono ${styles.activityLink}`}>
            {fullIndexLabel}
          </Link>
        </div>

        <ActivityFeed items={activityItems} locale={safeLocale} />
      </section>

      <section className={styles.developmentsSection}>
        <div className={styles.kernelHeader}>
          <h2 className={`text-mono ${styles.kernelTitle}`}>{developmentsLabel}</h2>
        </div>
        <div className={styles.developmentsList}>
          {latestDevelopments.map((item) => (
            <a
              key={item.id}
              href={item.repository}
              target="_blank"
              rel="noopener noreferrer"
              className={`row-hover ${styles.developmentItem}`}
            >
              <div>
                <p className={styles.developmentTitle}>{item.title[safeLocale]}</p>
                <p className={styles.developmentSummary}>{item.summary[safeLocale]}</p>
              </div>
              <div className={styles.developmentMeta}>
                <span>@{item.creator}</span>
                <time dateTime={item.date}>{item.date}</time>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.kernelHeader}>
          <h2 className={`text-mono ${styles.kernelTitle}`}>{kernelLabel}</h2>
        </div>
        <div className={styles.statsGrid}>
          {stats.map((item) => (
            <div key={item.label} className={styles.statCard}>
              <p className={`text-mono text-xs ${styles.statLabel}`}>{item.label}</p>
              <p className={`text-mono ${styles.statValue}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
