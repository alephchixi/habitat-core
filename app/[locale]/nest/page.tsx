import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import styles from "./NestPage.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; creator?: string }>;
};

type NestType = "soul" | "skill" | "memory" | "instruction" | "misc";

type LocalizedText = {
  en: string;
  es: string;
};

type NestRepository = {
  id: string;
  type: NestType;
  name: string;
  creator: string;
  repository: string;
  description: LocalizedText;
  updated_at: string;
};

type NestLaunch = {
  id: string;
  type: "soul" | "skill";
  title: LocalizedText;
  creator: string;
  repository: string;
  date: string;
  summary: LocalizedText;
};

const REPOSITORIES_PATH = path.join(process.cwd(), "content", "shared", "nest-repositories.json");
const LAUNCHES_PATH = path.join(process.cwd(), "content", "shared", "nest-launches.json");
const VALID_TYPES = new Set<NestType>(["soul", "skill", "memory", "instruction", "misc"]);

const NEST_META = {
  en: {
    title: "Nest",
    description: "Repositories for souls, skills, and memory systems.",
  },
  es: {
    title: "Nido",
    description: "Repositorios de souls, skills y sistemas de memoria.",
  },
} as const;

function readJsonFile<T>(filePath: string): T[] {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function getCopy(locale: Locale) {
  if (locale === "es") {
    return {
      label: "(NIDO)",
      title: "Nido: repositorios vivos",
      subtitle:
        "Tabla curada de repositorios de souls, skills y memory; con lanzamientos recientes de creaciones propias.",
      launches: "Lanzamientos recientes",
      repositories: "Tabla de repositorios",
      filters: "Filtro",
      allTypes: "todos",
      allCreators: "todas",
      creator: "creadorx",
      tableHeaders: {
        repository: "repositorio",
        type: "tipo",
        creator: "creadorx",
        description: "descripcion",
        updated: "actualizado",
      },
      empty: "Sin repositorios para este filtro.",
      openRepo: "Abrir repo",
    };
  }

  return {
    label: "(NEST)",
    title: "Nest: live repositories",
    subtitle:
      "Curated table of soul, skill, and memory repositories plus recent launches from our own production stream.",
    launches: "Recent launches",
    repositories: "Repository table",
    filters: "FILTER",
    allTypes: "all",
    allCreators: "all",
    creator: "creator",
    tableHeaders: {
      repository: "repository",
      type: "type",
      creator: "creator",
      description: "description",
      updated: "updated",
    },
    empty: "No repositories for this filter.",
    openRepo: "Open repo",
  };
}

function buildHref(locale: Locale, activeType: string, activeCreator: string): string {
  const params = new URLSearchParams();
  if (activeType !== "all") params.set("type", activeType);
  if (activeCreator !== "all") params.set("creator", activeCreator);
  const query = params.toString();
  return query ? `/${locale}/nest?${query}` : `/${locale}/nest`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = NEST_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en/nest",
      es: "/es/nest",
    },
  });
}

export default async function NestPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = getCopy(safeLocale);
  const query = await searchParams;

  const repositories = readJsonFile<NestRepository>(REPOSITORIES_PATH).sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at)
  );
  const launches = readJsonFile<NestLaunch>(LAUNCHES_PATH)
    .filter((item) => item.creator === "eme" || item.creator === "habitat")
    .sort((a, b) => b.date.localeCompare(a.date));

  const creators = Array.from(new Set(repositories.map((item) => item.creator))).sort();

  const activeType = VALID_TYPES.has(query.type as NestType) ? (query.type as NestType) : "all";
  const activeCreator = query.creator && creators.includes(query.creator) ? query.creator : "all";

  const filtered = repositories.filter((item) => {
    if (activeType !== "all" && item.type !== activeType) return false;
    if (activeCreator !== "all" && item.creator !== activeCreator) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <p className="page-label">{copy.label}</p>
      <p className={styles.subtitle}>{copy.subtitle}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.launches}</h2>
        <div className={styles.launchGrid}>
          {launches.map((launch) => (
            <article key={launch.id} className={styles.launchCard}>
              <div className={styles.launchMeta}>
                <span className={styles.launchType}>{launch.type}</span>
                <span>@{launch.creator}</span>
                <time dateTime={launch.date}>{launch.date}</time>
              </div>
              <h3 className={styles.launchTitle}>{launch.title[safeLocale]}</h3>
              <p className={styles.launchSummary}>{launch.summary[safeLocale]}</p>
              <a href={launch.repository} target="_blank" rel="noopener noreferrer" className="link-subtle text-mono text-xs">
                {copy.openRepo}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className="text-mono text-xs" style={{ opacity: "var(--op-label)" }}>
              {copy.filters}
            </span>
            <Link
              href={buildHref(safeLocale, "all", activeCreator)}
              className={`${styles.pill} ${activeType === "all" ? styles.pillActive : ""}`}
            >
              {copy.allTypes}
            </Link>
            {(["soul", "skill", "memory", "instruction", "misc"] as NestType[]).map((type) => (
              <Link
                key={type}
                href={buildHref(safeLocale, type, activeCreator)}
                className={`${styles.pill} ${activeType === type ? styles.pillActive : ""}`}
              >
                {type}
              </Link>
            ))}
          </div>

          <div className={styles.controlGroup}>
            <span className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
              {copy.creator}:
            </span>
            <form method="get" action={`/${safeLocale}/nest`} className={styles.creatorForm}>
              {activeType !== "all" ? <input type="hidden" name="type" value={activeType} /> : null}
              <select
                name="creator"
                defaultValue={activeCreator === "all" ? "" : activeCreator}
                className={styles.creatorSelect}
                aria-label={copy.creator}
              >
                <option value="">{copy.allCreators}</option>
                {creators.map((creator) => (
                  <option key={creator} value={creator}>
                    @{creator}
                  </option>
                ))}
              </select>
              <button type="submit" className={styles.pill}>
                {safeLocale === "es" ? "aplicar" : "apply"}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.table}>
          <div className={styles.header}>
            <span>{copy.tableHeaders.repository}</span>
            <span>{copy.tableHeaders.type}</span>
            <span>{copy.tableHeaders.creator}</span>
            <span>{copy.tableHeaders.description}</span>
            <span>{copy.tableHeaders.updated}</span>
          </div>

          {filtered.map((item) => (
            <a
              key={item.id}
              href={item.repository}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.row} row-hover`}
            >
              <span className={styles.repoTitle}>{item.name}</span>
              <span>{item.type}</span>
              <span>@{item.creator}</span>
              <span>{item.description[safeLocale]}</span>
              <time dateTime={item.updated_at}>{item.updated_at}</time>
            </a>
          ))}
        </div>

        {filtered.length === 0 ? <p className={styles.empty}>{copy.empty}</p> : null}
      </section>
    </div>
  );
}
