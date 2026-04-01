"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Axis, ContentItem } from "@/lib/types";
import styles from "./ClientSearch.module.css";
import listStyles from "../../app/[locale]/journal/JournalList.module.css";

type SearchItem = ContentItem & { slug: string };
const LATAM_KEYWORDS = ["latam", "decolonial", "ch'ixi", "sur", "territorio"];
type ViewMode = "list" | "grid" | "metadata";
type AuthorshipFilter = "all" | "human" | "non-human";
const AXES: Axis[] = ["habitat", "ethics", "ecology", "spirit", "cosmotechnics", "lab"];

const PAGE_SIZE = 8;

function scoreItem(item: SearchItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = item.frontmatter.title.toLowerCase();
  const description = (item.frontmatter.description || item.frontmatter.excerpt || "").toLowerCase();
  const tags = (item.frontmatter.tags || []).map((tag) => tag.toLowerCase());
  const axes = (item.frontmatter.axes || []).map((axis) => axis.toLowerCase());

  let score = 0;

  if (title === q) score += 120;
  if (title.startsWith(q)) score += 80;
  if (title.includes(q)) score += 40;
  if (description.includes(q)) score += 24;
  if (tags.some((tag) => tag === q)) score += 30;
  if (tags.some((tag) => tag.includes(q))) score += 16;
  if (axes.some((axis) => axis.includes(q))) score += 12;
  if (item.frontmatter.type.toLowerCase().includes(q)) score += 8;

  return score;
}

function isAxis(value: string): value is Axis {
  return AXES.includes(value as Axis);
}

