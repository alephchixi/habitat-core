import RSS from "rss";
import { getAllContent } from "./content";
import { absoluteUrl, getBaseUrl } from "./seo";
import type { ContentType, Locale } from "./types";

const FEED_TYPES: ContentType[] = ["essay", "note", "observatory"];
const LOCALES: Locale[] = ["en", "es"];

export async function generateFeedXml(): Promise<string> {
  const siteUrl = getBaseUrl();

  const feed = new RSS({
    title: "HABITAT.md",
    description:
      "A journal-lab-observatory exploring the contemporary cybernetic habitat from ethical, ecological, spiritual, cosmotechnical, and decolonial perspectives.",
    feed_url: absoluteUrl("/feed.xml"),
    site_url: siteUrl,
    language: "en",
    pubDate: new Date(),
    ttl: 60,
  });

  const items = [];

  for (const locale of LOCALES) {
    for (const type of FEED_TYPES) {
      const entries = await getAllContent(locale, type);
      items.push(
        ...entries
          .filter((entry) => entry.frontmatter.status === "published")
          .map((entry) => ({ locale, entry }))
      );
    }
  }

  items
    .sort(
      (a, b) =>
        new Date(b.entry.frontmatter.updated || b.entry.frontmatter.date).getTime() -
        new Date(a.entry.frontmatter.updated || a.entry.frontmatter.date).getTime()
    )
    .forEach(({ locale, entry }) => {
      const url = absoluteUrl(`/${locale}/journal/${entry.slug}`);
      const description = entry.frontmatter.description || entry.frontmatter.excerpt;

      feed.item({
        title: entry.frontmatter.title,
        description,
        url,
        guid: `${locale}-${entry.slug}`,
        date: entry.frontmatter.updated || entry.frontmatter.date,
        author: entry.frontmatter.authors?.join(", ") || entry.frontmatter.author || "HABITAT",
        categories: [...entry.frontmatter.axes, ...entry.frontmatter.tags],
      });
    });

  return feed.xml({ indent: true });
}
