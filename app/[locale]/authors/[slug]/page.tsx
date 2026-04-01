import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getAllAuthors } from "@/lib/authors";
import { getAllContent } from "@/lib/content";
import { absoluteUrl, createPageMetadata, serializeJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { ClientSearch } from "@/components/ui/ClientSearch";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "es"];
  const params: { locale: string; slug: string }[] = [];
  
  const authors = await getAllAuthors();

  for (const loc of locales) {
    for (const a of authors) {
      params.push({ locale: loc, slug: a.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "Author Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = author.bio[safeLocale] || author.bio.en;

  return createPageMetadata({
    locale: safeLocale,
    title: `${author.name}`,
    description,
    paths: {
      en: `/en/authors/${slug}`,
      es: `/es/authors/${slug}`,
    },
  });
}

export default async function AuthorProfilePage({ params }: Props) {
  const { locale, slug } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const nonce = (await headers()).get("x-nonce") || undefined;
  
  const author = await getAuthorBySlug(slug);
  if (!author) {
    notFound();
  }

  // Cross-reference all published entities linked to this author
  const essays = await getAllContent(safeLocale, "essay");
  const notes = await getAllContent(safeLocale, "note");
  const observatory = await getAllContent(safeLocale, "observatory");

  const contents = [...essays, ...notes, ...observatory]
    .filter((item) => {
      const isPrimary = item.frontmatter.author === slug;
      const isCoAuthor = item.frontmatter.authors?.includes(slug);
      return isPrimary || isCoAuthor;
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio[safeLocale] || author.bio.en,
    identifier: slug,
    url: absoluteUrl(`/${safeLocale}/authors/${slug}`),
    sameAs: [author.links?.website, author.links?.twitter ? `https://twitter.com/${author.links.twitter.replace("@", "")}` : undefined, author.links?.github ? `https://github.com/${author.links.github}` : undefined].filter(Boolean),
  };

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />
      <header style={{ marginBottom: "var(--space-2xl)", paddingBottom: "var(--space-lg)", borderBottom: "1px solid var(--border)" }}>
        <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
          (AUTHOR_ENTITY) : {author.authorship_mode.toUpperCase()}
        </p>
        <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "2rem", fontWeight: 400, marginBottom: "var(--space-md)", color: "var(--text)" }}>
          {author.name} <span style={{opacity: "var(--op-tertiary)"}}>@{slug}</span>
        </h1>
        <p className="page-description" style={{ fontSize: "1.2rem", maxWidth: "60ch" }}>
          {author.bio[safeLocale]}
        </p>
        
        {author.links && (
          <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-lg)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", textTransform: "lowercase" }}>
            {author.links.website && <a href={author.links.website} target="_blank" rel="noopener noreferrer" className="link-subtle">Website ↗</a>}
            {author.links.twitter && <a href={`https://twitter.com/${author.links.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="link-subtle">Twitter ↗</a>}
            {author.links.github && <a href={`https://github.com/${author.links.github}`} target="_blank" rel="noopener noreferrer" className="link-subtle">GitHub ↗</a>}
          </div>
        )}
      </header>

      <section>
        <h2 className="text-mono" style={{ fontSize: "0.85rem", opacity: "var(--op-label)", marginBottom: "var(--space-lg)", textTransform: "uppercase" }}>
          Indexación Editorial Registrada
        </h2>
        {/* We reuse the ClientSearch to automatically give filters to author's posts */}
        <ClientSearch initialData={contents} locale={locale} />
      </section>
    </div>
  );
}
