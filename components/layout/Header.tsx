"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LogoMark } from "./LogoMark";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { key: "journal", href: "/journal" },
  { key: "nest", href: "/nest" },
  { key: "library", href: "/library" },
  { key: "resources", href: "/resources" },
  { key: "about", href: "/about" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "es" : "en";

  // Strip locale prefix from pathname for comparison
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={`/${locale}`} className={styles.logo}>
          <LogoMark className={styles.logoMark} />
          <span>HABITAT.md</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const href = `/${locale}${item.href}`;
            const isActive = pathWithoutLocale.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className={styles.controls}>
          <ThemeToggle />
          <Link
            href={`/${otherLocale}${pathWithoutLocale}`}
            className={styles.langToggle}
            aria-label={`Switch to ${otherLocale === "en" ? "English" : "Español"}`}
            lang={otherLocale}
          >
            {otherLocale.toUpperCase()}
          </Link>
        </div>
      </div>
    </header>
  );
}
