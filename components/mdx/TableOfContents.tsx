"use client";

import { useEffect, useState } from "react";
import styles from "./TableOfContents.module.css";

export type TOCItem = {
  id: string;
  label: string;
  level: number;
};

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className={styles.toc} aria-label="Table of Contents">
      <div className={styles.label}>TOC</div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li 
            key={item.id} 
            className={styles.item}
            style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
          >
            <a 
              href={`#${item.id}`} 
              className={`${styles.link} ${activeId === item.id ? styles.active : ""}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(item.id);
                history.pushState(null, "", `#${item.id}`);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