export function ClientSearch({ 
  initialData, 
  locale,
  initialType,
}: { 
  initialData: SearchItem[],
  locale: string;
  initialType?: string;
}) {
  const isEs = locale === "es";
  const copy = {
    searchPlaceholder: isEs
      ? "Buscar por titulo, tags, ejes o tipo..."
      : "Search by title, tags, axes, or type...",
    keyboardHint: isEs ? "Cmd/Ctrl+K" : "Cmd/Ctrl+K",
    filters: isEs ? "FILTROS" : "FILTERS",
    modes: isEs ? "VISTA" : "VIEW",
    tags: isEs ? "TAGS" : "TAGS",
    allYears: isEs ? "Todos los anos" : "All years",
    allAxes: isEs ? "Todos los ejes" : "All axes",
    allTypes: isEs ? "Todos los tipos" : "All types",
    allAuthorship: isEs ? "Todas las autorias" : "All authorship",
    human: isEs ? "Human" : "Human",
    nonHuman: isEs ? "No humano" : "Non-human",
    allResults: isEs ? "resultados" : "results",
    reset: isEs ? "X reset" : "X reset",
    prev: isEs ? "Anterior" : "Prev",
    next: isEs ? "Siguiente" : "Next",
    page: isEs ? "Pagina" : "Page",
    noResults: isEs ? "No hay resultados para" : "No results for",
    metadataHeaders: {
      title: isEs ? "Titulo" : "Title",
      type: isEs ? "Tipo" : "Type",
      date: isEs ? "Fecha" : "Date",
      axes: isEs ? "Ejes" : "Axes",
    },
  };

  const [query, setQuery] = useState("");
  const [activeLatAm, setActiveLatAm] = useState(false);
  const [activeType, setActiveType] = useState<string | null>(initialType || null);
  const [activeAxis, setActiveAxis] = useState<Axis | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [activeAuthorship, setActiveAuthorship] = useState<AuthorshipFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters =
    query.trim().length > 0 ||
    activeLatAm ||
    Boolean(activeType) ||
    Boolean(activeAxis) ||
    Boolean(activeYear) ||
    activeAuthorship !== "all";

  const resetFilters = () => {
    setQuery("");
    setActiveLatAm(false);
    setActiveType(null);
    setActiveAxis(null);
    setActiveYear(null);
    setActiveAuthorship("all");
    setPage(1);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Extract all unique tags for suggestions
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const item of initialData) {
      if (item.frontmatter.tags) {
        for (const t of item.frontmatter.tags) {
          tags.add(t.toLowerCase());
        }
      }
    }
    return Array.from(tags).slice(0, 10); // Show max 10 popular tags
  }, [initialData]);

  // Extract all unique types
  const allTypes = useMemo(() => {
    const typesSet = new Set<string>();
    for (const item of initialData) typesSet.add(item.frontmatter.type);
    return Array.from(typesSet).sort();
  }, [initialData]);

  const allAxes = useMemo(() => {
    const axesSet = new Set<Axis>();
    for (const item of initialData) {
      for (const axis of item.frontmatter.axes) {
        axesSet.add(axis);
      }
    }
    return Array.from(axesSet).sort();
  }, [initialData]);

  const allYears = useMemo(() => {
    const years = new Set<string>();
    for (const item of initialData) {
      const year = new Date(item.frontmatter.date).getFullYear();
      if (!Number.isNaN(year)) years.add(String(year));
    }
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [initialData]);

  // Filter content
  const filteredData = useMemo(() => {
    let result = [...initialData];

    if (activeLatAm) {
      result = result.filter((item) => {
        const hasAxis = item.frontmatter.axes.some((ax: string) => LATAM_KEYWORDS.includes(ax));
        const hasTag = item.frontmatter.tags && item.frontmatter.tags.some((tag: string) => LATAM_KEYWORDS.includes(tag.toLowerCase()));
        return hasAxis || hasTag;
      });
    }

    if (activeType) {
      result = result.filter((item) => item.frontmatter.type === activeType);
    }

    if (activeAuthorship !== "all") {
      result = result.filter((item) => {
        const mode = item.frontmatter.authorship_mode;
        if (activeAuthorship === "human") {
          return mode === "human";
        }
        return mode !== "human";
      });
    }

    if (activeAxis) {
      result = result.filter((item) => item.frontmatter.axes.includes(activeAxis));
    }

    if (activeYear) {
      result = result.filter((item) => {
        const year = new Date(item.frontmatter.date).getFullYear();
        return String(year) === activeYear;
      });
    }

    if (query.trim()) {
      const ranked = result
        .map((item) => ({ item, score: scoreItem(item, query) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.item.frontmatter.date).getTime() - new Date(a.item.frontmatter.date).getTime();
        });

      return ranked.map((entry) => entry.item);
    }

    return result.sort(
      (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
  }, [query, activeLatAm, activeType, activeAxis, activeYear, activeAuthorship, initialData]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(pageStart, pageStart + PAGE_SIZE);

  const dateLocale = isEs ? "es-CO" : "en-US";

  const pageLabel = `${copy.page} ${safePage}/${totalPages}`;

  return (
    <div className={styles.container}>
      {/* Search Input Box */}
      <div className={styles.searchBox}>
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={copy.searchPlaceholder}
          className={styles.input}
          aria-label="Search content"
        />
        <div className={styles.keyboardHint}>{copy.keyboardHint}</div>
      </div>

      <div className={styles.resultsMeta}>
        <span className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
          {filteredData.length} {copy.allResults}
        </span>

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className={styles.resetButton}>
            {copy.reset}
          </button>
        )}

        <div className={styles.viewToggleGroup} role="tablist" aria-label={copy.modes}>
          {(["list", "grid", "metadata"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`${styles.viewToggle} ${viewMode === mode ? styles.viewToggleActive : ""}`}
              onClick={() => {
                setViewMode(mode);
                setPage(1);
              }}
              aria-pressed={viewMode === mode}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Filters Layer */}
      <div className={styles.filterRow}>
        <span className="text-mono text-xs" style={{ opacity: "var(--op-label)" }}>
          {copy.filters}
        </span>

        <button 
          type="button"
          onClick={() => {
            setActiveLatAm(!activeLatAm);
            setPage(1);
          }}
          className={`${styles.filterPill} ${activeLatAm ? styles.filterPillActive : ""}`}
          aria-pressed={activeLatAm}
        >
          [ LatAm ]
        </button>

        {allTypes.map((type) => (
          <button 
            key={type}
            type="button"
            onClick={() => {
              setActiveType(activeType === type ? null : type);
              setPage(1);
            }}
            className={`${styles.filterPill} ${activeType === type ? styles.filterPillActive : ""}`}
            aria-pressed={activeType === type}
          >
            {type}
          </button>
        ))}

        <select
          value={activeAuthorship}
          onChange={(event) => {
            const next = event.target.value as AuthorshipFilter;
            setActiveAuthorship(next);
            setPage(1);
          }}
          className={styles.filterSelect}
          aria-label="Filter by authorship"
        >
          <option value="all">{copy.allAuthorship}</option>
          <option value="human">{copy.human}</option>
          <option value="non-human">{copy.nonHuman}</option>
        </select>

        <select
          value={activeAxis || ""}
          onChange={(event) => {
            const next = event.target.value;
            setActiveAxis(next && isAxis(next) ? next : null);
            setPage(1);
          }}
          className={styles.filterSelect}
          aria-label="Filter by axis"
        >
          <option value="">{copy.allAxes}</option>
          {allAxes.map((axis) => (
            <option key={axis} value={axis}>
              {axis}
            </option>
          ))}
        </select>

        <select
          value={activeYear || ""}
          onChange={(event) => {
            setActiveYear(event.target.value || null);
            setPage(1);
          }}
          className={styles.filterSelect}
          aria-label="Filter by year"
        >
          <option value="">{copy.allYears}</option>
          {allYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Smart Suggestions */}
      {!query && allTags.length > 0 && (
        <div className={styles.suggestions}>
          <span className="text-mono" style={{ fontSize: "0.65rem", opacity: "var(--op-label)" }}>
            {copy.tags}
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setQuery(tag);
                setPage(1);
              }}
              className={styles.suggestionTag}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {viewMode === "grid" ? (
        <div className={styles.grid} style={{ marginTop: "var(--space-2xl)" }}>
          {paginatedData.map((item) => (
            <Link key={item.slug} href={`/${locale}/journal/${item.slug}`} className={`${styles.gridCard} row-hover`}>
              <p className="text-mono text-xs" style={{ opacity: "var(--op-secondary)", marginBottom: "var(--space-sm)" }}>
                {item.frontmatter.type}
              </p>
              <h2 className={styles.gridTitle}>{item.frontmatter.title}</h2>
              <p className={styles.gridMeta}>
                {new Date(item.frontmatter.date).toLocaleDateString(dateLocale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {item.frontmatter.description && (
                <p className={styles.gridDescription}>{item.frontmatter.description}</p>
              )}
            </Link>
          ))}
        </div>
      ) : viewMode === "metadata" ? (
        <div className={styles.metadataTable} style={{ marginTop: "var(--space-2xl)" }}>
          <div className={styles.metadataHeader}>
            <span>{copy.metadataHeaders.title}</span>
            <span>{copy.metadataHeaders.type}</span>
            <span>{copy.metadataHeaders.date}</span>
            <span>{copy.metadataHeaders.axes}</span>
          </div>
          {paginatedData.map((item) => (
            <Link key={item.slug} href={`/${locale}/journal/${item.slug}`} className={`${styles.metadataRow} row-hover`}>
              <span className={styles.metadataTitle}>{item.frontmatter.title}</span>
              <span>{item.frontmatter.type}</span>
              <time dateTime={item.frontmatter.date}>
                {new Date(item.frontmatter.date).toLocaleDateString(dateLocale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span>{item.frontmatter.axes.join(", ")}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={listStyles.list} style={{ marginTop: "var(--space-2xl)" }}>
          {paginatedData.map((item) => (
            <Link key={item.slug} href={`/${locale}/journal/${item.slug}`} className={`${listStyles.item} row-hover`}>
              <div className={listStyles.itemHeader}>
                <h2 className={listStyles.title}>{item.frontmatter.title}</h2>
                <div className={listStyles.metadata}>
                  <span className={listStyles.tag}>{item.frontmatter.type}</span>
                  <time dateTime={item.frontmatter.date}>
                    {new Date(item.frontmatter.date).toLocaleDateString(dateLocale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  {item.frontmatter.reading_time && <span>{item.frontmatter.reading_time} min</span>}
                </div>
              </div>
              {item.frontmatter.description && (
                <p className={listStyles.description}>{item.frontmatter.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}

      {filteredData.length === 0 && (
        <div className={styles.emptyState}>
          <p className="text-mono" style={{ opacity: "var(--op-secondary)" }}>
            [0] {copy.noResults} &quot;{query}&quot;.
          </p>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage <= 1}
            className={styles.paginationButton}
          >
            {copy.prev}
          </button>
          <span className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
            {pageLabel}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage >= totalPages}
            className={styles.paginationButton}
          >
            {copy.next}
          </button>
        </div>
      )}
      </div>
  );
}
