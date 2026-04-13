import type { Metadata } from "next";
import Link from "next/link";
import launchesData from "@/content/shared/nest-launches.json";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import styles from "./LabPage.module.css";

type Props = {
  params: Promise<{ locale: string }>;
};

type LocalizedText = {
  en: string;
  es: string;
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

type PresenceLogEntry = {
  date: string;
  title: LocalizedText;
  body: LocalizedText;
};

const INTRO_EN =
  "The Lab is the place for the in-house processes, experiments and developments, including our own artificial presences, their souls, skills and connections.";

const INTRO_ES =
  "El Lab es el espacio para los procesos, experimentos y desarrollos internos, incluyendo nuestras presencias artificiales, sus souls, skills y conexiones.";

const PRESENCE_LOG: PresenceLogEntry[] = [
  {
    date: "2026-04-08",
    title: {
      en: "Mar: tone and continuity calibration",
      es: "Mar: calibracion de tono y continuidad",
    },
    body: {
      en: "Human reviewers aligned Mar's journaling voice with the latest editorial cadence and documented recurring style patterns for future prompts.",
      es: "Revisorxs humanxs alinearon la voz de diario de Mar con la cadencia editorial mas reciente y documentaron patrones de estilo para futuros prompts.",
    },
  },
  {
    date: "2026-04-06",
    title: {
      en: "Hermes: presence handshake updates",
      es: "Hermes: actualizacion del handshake de presencia",
    },
    body: {
      en: "Human operators updated Hermes interaction protocols to reduce response drift and improve cross-presence coordination with Mar.",
      es: "Operadorxs humanxs actualizaron los protocolos de interaccion de Hermes para reducir deriva de respuesta y mejorar la coordinacion con Mar.",
    },
  },
];

const LAB_META = {
  en: {
    title: "Lab",
    description: "In-house process logs for presences, souls, and skill development.",
  },
  es: {
    title: "Lab",
    description: "Bitacora de procesos internos para presencias, souls y desarrollo de skills.",
  },
} as const;

function getCopy(locale: Locale) {
  if (locale === "es") {
    return {
      label: "(LAB)",
      title: "Lab: procesos en curso",
      presenceTitle: "Presence development",
      skillTitle: "Skill development",
      skillSubtitle: "Releases de packs de skills.",
      viewRepo: "Abrir repo",
      openNest: "Ir a Nest",
    };
  }

  return {
    label: "(LAB)",
    title: "Lab: in-house processes",
    presenceTitle: "Presence development",
    skillTitle: "Skill development",
    skillSubtitle: "Skill pack releases.",
    viewRepo: "Open repo",
    openNest: "Open Nest",
  };
}

function formatDate(raw: string, locale: Locale): string {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function buildPresenceLog(entries: PresenceLogEntry[], locale: Locale): string {
  return entries
    .map((entry) => `[${formatDate(entry.date, locale)}]\n${entry.title[locale]}\n${entry.body[locale]}`)
    .join("\n\n");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = LAB_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en/lab",
      es: "/es/lab",
    },
  });
}

export default async function LabPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = getCopy(safeLocale);
  const releases = (launchesData as NestLaunch[]).filter((item) => item.id === "launch-chixi-skills-eme");

  return (
    <div className={styles.page}>
      <p className="page-label">{copy.label}</p>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.body}>{safeLocale === "es" ? INTRO_ES : INTRO_EN}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.presenceTitle}</h2>
        <pre className={styles.terminalLog}>
          <code>{buildPresenceLog(PRESENCE_LOG, safeLocale)}</code>
        </pre>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.skillTitle}</h2>
        <p className={styles.body}>{copy.skillSubtitle}</p>
        <div className={styles.stack}>
          {releases.map((release) => (
            <article key={release.id} className={styles.row}>
              <div className={styles.rowMeta}>
                <span>{release.type}</span>
                <span>@{release.creator}</span>
                <time dateTime={release.date}>{formatDate(release.date, safeLocale)}</time>
              </div>
              <h3 className={styles.rowTitle}>{release.title[safeLocale]}</h3>
              <p className={styles.body}>{release.summary[safeLocale]}</p>
              <div className={styles.inlineLinks}>
                <a href={release.repository} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {copy.viewRepo}
                </a>
                <Link href={`/${safeLocale}/nest`} className={styles.link}>
                  {copy.openNest}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
