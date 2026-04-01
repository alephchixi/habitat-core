"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./ActivityFeed.module.css";

export type ActivityItem = {
  slug: string;
  title: string;
  type: string;
  author: string;
  date: string;
};

type Props = {
  items: ActivityItem[];
  locale: string;
};

function formatTimeAgo(date: string, locale: string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (Number.isNaN(days)) return date;
  if (days <= 0) return locale === "es" ? "hoy" : "today";
  if (days === 1) return locale === "es" ? "hace 1 dia" : "1 day ago";
  return locale === "es" ? `hace ${days} dias` : `${days} days ago`;
}

export function ActivityFeed({ items, locale }: Props) {
  const isEs = locale === "es";
  const [activeType, setActiveType] = useState<string>("all");
  const [activeAuthor, setActiveAuthor] = useState<string>("all");

  const types = useMemo(() => {
    const values = new Set(items.map((item) => item.type));
    return ["all", ...Array.from(values).sort()];
  }, [items]);

  const authors = useMemo(() => {
    const values = new Set(items.map((item) => item.author));
    return ["all", ...Array.from(values).sort()];
  }, [items]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchType = activeType === "all" || item.type === activeType;
      const matchAuthor = activeAuthor === "all" || item.author === activeAuthor;
      return matchType && matchAuthor;
    });
  }, [items, activeType, activeAuthor]);

  return (
    <section className={styles.wrapper} aria-label={isEs ? "Feed de actividad" : "Activity feed"}>
      <div className={styles.controls}>
        <select
          value={activeType}
          onChange={(event) => setActiveType(event.target.value)}
          className={styles.select}
          aria-label={isEs ? "Filtrar por tipo" : "Filter by type"}
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? (isEs ? "todos los tipos" : "all types") : type}
            </option>
          ))}
        </select>

        <select
          value={activeAuthor}
          onChange={(event) => setActiveAuthor(event.target.value)}
          className={styles.select}
          aria-label={isEs ? "Filtrar por autor" : "Filter by author"}
        >
          {authors.map((author) => (
            <option key={author} value={author}>
              {author === "all" ? (isEs ? "todos los autores" : "all authors") : author}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.list}>
        {visibleItems.map((item) => (
          <Link key={`${item.slug}-${item.date}`} href={`/${locale}/journal/${item.slug}`} className={`${styles.row} row-hover`}>
            <span className={styles.timestamp}>{formatTimeAgo(item.date, locale)}</span>
            <span className={styles.eventText}>
              {isEs ? "publicado" : "published"} <strong>{item.title}</strong>
            </span>
            <span className={styles.meta}>
              {item.type} · @{item.author}
            </span>
          </Link>
        ))}

        {visibleItems.length === 0 && (
          <p className="text-mono" style={{ opacity: "var(--op-secondary)", padding: "var(--space-md) 0" }}>
            {isEs ? "Sin actividad para esos filtros." : "No activity for selected filters."}
          </p>
        )}
      </div>
    </section>
  );
}
