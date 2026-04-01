import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

const REQUIRED_FIELDS = [
  "title",
  "locale",
  "translation_key",
  "type",
  "axes",
  "authorship_mode",
  "status",
  "date",
  "featured",
  "excerpt",
  "tags",
];

const VALID_LOCALES = new Set(["en", "es"]);
const VALID_TYPES = new Set([
  "essay",
  "note",
  "column",
  "interview",
  "manifesto",
  "review",
  "dossier",
  "bibliography",
  "resource-map",
  "tutorial",
  "observatory",
  "field-note",
  "experiment",
  "agentic-text",
  "hybrid-text",
]);
const VALID_AXES = new Set(["habitat", "ethics", "ecology", "spirit", "cosmotechnics", "lab"]);
const VALID_AUTHORSHIP = new Set(["human", "agent", "habitat"]);
const VALID_STATUS = new Set(["draft", "review", "approved", "published"]);
const VALID_LINK_TYPES = new Set(["herramientas", "editoriales", "portales", "plataformas", "habitat"]);
const VALID_CURATION_STATUS = new Set(["seed", "reviewed", "verified"]);
const AGENTIC_TYPES = new Set(["agentic-text", "hybrid-text"]);

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function rel(filePath) {
  return path.relative(process.cwd(), filePath);
}

const mdxFiles = walk(CONTENT_DIR).filter(
  (filePath) => filePath.endsWith(".mdx") && !path.basename(filePath).startsWith("_")
);

const errors = [];
const warnings = [];

const translationKeyIndex = new Map();

for (const filePath of mdxFiles) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);

  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined) {
      errors.push(`${rel(filePath)} -> missing required field: ${field}`);
    }
  }

  if (data.locale !== undefined && !VALID_LOCALES.has(data.locale)) {
    errors.push(`${rel(filePath)} -> invalid locale: ${data.locale}`);
  }

  if (data.type !== undefined && !VALID_TYPES.has(data.type)) {
    errors.push(`${rel(filePath)} -> invalid type: ${data.type}`);
  }

  if (data.authorship_mode !== undefined && !VALID_AUTHORSHIP.has(data.authorship_mode)) {
    errors.push(`${rel(filePath)} -> invalid authorship_mode: ${data.authorship_mode}`);
  }

  if (data.status !== undefined && !VALID_STATUS.has(data.status)) {
    errors.push(`${rel(filePath)} -> invalid status: ${data.status}`);
  }

  if (data.date !== undefined && !DATE_REGEX.test(data.date)) {
    errors.push(`${rel(filePath)} -> invalid date format (expected YYYY-MM-DD): ${data.date}`);
  }

  if (data.featured !== undefined && typeof data.featured !== "boolean") {
    errors.push(`${rel(filePath)} -> featured must be boolean`);
  }

  if (data.axes !== undefined) {
    if (!Array.isArray(data.axes) || data.axes.length === 0) {
      errors.push(`${rel(filePath)} -> axes must be a non-empty array`);
    } else {
      const invalidAxes = data.axes.filter((axis) => !VALID_AXES.has(axis));
      if (invalidAxes.length > 0) {
        errors.push(`${rel(filePath)} -> invalid axes: ${invalidAxes.join(", ")}`);
      }
    }
  }

  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push(`${rel(filePath)} -> tags must be an array`);
  }

  const isAgentic = AGENTIC_TYPES.has(data.type) || data.authorship_mode === "agent";
  if (isAgentic) {
    if (typeof data.authorship_note !== "string" || data.authorship_note.trim().length === 0) {
      errors.push(`${rel(filePath)} -> agentic/hybrid content requires non-empty authorship_note`);
    }

    const modelInfo = data.model_info;
    if (
      !modelInfo ||
      typeof modelInfo !== "object" ||
      typeof modelInfo.provider !== "string" ||
      typeof modelInfo.model !== "string"
    ) {
      errors.push(`${rel(filePath)} -> agentic/hybrid content requires model_info.provider and model_info.model`);
    }

    if (!Array.isArray(data.sources) || data.sources.length === 0) {
      errors.push(`${rel(filePath)} -> agentic/hybrid content requires non-empty sources[]`);
    } else {
      for (const [index, source] of data.sources.entries()) {
        if (
          !source ||
          typeof source !== "object" ||
          typeof source.title !== "string" ||
          typeof source.url !== "string" ||
          (source.kind !== "primary" && source.kind !== "secondary") ||
          typeof source.checked_at !== "string" ||
          !DATE_REGEX.test(source.checked_at)
        ) {
          errors.push(`${rel(filePath)} -> invalid source at index ${index}`);
        }
      }
    }

    const review = data.human_review;
    if (!review || typeof review !== "object" || typeof review.reviewed !== "boolean") {
      errors.push(`${rel(filePath)} -> agentic/hybrid content requires human_review.reviewed boolean`);
    }

    if (data.status === "published" && (!review || review.reviewed !== true)) {
      errors.push(`${rel(filePath)} -> published agentic/hybrid content requires human_review.reviewed=true`);
    }
  }

  if (data.translation_key && data.locale) {
    const key = data.translation_key;
    const bucket = translationKeyIndex.get(key) ?? [];
    bucket.push({ locale: data.locale, filePath });
    translationKeyIndex.set(key, bucket);
  }
}

