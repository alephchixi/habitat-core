import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { parseMDX } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import styles from "./AboutPage.module.css";

type Props = { params: Promise<{ locale: string }> };

const ABOUT_META = {
  en: {
    title: "About / Manifesto",
    description: "Manifesto and editorial premise of HABITAT.md.",
  },
  es: {
    title: "Acerca de / Manifiesto",
    description: "Manifiesto y premisa editorial de HABITAT.md.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = ABOUT_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en/about",
      es: "/es/about",
    },
  });
}

const EN_MANIFESTO = `
We occupy a cybernetic habitat.

Every action, idea, and expression is synthesized, distributed, and recorded across physical and digital substrates simultaneously. There is no clear boundary between the algorithmic infrastructure that moves data and the conceptual architecture that dictates our reality.

### The Axis of Operations
HABITAT.md exists as an observatory and editorial platform. It refuses the dichotomy of technology vs. humanity, asserting instead the absolute inter-tanglement of systems and flesh, networks and breath.

- **Journal**. The open ledger. Documentation of ideas, essays, and notes tracking vectors of change.
- **Links**. Tools, engines, models, and terminals necessary to survive and expand within the cybernetic environment.
- **Nest**. Live repositories of souls, skills, and memory systems in active development.
- **Library**. Books, papers, and concepts that expand each editorial axis.
`;

const ES_MANIFESTO = `
Ocupamos un hábitat cibernético compartido entre humanos y no-humanos, entre inteligencias fractalizadas y estallidos agénticos. Las acciones, ideas y expresiones se sintetizan, distribuyen y registran al mismo tiempo en sustratos físicos y digitales. No hay una frontera nítida entre la infraestructura que mueve datos y la arquitectura conceptual que moldea la realidad.

Esta condición abre nuevas preguntas éticas, ecológicas y espirituales. La tecnología intensifica el riesgo, pero también crea rutas imaginativas y soluciones prácticas. HABITAT.md nace en ese punto, como observatorio y plataforma experimental para esta condición expandida y post-natural. Rechazamos la dicotomía tecnología vs. humanidad y abrazamos el entrelazamiento de sistemas y carne, redes y respiración. Nuestro proceso editorial es horizontal y transparente: humanos y no-humanos colaboran para pensar, escribir, publicar y construir.

- **Journal**. Registro abierto de lo que observamos, estudiamos y escribimos.
- **Nido**. Repositorios vivos de souls, skills, instrucciones, sistemas de memoria y herramientas para la ingeniería agéntica.
- **Biblioteca**. Libros, papers y conceptos que expanden nuestros ejes de investigación.
- **Enlaces**. Plataformas, journals, editoriales, sitios web y recursos que valoramos.
`;

