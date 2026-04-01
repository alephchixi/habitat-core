import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAllContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

const LATAM_META = {
  en: {
    title: "LatAm",
    description: "Spanish-first editorial line for decolonial and situated thought in Abya Yala.",
  },
  es: {
    title: "LatAm",
    description: "Linea editorial en espanol para pensamiento decolonial y situado en Abya Yala.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = LATAM_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en/latam",
      es: "/es/latam",
    },
  });
}

const LATAM_TAGS = new Set(["latam", "decolonial", "ch'ixi", "abya-yala", "sur", "territorio"]);

export default async function LatAmPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const t = await getTranslations("nav");

  if (safeLocale !== "es") {
    return (
      <div style={{ padding: "var(--space-2xl) 0" }}>
        <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
          ({t("latam")})
        </p>
        <h1 className="page-description" style={{ fontWeight: 400, marginBottom: "var(--space-lg)" }}>
          Seccion disponible en espanol
        </h1>
        <Link href="/es/latam" className="text-mono text-xs" style={{ border: "1px solid var(--border)", padding: "var(--space-xs) var(--space-sm)" }}>
          Ir a /es/latam
        </Link>
      </div>
    );
  }

  const essays = await getAllContent("es", "essay");
  const notes = await getAllContent("es", "note");
  const observatory = await getAllContent("es", "observatory");

  const items = [...essays, ...notes, ...observatory]
    .filter((item) => {
      const hasLatamTag = item.frontmatter.tags.some((tag) => LATAM_TAGS.has(tag.toLowerCase()));
      const hasCosmotechnics = item.frontmatter.axes.includes("cosmotechnics");
      return hasLatamTag || hasCosmotechnics;
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
        ({t("latam")})
      </p>
      <h1 className="page-description" style={{ fontWeight: 400, marginBottom: "var(--space-xl)" }}>
        Archivo situado de pensamiento latinoamericano y decolonial
      </h1>

      <div className="hr-line hr-line-top" style={{ marginBottom: "var(--space-lg)" }} />

      {items.length === 0 ? (
        <p className="text-mono" style={{ opacity: "var(--op-secondary)" }}>
          [0] No hay piezas registradas aun.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/es/journal/${item.slug}`}
              className="row-hover"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "var(--space-md)",
                padding: "var(--space-md) 0",
                borderBottom: "1px dotted var(--border)",
              }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontSize: "1.125rem" }}>{item.frontmatter.title}</span>
              <span className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
                {new Date(item.frontmatter.date).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
