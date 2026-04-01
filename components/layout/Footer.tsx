import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <span className="text-mono text-xs">2026</span>
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
