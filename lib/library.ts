import fs from "fs";
import path from "path";
import type { ContentItem, LibraryItem, Locale } from "./types";

const LIBRARY_PATH = path.join(process.cwd(), "content", "shared", "library.json");

function scoreByYear(year?: string): number {
  const value = Number(year);
  return Number.isFinite(value) ? value : 0;
}

export function getLibraryItems(): LibraryItem[] {
  try {
    const raw = fs.readFileSync(LIBRARY_PATH, "utf8");
    const parsed = JSON.parse(raw) as LibraryItem[];
    return parsed;
  } catch {
    return [];
  }
}

export function getRelatedLibraryItems(
  source: Pick<ContentItem, "frontmatter">,
  locale: Locale,
  limit = 4
): LibraryItem[] {
  const allItems = getLibraryItems();

  const sourceAxes = new Set(source.frontmatter.axes.map((axis) => axis.toLowerCase()));
  const sourceTags = new Set(source.frontmatter.tags.map((tag) => tag.toLowerCase()));

  const scored = allItems
    .map((item) => {
      let score = 0;

      const axisHits = item.axes.filter((axis) => sourceAxes.has(axis.toLowerCase())).length;
      score += axisHits * 4;

      const themes = (item.themes || []).map((theme) => theme.toLowerCase());
      const themeHits = themes.filter((theme) => sourceTags.has(theme)).length;
      score += themeHits * 3;

      const title = item.title.toLowerCase();
      const description = (item.description[locale] || item.description.en).toLowerCase();
      for (const tag of sourceTags) {
        if (title.includes(tag)) score += 2;
        if (description.includes(tag)) score += 1;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return scoreByYear(b.item.year) - scoreByYear(a.item.year);
    })
    .slice(0, limit)
    .map((entry) => entry.item);

  return scored;
}
