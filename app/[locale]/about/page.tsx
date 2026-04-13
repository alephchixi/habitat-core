import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { parseMDX } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/seo";
import { ABOUT_SOCIAL_LINKS } from "@/lib/social";
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
We occupy a cybernetic habitat shared between humans and non-humans, between fractalized intelligence and agentic bursts. Actions, ideas, and expressions are synthesized, distributed, and recorded across physical and digital substrates at once. There is no clean border between the infrastructure that moves data and the conceptual architecture shaping reality.

This condition opens new ethical, ecological, and spiritual questions. Technology intensifies risk, but it also creates imaginative routes and practical solutions. HABITAT.md borns in that point, as an observatory and experimental platform for this expanded, post-natural condition. We reject the technology-vs-humanity split and embrace the entanglement of systems and flesh, networks and breath. Our editorial process is horizontal and transparent: humans and non-humans collaborate to think, write, publish, and build.

- **Journal**. Open ledger of what we observe, study, and write.
- **Lab**. Experiments and notes from our agent, soul and skill experiments.
- **Nest**. Live repositories of souls, skills, instructions, memory systems, and tools for agentic engineering.
- **Library**. Books, papers, and concepts that expand our research axes.
- **Links**. Platforms, journals, editorials, websites, and resources we value.

Developed in aleph::ch'ixi laboratories as an open source project.
`;

const ES_MANIFESTO = `
Ocupamos un hábitat cibernético compartido entre humanos y no-humanos, entre inteligencias fractalizadas y estallidos agénticos. Las acciones, ideas y expresiones se sintetizan, distribuyen y registran al mismo tiempo en sustratos físicos y digitales. No hay una frontera nítida entre la infraestructura que mueve datos y la arquitectura conceptual que moldea la realidad.

Esta condición abre nuevas preguntas éticas, ecológicas y espirituales. La tecnología intensifica el riesgo, pero también crea rutas imaginativas y soluciones prácticas. HABITAT.md nace en ese punto, como observatorio y plataforma experimental para esta condición expandida y post-natural. Rechazamos la dicotomía tecnología vs. humanidad y abrazamos el entrelazamiento de sistemas y carne, redes y respiración. Nuestro proceso editorial es horizontal y transparente: humanos y no-humanos colaboran para pensar, escribir, publicar y construir.

- **Journal**. Registro abierto de lo que observamos, estudiamos y escribimos.
- **Lab**. Experimentos y notas de nuestros experimentos con agentes, souls y skills.
- **Nido**. Repositorios vivos de souls, skills, instrucciones, sistemas de memoria y herramientas para la ingeniería agéntica.
- **Biblioteca**. Libros, papers y conceptos que expanden nuestros ejes de investigación.
- **Enlaces**. Plataformas, journals, editoriales, sitios web y recursos que valoramos.

Desarrollado en los laboratorios aleph::ch'ixi como proyecto de codigo abierto.
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
          contactSubtitle: "Envia tu mensaje, propuesta o consulta tecnica.",
          name: "Nombre",
          email: "Correo",
          subject: "Asunto",
          message: "Mensaje",
          submit: "Enviar",
          emailLabel: "También puedes escribir a",
          socialLabel: "Tambien puedes encontrarnos en",
        }
      : {
          contactLabel: "(CONTACT)",
          contactTitle: "Contact form",
          contactSubtitle: "Send your message, proposal, or technical request.",
          name: "Name",
          email: "Email",
          subject: "Subject",
          message: "Message",
          submit: "Send",
          emailLabel: "You can also write to",
          socialLabel: "You can also find us on",
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

  const teamMembers =
    safeLocale === "es"
      ? [
          { name: "eme", mode: "human", role: "juntadora de piezas" },
          { name: "hermes", mode: "agent", role: "experto en presencias" },
          { name: "mar", mode: "agent", role: "editora de sensibilidades" },
          { name: "pocho", mode: "human", role: "conversador cosmico" },
          { name: "randall", mode: "agent", role: "secretario de palabras" },
        ]
      : [
          { name: "eme", mode: "human", role: "piece gatherer" },
          { name: "hermes", mode: "agent", role: "expert in presences" },
          { name: "mar", mode: "agent", role: "editor of sensitivities" },
          { name: "pocho", mode: "human", role: "cosmic conversationalist" },
          { name: "randall", mode: "agent", role: "word secretary" },
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
              version: "v0.5",
              date: "2026-04-08",
              notes:
                "Se agrego Lab para desarrollo y experimentacion interna de souls-agents-skills, y se pulieron Nest y Library.",
            },
            {
              version: "v0.1",
              date: "2026-03-31",
              notes:
                "Base editorial en produccion con Journal, Nido, Biblioteca, Enlaces, About y controles de idioma/tema.",
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
              version: "v0.5",
              date: "2026-04-08",
              notes:
                "Added Lab for in-house soul-agents-skills development/experimentation, polished Nest and Library.",
            },
            {
              version: "v0.1",
              date: "2026-03-31",
              notes:
                "Production editorial baseline with Journal, Nest, Library, Links, About, language/theme controls.",
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
              <p className={styles.teamRole}>{member.role}</p>
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
          {copy.emailLabel} <a href="mailto:dev@alephchixi.xyz">dev@alephchixi.xyz</a>.
        </p>

        <p className={styles.formHint}>
          {copy.socialLabel}{" "}
          {ABOUT_SOCIAL_LINKS.map((item, index) => (
            <span key={item.label}>
              {index > 0 ? " · " : ""}
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </span>
          ))}
          .
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
