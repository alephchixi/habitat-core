import fs from "fs";
import path from "path";
import type { Author } from "./types";

const AUTHORS_PATH = path.join(process.cwd(), "content", "shared", "authors");

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const fullPath = path.join(AUTHORS_PATH, `${slug}.json`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const data = JSON.parse(fileContents);

    return {
      slug,
      ...data,
    };
  } catch {
    return null;
  }
}

export async function getAllAuthors(): Promise<Author[]> {
  try {
    const files = fs.readdirSync(AUTHORS_PATH);
    const authors: Author[] = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const slug = file.replace(/\.json$/, "");
      const author = await getAuthorBySlug(slug);
      if (author) authors.push(author);
    }

    return authors;
  } catch {
    return [];
  }
}
