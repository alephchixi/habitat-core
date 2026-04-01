/* ═══════════════════════════════════════════════════════════
   HABITAT.md — Core Type Definitions
   ═══════════════════════════════════════════════════════════ */

export type ContentType =
  | "essay"
  | "note"
  | "column"
  | "interview"
  | "manifesto"
  | "review"
  | "dossier"
  | "bibliography"
  | "resource-map"
  | "tutorial"
  | "observatory"
  | "field-note"
  | "experiment"
  | "agentic-text"
  | "hybrid-text";

export type Axis =
  | "habitat"
  | "ethics"
  | "ecology"
  | "spirit"
  | "cosmotechnics"
  | "lab";

export type AuthorshipMode = "human" | "agent" | "habitat";

export type ContentStatus = "draft" | "review" | "approved" | "published";
export type ContentVisibility = "public" | "internal";

export type Locale = "en" | "es";

export interface Source {
  title: string;
  url: string;
  kind: "primary" | "secondary";
  checked_at: string; // YYYY-MM-DD
}

export interface ModelInfo {
  provider: string;
  model: string;
  version?: string;
}

export interface HumanReview {
  reviewed: boolean;
  by?: string;
  at?: string; // YYYY-MM-DD
}

/** Frontmatter schema for all MDX content */
export interface Frontmatter {
  title: string;
  slug?: string;
  description?: string;
  locale: Locale;
  translation_key: string;
  type: ContentType;
  axes: Axis[];
  author?: string;
  authors?: string[];
  authorship_mode: AuthorshipMode;
  authorship_note?: string;
  status: ContentStatus;
  date: string; // YYYY-MM-DD
  updated?: string; // YYYY-MM-DD
  featured: boolean;
  excerpt: string;
  tags: string[];
  reading_time?: number;
  cover_image?: string;
  sources?: Source[];
  model_info?: ModelInfo;
  human_review?: HumanReview;
}

/** Parsed content with frontmatter + raw MDX body */
export interface ContentItem {
  frontmatter: Frontmatter;
  content: string; // raw MDX body
  filePath: string;
  slug: string;
}

/** Author profile stored in content/shared/authors/ */
export interface Author {
  slug: string;
  name: string;
  bio: {
    en: string;
    es: string;
  };
  authorship_mode: AuthorshipMode;
  avatar?: string;
  links?: {
    website?: string;
    twitter?: string;
    github?: string;
  };
}

/** Link item for the Resources directory */
export type LinkType =
  | "herramientas"
  | "editoriales"
  | "portales"
  | "plataformas"
  | "habitat";

export interface LinkItem {
  id: string;
  type: LinkType;
  label: string;
  href: string;
  description?: string;
  axes?: Axis[];
  source: string;
  curation_status: "seed" | "reviewed" | "verified";
  last_checked_at: string; // YYYY-MM-DD
  license_note?: string;
  region?: string;
}

/** Library items for /library JSON database */
export type LibraryItemType = "book" | "paper" | "concept";

export interface LibraryItem {
  id: string; // e.g., "cybernetics-wiener"
  title: string;
  type: LibraryItemType;
  author_or_source: string;
  year?: string;
  url?: string;
  region?: string;
  themes?: string[];
  axes: Axis[];
  description: {
    en: string;
    es: string;
  };
}
