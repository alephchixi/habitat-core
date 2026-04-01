import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { FilterBar } from "@/components/resources/FilterBar";
import { ResourceTable } from "@/components/resources/ResourceTable";
import { createPageMetadata } from "@/lib/seo";
import type { LinkItem, Locale } from "@/lib/types";

// Helper to fetch the raw data statically (fast)
function getResources(): LinkItem[] {
  const filePath = path.join(process.cwd(), "content/shared/resources.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; view?: string; page?: string }>;
};

type ViewMode = "list" | "grid";

const PAGE_SIZE = 24;

const RESOURCES_META = {
  en: {
    title: "Links",
    description: "Curated links, platforms, tools, and editorial references.",
  },
  es: {
    title: "Enlaces",
    description: "Enlaces curados de herramientas, plataformas y referencias editoriales.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const copy = RESOURCES_META[safeLocale];

  return createPageMetadata({
    locale: safeLocale,
    title: copy.title,
    description: copy.description,
    paths: {
      en: "/en/resources",
      es: "/es/resources",
    },
  });
}

export default async function ResourcesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "es" ? "es" : "en";
  const t = await getTranslations("resources");
  const query = await searchParams;
  const activeType = query.type || "all";
  const activeView: ViewMode = query.view === "grid" ? "grid" : "list";
  const currentPage = Number(query.page || "1");
  const safePage = Number.isFinite(currentPage) && currentPage > 0 ? Math.floor(currentPage) : 1;

  // Fetch and filter
  const allItems = getResources();
  const filteredItems = allItems.filter((item) => {
    const matchType = activeType === "all" || item.type === activeType;
    return matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const page = Math.min(safePage, totalPages);
  const pageStart = (page - 1) * PAGE_SIZE;
  const paginatedItems = filteredItems.slice(pageStart, pageStart + PAGE_SIZE);

  // Dynamic set of unique categories for the filters
  const categories = Array.from(new Set(allItems.map((item) => item.type))).sort();
  const buildHref = (view: ViewMode, nextPage: number, nextType = activeType) =>
    `?type=${nextType}&view=${view}&page=${nextPage}`;

  return (
    <div style={{ padding: "var(--space-2xl) 0" }}>
      <p className="page-label" style={{ marginBottom: "var(--space-sm)" }}>
        ({t("title")})
      </p>
      
      <h1 className="page-description" style={{ fontWeight: 400, marginBottom: "var(--space-2xl)" }}>
        {t("subtitle")}
      </h1>

      <div style={{ display: "grid", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
        <FilterBar
          activeType={activeType}
          activeView={activeView}
          categories={categories}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-sm)", flexWrap: "wrap" }}>
          <span className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
            {filteredItems.length} {safeLocale === "es" ? "resultados" : "results"}
          </span>

          <div style={{ display: "inline-flex", gap: "var(--space-xs)", alignItems: "center", marginLeft: "auto" }}>
            {(["list", "grid"] as ViewMode[]).map((mode) => (
              <Link
                key={mode}
                href={buildHref(mode, 1)}
                className="text-mono text-xs"
                aria-current={activeView === mode ? "page" : undefined}
                style={{
                  border: `1px solid ${activeView === mode ? "var(--text)" : "var(--border)"}`,
                  opacity: activeView === mode ? 1 : "var(--op-secondary)",
                  padding: "var(--space-xs) var(--space-sm)",
                  textTransform: "uppercase",
                }}
              >
                {mode}
              </Link>
            ))}
          </div>
        </div>

        {activeType !== "all" && (
          <div style={{ display: "inline-flex", gap: "var(--space-xs)", alignItems: "center" }}>
            <Link
              href={buildHref(activeView, 1, "all")}
              className="text-mono text-xs"
              style={{
                border: "1px solid var(--border)",
                opacity: "var(--op-secondary)",
                padding: "var(--space-xs) var(--space-sm)",
                textTransform: "uppercase",
              }}
            >
              {safeLocale === "es" ? "X reset" : "X reset"}
            </Link>
            <Link
              href={buildHref(activeView, 1, activeType)}
              className="text-mono text-xs"
              aria-current="page"
              style={{
                border: "1px solid var(--text)",
                padding: "var(--space-xs) var(--space-sm)",
                textTransform: "uppercase",
              }}
            >
              {activeType}
            </Link>
          </div>
        )}
      </div>

      <ResourceTable items={paginatedItems} viewMode={activeView} />

      {filteredItems.length > 0 && (
        <div style={{ marginTop: "var(--space-lg)", display: "flex", gap: "var(--space-sm)", alignItems: "center", justifyContent: "flex-end" }}>
          <Link
            href={buildHref(activeView, Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            style={{
              pointerEvents: page <= 1 ? "none" : "auto",
              opacity: page <= 1 ? "var(--op-tertiary)" : 1,
              border: "1px solid var(--border)",
              padding: "var(--space-xs) var(--space-sm)",
            }}
            className="text-mono text-xs"
          >
            Prev
          </Link>

          <span className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
            Page {page}/{totalPages}
          </span>

          <Link
            href={buildHref(activeView, Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            style={{
              pointerEvents: page >= totalPages ? "none" : "auto",
              opacity: page >= totalPages ? "var(--op-tertiary)" : 1,
              border: "1px solid var(--border)",
              padding: "var(--space-xs) var(--space-sm)",
            }}
            className="text-mono text-xs"
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
