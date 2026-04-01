import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import type { ContentType, Locale } from "@/lib/types";

const LOCALES: Locale[] = ["en", "es"];
const JOURNAL_TYPES: ContentType[] = ["essay", "note", "observatory"];

const STATIC_PATHS = [
  "",
  "/about",
  "/journal",
  "/resources",
  "/library",
  "/authors",
  "/nest",
  "/latam",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  for (const locale of LOCALES) {
    for (const staticPath of STATIC_PATHS) {
      const url = absoluteUrl(`/${locale}${staticPath}`);
      if (seen.has(url)) continue;

      seen.add(url);
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: staticPath === "" ? "weekly" : "monthly",
        priority: staticPath === "" ? 1 : 0.7,
      });
    }

    for (const type of JOURNAL_TYPES) {
      const content = await getAllContent(locale, type);
      for (const item of content) {
        if (item.frontmatter.status !== "published") {
          continue;
        }

        const url = absoluteUrl(`/${locale}/journal/${item.slug}`);
        if (seen.has(url)) continue;

        seen.add(url);
        entries.push({
          url,
          lastModified: new Date(item.frontmatter.updated || item.frontmatter.date),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  return entries;
}
