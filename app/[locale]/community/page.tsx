import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { CommunityIntakeForm } from "@/components/ui/CommunityIntakeForm";
import { isLocalNetworkRequestFromHeaders } from "@/lib/network-access";
import styles from "./CommunityPage.module.css";

type Props = {
  params: Promise<{ locale: string }>;
};

type LocalizedText = {
  en: string;
  es: string;
};

type CommunityReference = {
  label: string;
  url: string;
};

type CommunityProgram = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  deadline: string;
  status: "open" | "closed";
  submission_email: string;
  references: CommunityReference[];
};

type CommunityPathway = {
  id: "guest-author" | "alliance";
  title: LocalizedText;
  description: LocalizedText;
  requirements: LocalizedText[];
  stages: LocalizedText[];
  contact_email: string;
};

const PROGRAMS_PATH = path.join(process.cwd(), "content", "shared", "community-programs.json");
const PATHWAYS_PATH = path.join(process.cwd(), "content", "shared", "community-pathways.json");

const COMMUNITY_META = {
  en: {
    title: "Community",
    description: "Open calls, workshops, and contributor pathways for HABITAT.md.",
  },
  es: {
    title: "Comunidad",
    description: "Convocatorias, talleres y rutas de colaboracion para HABITAT.md.",
  },
} as const;

function readPrograms(): CommunityProgram[] {
  try {
    const raw = fs.readFileSync(PROGRAMS_PATH, "utf8");
    return JSON.parse(raw) as CommunityProgram[];
  } catch {
    return [];
  }
}

function readPathways(): CommunityPathway[] {
  try {
    const raw = fs.readFileSync(PATHWAYS_PATH, "utf8");
    return JSON.parse(raw) as CommunityPathway[];
  } catch {
    return [];
  }
}

function copy(locale: Locale) {
  if (locale === "es") {
    return {
      label: "(COMMUNITY)",
      title: "Comunidad editorial",
      subtitle: "Convocatorias, newsletter y colaboraciones para expandir HABITAT.md.",
      openCall: "Convocatoria",
      deadline: "Cierre",
      send: "Enviar",
      open: "abierta",
      closed: "cerrada",
      references: "Referencias",
      pathwaysTitle: "Flujos activos",
      requirements: "Requisitos",
      stages: "Etapas",
      contact: "Contacto",
      intakeTitle: "Intake de colaboraciones",
      newsletterTitle: "Newsletter",
      newsletterDescription:
        "Newsletter deshabilitada temporalmente. La publicacion se movera a Substack.",
      privacy: "No usamos trackers de marketing; solo analitica agregada privacy-first.",
      noPrograms: "No hay convocatorias activas por ahora.",
    };
  }

  return {
    label: "(COMMUNITY)",
    title: "Editorial community",
    subtitle: "Open calls, newsletter, and collaboration pathways for expanding HABITAT.md.",
    openCall: "Open call",
    deadline: "Deadline",
    send: "Send",
    open: "open",
    closed: "closed",
    references: "References",
    pathwaysTitle: "Active pathways",
    requirements: "Requirements",
    stages: "Stages",
    contact: "Contact",
    intakeTitle: "Collaboration intake",
    newsletterTitle: "Newsletter",
    newsletterDescription:
      "Newsletter is temporarily disabled. Publishing will move to Substack.",
    privacy: "No marketing trackers; only aggregate privacy-first analytics.",
    noPrograms: "No active open calls yet.",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const c = COMMUNITY_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: c.title,
    description: c.description,
    paths: {
      en: "/en/community",
      es: "/es/community",
    },
  });
}

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const requestHeaders = await headers();

  if (!isLocalNetworkRequestFromHeaders(requestHeaders)) {
    notFound();
  }

  const c = copy(safeLocale);
  const programs = readPrograms();
  const pathways = readPathways();

  return (
    <div className={styles.page}>
      <p className="page-label">{c.label}</p>
      <h1 className={styles.title}>{c.title}</h1>
      <p className={styles.subtitle}>{c.subtitle}</p>
      <div className="hr-line hr-line-top" />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{c.openCall}</h2>
        {programs.length === 0 ? (
          <p className={styles.secondary}>{c.noPrograms}</p>
        ) : (
          <div className={styles.stack}>
            {programs.map((program) => (
              <article key={program.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{program.title[safeLocale]}</h3>
                  <span className={styles.badge}>{program.status === "open" ? c.open : c.closed}</span>
                </div>
                <p className={styles.secondary}>{program.description[safeLocale]}</p>
                <p className={styles.meta}>
                  {c.deadline}: {program.deadline}
                </p>
                <a href={`mailto:${program.submission_email}`} className={styles.inlineLink}>
                  {c.send}: {program.submission_email}
                </a>
                <p className={styles.meta}>{c.references}</p>
                <ul className={styles.list}>
                  {program.references.map((reference) => (
                    <li key={`${program.id}-${reference.url}`}>
                      <a href={reference.url} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
                        {reference.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{c.pathwaysTitle}</h2>
        <div className={styles.stack}>
          {pathways.map((pathway) => (
            <article key={pathway.id} className={styles.card}>
              <h3>{pathway.title[safeLocale]}</h3>
              <p className={styles.secondary}>{pathway.description[safeLocale]}</p>

              <p className={styles.meta}>{c.requirements}</p>
              <ul className={styles.list}>
                {pathway.requirements.map((requirement) => (
                  <li key={`${pathway.id}-${requirement[safeLocale]}`}>{requirement[safeLocale]}</li>
                ))}
              </ul>

              <p className={styles.meta}>{c.stages}</p>
              <ol className={styles.listOrdered}>
                {pathway.stages.map((stage) => (
                  <li key={`${pathway.id}-${stage[safeLocale]}`}>{stage[safeLocale]}</li>
                ))}
              </ol>

              <p className={styles.meta}>
                {c.contact}: <a href={`mailto:${pathway.contact_email}`} className={styles.inlineLink}>{pathway.contact_email}</a>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{c.intakeTitle}</h2>
        <CommunityIntakeForm locale={safeLocale} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{c.newsletterTitle}</h2>
        <p className={styles.secondary}>{c.newsletterDescription}</p>

        <p className={styles.meta}>{c.privacy}</p>
      </section>
    </div>
  );
}
