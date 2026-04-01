import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  ContentItem,
  Frontmatter,
  Locale,
  ContentType,
  ContentVisibility,
} from "./types";
import { getContentDirs } from "./content-paths";

type ContentQueryOptions = {
  visibility?: ContentVisibility;
};

function isVisibleForContext(
  frontmatter: Frontmatter,
  visibility: ContentVisibility
): boolean {
  if (visibility === "internal") {
    return true;
  }

  return frontmatter.status === "published";
}

function parseItemFromFile(filePath: string, slug: string): ContentItem {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as Frontmatter;

  if (!frontmatter.reading_time) {
    frontmatter.reading_time = Math.ceil(readingTime(content).minutes);
  }

  return {
    frontmatter,
    content,
    filePath,
    slug,
  };
}

export async function getContentBySlug(
  locale: Locale,
  type: ContentType,
  slug: string,
  options?: ContentQueryOptions
): Promise<ContentItem | null> {
  if (slug.startsWith("_")) {
    return null;
  }

  const visibility = options?.visibility || "public";

  for (const dirPath of getContentDirs(locale, type)) {
    const filePath = path.join(dirPath, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const item = parseItemFromFile(filePath, slug);

    if (item.frontmatter.type !== type) {
      continue;
    }

    if (!isVisibleForContext(item.frontmatter, visibility)) {
      continue;
    }

    return item;
  }

  return null;
}

export async function getAllContent(
  locale: Locale,
  type: ContentType,
  options?: ContentQueryOptions
): Promise<ContentItem[]> {
  const visibility = options?.visibility || "public";
  const itemsBySlug = new Map<string, ContentItem>();

  for (const dirPath of getContentDirs(locale, type)) {
    if (!fs.existsSync(dirPath)) {
      continue;
    }

    const files = fs.readdirSync(dirPath);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));

    for (const file of mdxFiles) {
      const slug = file.replace(/\.mdx$/, "");

      if (itemsBySlug.has(slug)) {
        continue;
      }

      const filePath = path.join(dirPath, file);
      const item = parseItemFromFile(filePath, slug);

      if (item.frontmatter.type !== type) {
        continue;
      }

      if (!isVisibleForContext(item.frontmatter, visibility)) {
        continue;
      }

      itemsBySlug.set(slug, item);
    }
  }

  const items = Array.from(itemsBySlug.values());

  // Sort by date descending
  return items.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });
}
