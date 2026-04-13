import type { ReactNode } from "react";
import { FOOTER_SOCIAL_LINKS } from "@/lib/social";
import styles from "./Footer.module.css";

const SOCIAL_ICONS: Record<string, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.56 8.64H3.28V20h3.28V8.64Zm.2-3.52C6.74 4.08 5.99 3.3 4.94 3.3C3.89 3.3 3.14 4.08 3.14 5.12C3.14 6.14 3.87 6.94 4.9 6.94H4.94C6.01 6.94 6.76 6.14 6.76 5.12ZM20.86 20h-3.28v-6.08c0-1.53-.55-2.57-1.92-2.57c-1.05 0-1.67.71-1.95 1.39c-.1.24-.13.58-.13.92V20H10.3s.04-10.3 0-11.36h3.28v1.61c.44-.68 1.22-1.65 2.97-1.65c2.17 0 3.81 1.42 3.81 4.48V20Z" fill="currentColor" />
    </svg>
  ),
  substack: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 3.5h16v2.3H4V3.5Zm0 4.1h16V10H4V7.6Zm0 4.2l8 4.1l8-4.1V20H4v-8.2Z" fill="currentColor" />
    </svg>
  ),
  bluesky: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026" fill="currentColor" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M18.24 2H21.5L14.38 10.15L22.75 22H16.19L11.05 14.73L4.71 22H1.45L9.07 13.27L1 2H7.73L12.37 8.6L18.24 2Z" fill="currentColor" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2C6.48 2 2 6.58 2 12.23C2 16.75 4.87 20.59 8.84 21.95C9.34 22.05 9.52 21.73 9.52 21.46C9.52 21.22 9.51 20.43 9.5 19.56C6.73 20.18 6.14 18.34 6.14 18.34C5.68 17.14 5.03 16.82 5.03 16.82C4.12 16.18 5.1 16.19 5.1 16.19C6.1 16.26 6.63 17.25 6.63 17.25C7.52 18.82 8.97 18.37 9.54 18.1C9.63 17.44 9.89 16.99 10.18 16.73C7.97 16.47 5.65 15.59 5.65 11.68C5.65 10.56 6.04 9.65 6.68 8.95C6.58 8.69 6.23 7.66 6.78 6.27C6.78 6.27 7.62 6 9.5 7.3C10.3 7.07 11.15 6.95 12 6.95C12.85 6.95 13.7 7.07 14.5 7.3C16.38 6 17.22 6.27 17.22 6.27C17.77 7.66 17.42 8.69 17.32 8.95C17.96 9.65 18.35 10.56 18.35 11.68C18.35 15.6 16.02 16.47 13.81 16.72C14.18 17.05 14.51 17.71 14.51 18.73C14.51 20.2 14.5 21.13 14.5 21.46C14.5 21.73 14.68 22.06 15.19 21.95C19.13 20.59 22 16.75 22 12.23C22 6.58 17.52 2 12 2Z" fill="currentColor" />
    </svg>
  ),
};

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <p className={`text-mono text-xs ${styles.openSource}`}>
            v0.5 <a
              href="https://github.com/alephchixi/habitat-core"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openSourceLink}
            >
              open source
            </a>{" "}
            2026
          </p>
        </div>
        <div className={`${styles.col} ${styles.socialsWrap}`}>
          <div className={styles.socialLinks} aria-label="Social links">
            {FOOTER_SOCIAL_LINKS.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={item.label}
                title={item.label}
              >
                <span className={styles.socialIcon}>{SOCIAL_ICONS[item.key]}</span>
              </a>
            ))}
          </div>
        </div>
        <div className={`${styles.col} ${styles.colEnd}`}>
          <p className={`text-mono text-xs ${styles.credit}`}>
            /♡ @{" "}
            <a
              href="https://alephchixi.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.creditLink}
            >
              aleph::ch&apos;ixi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
