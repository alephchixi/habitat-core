import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <p className={`text-mono text-xs ${styles.openSource}`}>
            <a
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
