import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllContent } from "@/lib/content";
import type { Locale } from "@/lib/types";
import styles from "../../journal/JournalList.module.css"; 

type Props = {
  params: Promise<{ locale: string; tag: string }>;
};

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "es"];
  const params: { locale: Locale; tag: string }[] = [];
  
  for (const loc of locales) {
    const essays = await getAllContent(loc, "essay");
    const notes = await getAllContent(loc, "note");
    const observatory = await getAllContent(loc, "observatory");

    const contents = [...essays, ...notes, ...observatory];
    
    // Extract unique tags
    const tags = new Set<string>();
    for (const c of contents) {
      if (c.frontmatter.tags) {
        for (const t of c.frontmatter.tags) {
          tags.add(t.toLowerCase());
        }
      }
    }

    for (const tag of tags) {
      params.push({ locale: loc, tag: encodeURIComponent(tag) });
    }
  }

  return params;
}

export default async function TagPage({ params }: Props) {
  const { locale, tag } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const decodedTag = decodeURIComponent(tag).toLowerCase();
  
  const essays = await getAllContent(safeLocale, "essay");
  const notes = await getAllContent(safeLocale, "note");
  const observatory = await getAllContent(safeLocale, "observatory");

  const contents = [...essays, ...notes, ...observatory]
    .filter(item => {
      return item.frontmatter.tags?.some(t => t.toLowerCase() === decodedTag);
    })
    .sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

  if (contents.length === 0) {
    notFound();
  }

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
        (Tag)
      </p>
      <h1 className="page-description" style={{ fontWeight: 400, marginBottom: "var(--space-2xl)" }}>
        #{decodedTag}
      </h1>

      <div className={styles.list}>
        {contents.map((item) => (
          <Link 
            key={item.slug} 
            href={`/${locale}/journal/${item.slug}`} 
            className={`${styles.item} row-hover`}
          >
            <div className={styles.itemHeader}>
              <h2 className={styles.title}>{item.frontmatter.title}</h2>
              <div className={styles.metadata}>
                <span className={styles.tag}>{item.frontmatter.type}</span>
                <time dateTime={item.frontmatter.date}>
                  {new Date(item.frontmatter.date).toLocaleDateString(locale === "es" ? "es-CO" : "en-US", { year: 'numeric', month: 'short', day: 'numeric'})}
                </time>
              </div>
            </div>
            {item.frontmatter.description && (
              <p className={styles.description}>
                {item.frontmatter.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
