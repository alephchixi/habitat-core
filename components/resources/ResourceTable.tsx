import { useTranslations } from "next-intl";
import type { LinkItem } from "@/lib/types";
import styles from "./ResourceTable.module.css";

type ViewMode = "list" | "grid";

type Props = {
  items: LinkItem[];
  viewMode: ViewMode;
};

const CATEGORY_KEYS: Record<LinkItem["type"], "herramientas" | "editoriales" | "portales" | "plataformas" | "habitat"> = {
  herramientas: "herramientas",
  editoriales: "editoriales",
  portales: "portales",
  plataformas: "plataformas",
  habitat: "habitat",
};

function getDescription(item: LinkItem): string {
  const raw = item.description?.trim();
  if (raw) return raw;
  return `Curated ${item.type} resource for research and practice.`;
}

export function ResourceTable({ items, viewMode }: Props) {
  const t = useTranslations("common");
  const tr = useTranslations("resources.categories");

  const getCategoryLabel = (type: LinkItem["type"]) => tr(CATEGORY_KEYS[type]);

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className="text-mono">{t("noResults")}</p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className={styles.grid}>
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.gridCard} row-hover`}
          >
            <span className={styles.gridTag}>{getCategoryLabel(item.type)}</span>
            <h2 className={styles.gridTitle}>{item.label}</h2>
            <p className={styles.gridDescription}>{getDescription(item)}</p>
            <p className={styles.gridSource}>{item.source}</p>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.table}>
      {/* Header Row (Desktop only) */}
      <div className={`${styles.row} ${styles.headerRow}`}>
        <div className={styles.cellTitle}>Resource</div>
        <div className={styles.cellCategory}>Category</div>
        <div className={styles.cellDescription}>Description</div>
        <div className={styles.cellSource}>Source</div>
      </div>

      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.row} row-hover`}
        >
          <div className={styles.cellTitle}>
            <strong>{item.label}</strong>
          </div>
          <div className={styles.cellCategory}>
            <span className={styles.tag}>
              {getCategoryLabel(item.type)}
            </span>
          </div>
          <div className={styles.cellDescription}>{getDescription(item)}</div>
          <div className={`${styles.cellSource} text-mono text-xs link-subtle`}>
            {item.source}
          </div>
        </a>
      ))}
    </div>
  );
}