for (const [key, entries] of translationKeyIndex.entries()) {
  const byLocale = new Map();

  for (const entry of entries) {
    const list = byLocale.get(entry.locale) ?? [];
    list.push(entry.filePath);
    byLocale.set(entry.locale, list);
  }

  for (const [locale, files] of byLocale.entries()) {
    if (files.length > 1) {
      errors.push(
        `translation_key "${key}" has duplicated locale "${locale}": ${files
          .map((filePath) => rel(filePath))
          .join(", ")}`
      );
    }
  }

  if (byLocale.size === 1) {
    warnings.push(
      `translation_key "${key}" exists in one locale only: ${entries
        .map((entry) => rel(entry.filePath))
        .join(", ")}`
    );
  }
}

const resourcesPath = path.join(CONTENT_DIR, "shared", "resources.json");
if (fs.existsSync(resourcesPath)) {
  let resources;
  try {
    resources = JSON.parse(fs.readFileSync(resourcesPath, "utf8"));
  } catch {
    errors.push("content/shared/resources.json -> invalid JSON");
    resources = [];
  }

  if (!Array.isArray(resources)) {
    errors.push("content/shared/resources.json -> root must be an array");
  } else {
    const ids = new Set();

    for (const [index, item] of resources.entries()) {
      const prefix = `content/shared/resources.json -> item[${index}]`;

      if (!item || typeof item !== "object") {
        errors.push(`${prefix} must be an object`);
        continue;
      }

      if (typeof item.id !== "string" || item.id.trim().length === 0) {
        errors.push(`${prefix} missing id`);
      } else {
        if (ids.has(item.id)) {
          errors.push(`${prefix} duplicated id: ${item.id}`);
        }
        ids.add(item.id);
      }

      if (typeof item.type !== "string" || !VALID_LINK_TYPES.has(item.type)) {
        errors.push(`${prefix} invalid type: ${String(item.type)}`);
      }

      if (typeof item.label !== "string" || item.label.trim().length === 0) {
        errors.push(`${prefix} missing label`);
      }

      if (typeof item.href !== "string" || item.href.trim().length === 0) {
        errors.push(`${prefix} missing href`);
      } else {
        try {
          const url = new URL(item.href);
          if (url.protocol !== "https:" && url.protocol !== "http:") {
            errors.push(`${prefix} href must be http/https URL`);
          }
        } catch {
          errors.push(`${prefix} invalid href URL`);
        }
      }

      if (typeof item.source !== "string" || item.source.trim().length === 0) {
        errors.push(`${prefix} missing source`);
      }

      if (typeof item.curation_status !== "string" || !VALID_CURATION_STATUS.has(item.curation_status)) {
        errors.push(`${prefix} invalid curation_status: ${String(item.curation_status)}`);
      }

      if (typeof item.last_checked_at !== "string" || !DATE_REGEX.test(item.last_checked_at)) {
        errors.push(`${prefix} invalid last_checked_at (expected YYYY-MM-DD)`);
      }

      if (item.axes !== undefined) {
        if (!Array.isArray(item.axes)) {
          errors.push(`${prefix} axes must be an array when present`);
        } else {
          const invalidAxes = item.axes.filter((axis) => !VALID_AXES.has(axis));
          if (invalidAxes.length > 0) {
            errors.push(`${prefix} invalid axes: ${invalidAxes.join(", ")}`);
          }
        }
      }
    }
  }
}

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("\nContent check failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Content check passed for ${mdxFiles.length} MDX files.`);
