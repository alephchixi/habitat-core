import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent } from "@/lib/content";
import { getRelatedLibraryItems } from "@/lib/library";
import { getAuthorBySlug } from "@/lib/authors";
import { parseMDX } from "@/lib/mdx";
import {
  absoluteUrl,
  createArticleJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import { TableOfContents, type TOCItem } from "@/components/mdx/TableOfContents";
import type { ContentType, Locale, ContentItem, Author } from "@/lib/types";
import styles from "./Reader.module.css";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const JOURNAL_TYPES: ContentType[] = ["essay", "note", "observatory", "manifesto"];

async function resolveJournalEntry(locale: Locale, slug: string): Promise<ContentItem | null> {
  for (const type of JOURNAL_TYPES) {
    const item = await getContentBySlug(locale, type, slug);
    if (item) return item;
  }
  return null;
}

async function findTranslatedSlug(locale: Locale, translationKey?: string): Promise<string | null> {
  if (!translationKey) return null;

  for (const type of JOURNAL_TYPES) {
    const items = await getAllContent(locale, type);
    const match = items.find((item) => item.frontmatter.translation_key === translationKey);
    if (match) return match.slug;
  }

  return null;
}

// Generate static endpoints for all MDX inside /journal/
export async function generateStaticParams() {
  const locales: Locale[] = ["en", "es"];
  const params: { locale: string; slug: string }[] = [];
  const seen = new Set<string>();
  
  for (const loc of locales) {
    const essays = await getAllContent(loc, "essay");
    const notes = await getAllContent(loc, "note");
    const observatory = await getAllContent(loc, "observatory");

    const contents = [...essays, ...notes, ...observatory];

    for (const c of contents) {
      const key = `${loc}:${c.slug}`;
      if (seen.has(key)) continue;

      seen.add(key);
      params.push({ locale: loc, slug: c.slug });
    }
  }

  return params;
}

// Generate head metadata for SEO dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const content = await resolveJournalEntry(safeLocale, slug);

  if (!content) {
    return {
      title: "Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const otherLocale: Locale = safeLocale === "en" ? "es" : "en";
  const translatedSlug = await findTranslatedSlug(otherLocale, content.frontmatter.translation_key);

  const slugsByLocale: Record<Locale, string> = {
    en: safeLocale === "en" ? slug : translatedSlug || slug,
    es: safeLocale === "es" ? slug : translatedSlug || slug,
  };

  const description = content.frontmatter.description || content.frontmatter.excerpt;

  return createPageMetadata({
    locale: safeLocale,
    title: content.frontmatter.title,
    description,
    paths: {
      en: `/en/journal/${slugsByLocale.en}`,
      es: `/es/journal/${slugsByLocale.es}`,
    },
    openGraphType: "article",
  });
}

export default async function ReaderPage({ params }: Props) {
  const { locale, slug } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const nonce = (await headers()).get("x-nonce") || undefined;
  
  const content = await resolveJournalEntry(safeLocale, slug);

  if (!content) {
    notFound();
  }

  const { frontmatter, content: rawMdx } = content;
  const mdxRendered = await parseMDX(rawMdx);
  const description = frontmatter.description || frontmatter.excerpt;
  const authors = frontmatter.authors?.length
    ? frontmatter.authors
    : frontmatter.author
      ? [frontmatter.author]
      : ["HABITAT"]; 
  const otherLocale: Locale = safeLocale === "en" ? "es" : "en";
  const translatedSlug = await findTranslatedSlug(otherLocale, frontmatter.translation_key);
  const translatedHref = translatedSlug ? `/${otherLocale}/journal/${translatedSlug}` : null;
  const articleJsonLd = createArticleJsonLd({
    locale: safeLocale,
    title: frontmatter.title,
    description,
    url: absoluteUrl(`/${safeLocale}/journal/${slug}`),
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated,
    authors,
    tags: frontmatter.tags,
  });
  const relatedLibrary = getRelatedLibraryItems(content, safeLocale, 4);
  const authorSlugs = frontmatter.authors?.length
    ? frontmatter.authors
    : frontmatter.author
      ? [frontmatter.author]
      : ["habitat"];
  const authorProfiles = (await Promise.all(authorSlugs.map((slug) => getAuthorBySlug(slug)))).filter(
    (author): author is Author => author !== null
  );

  // Extract headings (H2 & H3) using simple Regex, mirroring rehypeSlug format
  const headings = Array.from(rawMdx.matchAll(/(?:^|\n)(#{2,3})\s+(.+)/g));
  const toc: TOCItem[] = headings.map((match) => ({
    level: match[1].length,
    label: match[2].trim(),
    id: match[2]
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }));

  return (
    <div className={styles.layout}>
      <article className={styles.readerBase}>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
        />
        <header className={styles.header}>
        <div className={styles.metadata}>
          <span className={styles.tag}>{frontmatter.type || "essay"}</span>
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString(safeLocale === "es" ? "es-CO" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          {frontmatter.reading_time && <span>{frontmatter.reading_time} min read</span>}
          {translatedHref && (
            <Link href={translatedHref} className="link-subtle text-mono text-xs">
              {otherLocale.toUpperCase()} version
            </Link>
          )}
        </div>
        <h1 className={styles.title}>{frontmatter.title}</h1>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </header>

      <div className={styles.content}>
        {mdxRendered}
      </div>

      {relatedLibrary.length > 0 && (
        <section className={styles.related}>
          <p className="text-mono text-xs" style={{ opacity: "var(--op-label)", marginBottom: "var(--space-sm)" }}>
            {safeLocale === "es" ? "Lecturas relacionadas" : "Related library"}
          </p>
          <div className={styles.relatedList}>
            {relatedLibrary.map((item) => (
              <a
                key={item.id}
                href={item.url || `/${safeLocale}/library`}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noopener noreferrer" : undefined}
                className={styles.relatedItem}
              >
                <span className={styles.relatedTitle}>{item.title}</span>
                <span className={styles.relatedMeta}>
                  {item.type} · {item.author_or_source}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {(frontmatter.authorship_note || frontmatter.model_info || frontmatter.human_review) && (
        <section className={styles.related}>
          <p className="text-mono text-xs" style={{ opacity: "var(--op-label)", marginBottom: "var(--space-sm)" }}>
            {safeLocale === "es" ? "Transparencia editorial" : "Editorial transparency"}
          </p>
          <div style={{ display: "grid", gap: "var(--space-xs)" }}>
            {frontmatter.authorship_note && (
              <p className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
                {frontmatter.authorship_note}
              </p>
            )}

            {frontmatter.model_info && (
              <p className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
                model: {frontmatter.model_info.provider}/{frontmatter.model_info.model}
                {frontmatter.model_info.version ? ` (${frontmatter.model_info.version})` : ""}
              </p>
            )}

            {frontmatter.human_review && (
              <p className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
                human_review: {frontmatter.human_review.reviewed ? "true" : "false"}
                {frontmatter.human_review.by ? ` by ${frontmatter.human_review.by}` : ""}
                {frontmatter.human_review.at ? ` @ ${frontmatter.human_review.at}` : ""}
              </p>
            )}
          </div>
        </section>
      )}

        <footer className={styles.footer}>
          <div className="hr-line hr-line-top" />

          <div className={styles.authorList}>
            {authorProfiles.length > 0 ? (
              authorProfiles.map((author) => {
                const primaryLink = author.links?.website || author.links?.github || author.links?.twitter;
                const href = primaryLink?.startsWith("http")
                  ? primaryLink
                  : primaryLink
                    ? `https://x.com/${primaryLink.replace(/^@/, "")}`
                    : null;

                return (
                  <article key={author.slug} className={styles.authorCard}>
                    <p className={styles.authorName}>{author.name}</p>
                    <p className={styles.authorMeta}>
                      {author.authorship_mode === "human"
                        ? safeLocale === "es"
                          ? "Human"
                          : "Human"
                        : safeLocale === "es"
                          ? "No humano"
                          : "Non-human"}
                    </p>
                    <p className={styles.authorBio}>{author.bio[safeLocale]}</p>
                    {href && (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.authorLink}>
                        {safeLocale === "es" ? "Perfil" : "Profile"}
                      </a>
                    )}
                  </article>
                );
              })
            ) : (
              <p className="text-mono" style={{ opacity: "var(--op-secondary)" }}>
                {authorSlugs.join(", ")} — {frontmatter.authorship_mode.toUpperCase()}
              </p>
            )}
          </div>
        </footer>
      </article>

      {toc.length > 0 && (
        <aside className={styles.sidebar}>
          <TableOfContents items={toc} />
        </aside>
      )}
    </div>
  );
}