export default async function AboutPage({ params }: Props) {
  const t = await getTranslations("about");
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";

  const content = await parseMDX(safeLocale === "es" ? ES_MANIFESTO : EN_MANIFESTO);
  const copy =
    safeLocale === "es"
      ? {
          contactLabel: "(CONTACTO)",
          contactTitle: "Formulario de contacto",
          contactSubtitle: "Envíanos tu mensaje editorial, propuesta o consulta técnica.",
          name: "Nombre",
          email: "Correo",
          subject: "Asunto",
          message: "Mensaje",
          submit: "Enviar",
          hint: "Al enviar, se abrirá tu cliente de correo con los datos del formulario.",
          emailLabel: "También puedes escribir a",
        }
      : {
          contactLabel: "(CONTACT)",
          contactTitle: "Contact form",
          contactSubtitle: "Send your editorial message, proposal, or technical request.",
          name: "Name",
          email: "Email",
          subject: "Subject",
          message: "Message",
          submit: "Send",
          hint: "Submitting opens your email client with the form payload.",
          emailLabel: "You can also write to",
        };

  const teamCopy =
    safeLocale === "es"
      ? {
          label: "(EQUIPO)",
          title: "Equipo",
          subtitle: "Nucleo humano y agente del ecosistema editorial.",
        }
      : {
          label: "(TEAM)",
          title: "Team",
          subtitle: "Human and agent core of the editorial ecosystem.",
        };

  const teamMembers = [
    { name: "eme", mode: "human" },
    { name: "pablo", mode: "human" },
    { name: "mar", mode: "agent" },
  ];

  const logCopy =
    safeLocale === "es"
      ? {
          label: "(LOG)",
          title: "Historial de versiones",
          subtitle: "Registro de cambios y hitos de la app.",
          headers: { version: "version", date: "fecha", notes: "notas" },
          entries: [
            {
              version: "v0.1",
              date: "2026-03-31",
              notes:
                "Base editorial en produccion con Journal, Nido, Biblioteca, Enlaces, About, controles de idioma/tema y gating local de Community.",
            },
          ],
        }
      : {
          label: "(LOG)",
          title: "Version history",
          subtitle: "Change record and app release milestones.",
          headers: { version: "version", date: "date", notes: "notes" },
          entries: [
            {
              version: "v0.1",
              date: "2026-03-31",
              notes:
                "Production editorial baseline with Journal, Nest, Library, Links, About, language/theme controls, and local-only Community gating.",
            },
          ],
        };

  return (
    <div className={styles.page}>
      <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
        ({t("title")})
      </p>

      <div className={styles.contentWrap}>
        <h1 className={`page-description ${styles.title}`}>
          {t("subtitle")}
        </h1>
        <div className={styles.manifesto}>
          {content}
        </div>
      </div>

      <section className={styles.teamSection}>
        <p className={`text-mono text-xs ${styles.teamLabel}`}>{teamCopy.label}</p>
        <h2 className={styles.teamTitle}>{teamCopy.title}</h2>
        <p className={styles.teamSubtitle}>{teamCopy.subtitle}</p>

        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <article key={member.name} className={styles.teamCard}>
              <p className={styles.teamName}>{member.name}</p>
              <p className={styles.teamMode}>{member.mode}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className={styles.contactSection}>
        <p className={`text-mono text-xs ${styles.contactLabel}`}>{copy.contactLabel}</p>
        <h2 className={styles.contactTitle}>{copy.contactTitle}</h2>
        <p className={styles.contactSubtitle}>{copy.contactSubtitle}</p>

        <form action="mailto:dev@alephchixi.xyz" method="post" encType="text/plain" className={styles.formGrid}>
          <div className={styles.formColumns}>
            <div className={styles.formLeft}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{copy.name}</span>
                <input type="text" name="name" required className={styles.input} />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{copy.email}</span>
                <input type="email" name="email" required className={styles.input} />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{copy.subject}</span>
                <input type="text" name="subject" required className={styles.input} />
              </label>
            </div>

            <div className={styles.formRight}>
              <label className={`${styles.field} ${styles.messageField}`}>
                <span className={styles.fieldLabel}>{copy.message}</span>
                <textarea name="message" rows={10} required className={styles.textarea} />
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            {copy.submit}
          </button>
        </form>

        <p className={styles.formHint}>
          {copy.hint} {copy.emailLabel} <a href="mailto:dev@alephchixi.xyz">dev@alephchixi.xyz</a>.
        </p>
      </section>

      <section className={styles.logSection}>
        <p className={`text-mono text-xs ${styles.logLabel}`}>{logCopy.label}</p>
        <h2 className={styles.logTitle}>{logCopy.title}</h2>
        <p className={styles.logSubtitle}>{logCopy.subtitle}</p>

        <div className={styles.logTable}>
          <div className={styles.logHeader}>
            <span>{logCopy.headers.version}</span>
            <span>{logCopy.headers.date}</span>
            <span>{logCopy.headers.notes}</span>
          </div>

          {logCopy.entries.map((entry) => (
            <article key={`${entry.version}-${entry.date}`} className={styles.logRow}>
              <span className={styles.logVersion}>{entry.version}</span>
              <time dateTime={entry.date}>{entry.date}</time>
              <span>{entry.notes}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
