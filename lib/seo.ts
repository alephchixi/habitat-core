import type { Metadata } from "next";
import type { Locale } from "./types";

const SITE_NAME = "HABITAT.md";

export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || "https://habitat.md";
  const normalized = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
  return normalized.replace(/\/$/, "");
}

export function absoluteUrl(pathname: string): string {
  const base = `${getBaseUrl()}/`;
  const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return new URL(cleanPath, base).toString();
}

export function buildLocaleAlternates(
  locale: Locale,
  paths: Record<Locale, string>
): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(paths[locale]),
    languages: {
      en: absoluteUrl(paths.en),
      es: absoluteUrl(paths.es),
      "x-default": absoluteUrl(paths.en),
    },
  };
}

type CreatePageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  paths: Record<Locale, string>;
  openGraphType?: "website" | "article";
};

export function createPageMetadata({
  locale,
  title,
  description,
  paths,
  openGraphType = "website",
}: CreatePageMetadataInput): Metadata {
  const canonical = absoluteUrl(paths[locale]);

  return {
    title,
    description,
    alternates: buildLocaleAlternates(locale, paths),
    openGraph: {
      title,
      description,
      type: openGraphType,
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_ES"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

type ArticleJsonLdInput = {
  locale: Locale;
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authors: string[];
  tags?: string[];
};

export function createArticleJsonLd({
  locale,
  title,
  description,
  url,
  datePublished,
  dateModified,
  authors,
  tags,
}: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: locale,
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getBaseUrl(),
    },
    keywords: tags?.join(", "),
  };
}

export function serializeJsonLd(payload: unknown): string {
  return JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
