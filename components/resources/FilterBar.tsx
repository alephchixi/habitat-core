import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./FilterBar.module.css";

type Props = {
  activeType: string;
  activeView: "list" | "grid";
  categories: string[];
};

export function FilterBar({ activeType, activeView, categories }: Props) {
  const t = useTranslations("common");
  const tr = useTranslations("resources.categories");

  const buildHref = (type: string) => `?type=${type}&view=${activeView}&page=1`;

  return (
    <div className={styles.filterBar}>
      <Link
        href={buildHref("all")}
        scroll={false}
        className={`${styles.filterPill} ${activeType === "all" ? styles.active : ""}`}
        aria-current={activeType === "all" ? "page" : undefined}
      >
        {t("filterAll")}
      </Link>
      
      {categories.map((cat) => (
        <Link
          key={cat}
          href={buildHref(cat)}
          scroll={false}
          className={`${styles.filterPill} ${activeType === cat ? styles.active : ""}`}
          aria-current={activeType === cat ? "page" : undefined}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {tr(cat as any) || cat}
        </Link>
      ))}
    </div>
  );
}
