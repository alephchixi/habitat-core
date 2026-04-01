"use client";

import { useMemo, useState } from "react";
import type { Axis, LibraryItem, LibraryItemType } from "@/lib/types";
import styles from "./LibraryClient.module.css";

type ViewMode = "list" | "metadata";

const PAGE_SIZE = 12;
const AXIS_ORDER: Axis[] = ["habitat", "ethics", "ecology", "spirit", "cosmotechnics", "lab"];
const TYPE_OPTIONS: LibraryItemType[] = ["book", "paper", "concept"];

type InitialFilters = {
  query?: string;
  type?: string;
  axis?: string;
  year?: string;
  region?: string;
  theme?: string;
  bundle?: string;
  view?: string;
};

function isAxis(value: string | undefined): value is Axis {
  return Boolean(value && AXIS_ORDER.includes(value as Axis));
}

function isType(value: string | undefined): value is LibraryItemType {
  return Boolean(value && TYPE_OPTIONS.includes(value as LibraryItemType));
}

function scoreByYear(year?: string): number {
  const parsed = Number(year);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function LibraryClient({
  initialData,
  locale,
  initialFilters,
  bundleItemIds = [],
}: {
  initialData: LibraryItem[];
  locale: string;
  initialFilters?: InitialFilters;
  bundleItemIds?: string[];
}) {
  const isEs = locale === "es";
  const copy = {
    filters: isEs ? "FILTROS" : "FILTERS",
    searchPlaceholder: isEs
      ? "Buscar por titulo, autor, tema o concepto..."
      : "Search by title, author, theme, or concept...",
    allTypes: isEs ? "todos los tipos" : "all types",
    allAxes: isEs ? "todos los ejes" : "all axes",
    allYears: isEs ? "todos los anos" : "all years",
    allRegions: isEs ? "todas las regiones" : "all regions",
    allThemes: isEs ? "todos los temas" : "all themes",
    allBundles: isEs ? "todos los bundles" : "all bundles",
    reset: isEs ? "X reset" : "X reset",
    noResults: isEs ? "Sin coincidencias para los filtros actuales." : "No matches for current filters.",
    list: isEs ? "lista" : "list",
    metadata: isEs ? "metadata" : "metadata",
    page: isEs ? "Pagina" : "Page",
    prev: isEs ? "Anterior" : "Prev",
    next: isEs ? "Siguiente" : "Next",
    results: isEs ? "resultados" : "results",
    unknownRegion: isEs ? "sin region" : "unknown region",
    headers: {
      title: isEs ? "Titulo" : "Title",
      type: isEs ? "Tipo" : "Type",
      year: isEs ? "Ano" : "Year",
      region: isEs ? "Region" : "Region",
      themes: isEs ? "Temas" : "Themes",
    },
  };

  const initialQuery = initialFilters?.query || "";
  const initialType = isType(initialFilters?.type) ? initialFilters.type : "all";
  const initialAxis = isAxis(initialFilters?.axis) ? initialFilters.axis : "all";
  const initialYear = initialFilters?.year || "all";
  const initialRegion = initialFilters?.region || "all";
  const initialTheme = initialFilters?.theme || "all";
  const initialBundle = initialFilters?.bundle || "all";
  const initialView = initialFilters?.view === "metadata" ? "metadata" : "list";

  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<LibraryItemType | "all">(initialType);
  const [activeAxis, setActiveAxis] = useState<Axis | "all">(initialAxis);
  const [activeYear, setActiveYear] = useState<string>(initialYear);
  const [activeRegion, setActiveRegion] = useState<string>(initialRegion);
  const [activeTheme, setActiveTheme] = useState<string>(initialTheme);
  const [activeBundle, setActiveBundle] = useState<string>(initialBundle);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [page, setPage] = useState(1);

  const years = useMemo(() => {
    const values = new Set<string>();
    for (const item of initialData) {
      if (item.year) values.add(item.year);
    }
    return Array.from(values).sort((a, b) => Number(b) - Number(a));
  }, [initialData]);

  const regions = useMemo(() => {
    const values = new Set<string>();
    for (const item of initialData) {
      if (item.region) values.add(item.region);
    }
    return Array.from(values).sort();
  }, [initialData]);

  const themes = useMemo(() => {
    const values = new Set<string>();
    for (const item of initialData) {
      for (const theme of item.themes || []) {
        values.add(theme);
      }
    }
    return Array.from(values).sort();
  }, [initialData]);

  const bundleIds = useMemo(() => new Set(bundleItemIds), [bundleItemIds]);

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();

    return initialData
      .filter((item) => {
        if (activeType !== "all" && item.type !== activeType) return false;
        if (activeAxis !== "all" && !item.axes.includes(activeAxis)) return false;
        if (activeYear !== "all" && item.year !== activeYear) return false;
        if (activeRegion !== "all" && item.region !== activeRegion) return false;
        if (activeTheme !== "all" && !(item.themes || []).includes(activeTheme)) return false;
        if (activeBundle !== "all" && bundleIds.size > 0 && !bundleIds.has(item.id)) return false;

        if (!q) return true;

        const title = item.title.toLowerCase();
        const author = item.author_or_source.toLowerCase();
        const description = (item.description[locale as "en" | "es"] || item.description.en).toLowerCase();
        const itemThemes = (item.themes || []).join(" ").toLowerCase();
        const axes = item.axes.join(" ").toLowerCase();

        return (
          title.includes(q) ||
          author.includes(q) ||
          description.includes(q) ||
          itemThemes.includes(q) ||
          axes.includes(q)
        );
      })
      .sort((a, b) => {
        const byYear = scoreByYear(b.year) - scoreByYear(a.year);
        if (byYear !== 0) return byYear;
        return a.title.localeCompare(b.title);
      });
  }, [initialData, activeType, activeAxis, activeYear, activeRegion, activeTheme, activeBundle, query, locale, bundleIds]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(pageStart, pageStart + PAGE_SIZE);

  const resetPage = () => setPage(1);

  const hasActiveFilters =
    query.trim().length > 0 ||
    activeType !== "all" ||
    activeAxis !== "all" ||
    activeYear !== "all" ||
    activeRegion !== "all" ||
    activeTheme !== "all" ||
    activeBundle !== "all";

  const resetFilters = () => {
    setQuery("");
    setActiveType("all");
    setActiveAxis("all");
    setActiveYear("all");
    setActiveRegion("all");
    setActiveTheme("all");
    setActiveBundle("all");
    setPage(1);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            resetPage();
          }}
          placeholder={copy.searchPlaceholder}
          className={styles.searchInput}
          aria-label="Search library"
        />

        <div className={styles.filterRow}>
          <span className="text-mono text-xs" style={{ opacity: "var(--op-label)" }}>
            {copy.filters}
          </span>

          <select
            value={activeType}
            onChange={(event) => {
              setActiveType(event.target.value as LibraryItemType | "all");
              resetPage();
            }}
            className={styles.select}
            aria-label="Filter by type"
          >
            <option value="all">{copy.allTypes}</option>
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={activeAxis}
            onChange={(event) => {
              setActiveAxis(event.target.value as Axis | "all");
              resetPage();
            }}
            className={styles.select}
            aria-label="Filter by axis"
          >
            <option value="all">{copy.allAxes}</option>
            {AXIS_ORDER.map((axis) => (
              <option key={axis} value={axis}>
                {axis}
              </option>
            ))}
          </select>

          <select
            value={activeYear}
            onChange={(event) => {
              setActiveYear(event.target.value);
              resetPage();
            }}
            className={styles.select}
            aria-label="Filter by year"
          >
            <option value="all">{copy.allYears}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={activeRegion}
            onChange={(event) => {
              setActiveRegion(event.target.value);
              resetPage();
            }}
            className={styles.select}
            aria-label="Filter by region"
          >
            <option value="all">{copy.allRegions}</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            value={activeTheme}
            onChange={(event) => {
              setActiveTheme(event.target.value);
              resetPage();
            }}
            className={styles.select}
            aria-label="Filter by theme"
          >
            <option value="all">{copy.allThemes}</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>

          {bundleIds.size > 0 && (
            <select
              value={activeBundle}
              onChange={(event) => {
                setActiveBundle(event.target.value);
                resetPage();
              }}
              className={styles.select}
              aria-label="Filter by bundle"
            >
              <option value="all">{copy.allBundles}</option>
              <option value="active">active bundle</option>
            </select>
          )}

          {hasActiveFilters && (
            <button type="button" onClick={resetFilters} className={styles.resetButton}>
              {copy.reset}
            </button>
          )}

          <div className={styles.viewToggleGroup}>
            {(["list", "metadata"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setViewMode(mode);
                  resetPage();
                }}
                className={`${styles.viewToggle} ${viewMode === mode ? styles.viewToggleActive : ""}`}
                aria-pressed={viewMode === mode}
              >
                {mode === "list" ? copy.list : copy.metadata}
              </button>
            ))}
          </div>
        </div>

        <p className="text-mono text-xs" style={{ opacity: "var(--op-secondary)" }}>
          {filteredData.length} {copy.results}
        </p>
      </div>

      {viewMode === "metadata" ? (
        <div className={styles.metadataTable}>
          <div className={styles.metadataHeader}>
            <span>{copy.headers.title}</span>
            <span>{copy.headers.type}</span>
            <span>{copy.headers.year}</span>
            <span>{copy.headers.region}</span>
            <span>{copy.headers.themes}</span>
          </div>

          {paginatedData.map((item) => (
            <a
              key={item.id}
              href={item.url || "#"}
              target={item.url ? "_blank" : undefined}
              rel={item.url ? "noopener noreferrer" : undefined}
              className={`${styles.metadataRow} row-hover`}
            >
              <span className={styles.metadataTitle}>{item.title}</span>
              <span>{item.type}</span>
              <span>{item.year || "-"}</span>
              <span>{item.region || copy.unknownRegion}</span>
              <span>{(item.themes || []).join(", ") || "-"}</span>
            </a>
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {paginatedData.map((item) => (
            <article key={item.id} className={`${styles.card} row-hover`}>
              <div className={styles.cardHead}>
                <span className={styles.typeTag}>{item.type}</span>
                {item.year && <span className={styles.year}>{item.year}</span>}
              </div>

              <h2 className={styles.title}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-subtle">
                    {item.title} ↗
                  </a>
                ) : (
                  item.title
                )}
              </h2>

              <p className={styles.meta}>
                {item.author_or_source} · {item.region || copy.unknownRegion}
              </p>

              <p className={styles.description}>
                {item.description[locale as "en" | "es"] || item.description.en}
              </p>

              <div className={styles.badges}>
                {item.axes.map((axis) => (
                  <span key={`${item.id}-${axis}`} className={styles.badge}>
                    #{axis}
                  </span>
                ))}
                {(item.themes || []).slice(0, 3).map((theme) => (
                  <span key={`${item.id}-${theme}`} className={styles.badgeMuted}>
                    {theme}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {filteredData.length === 0 && (
        <p className="text-mono" style={{ opacity: "var(--op-secondary)", marginTop: "var(--space-lg)" }}>
          {copy.noResults}
        </p>
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
            {copy.page} {safePage}/{totalPages}
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
