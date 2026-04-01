import styles from "./Footnote.module.css";

type Props = {
  id: string;
  children: React.ReactNode;
};

export function Footnote({ id, children }: Props) {
  return (
    <div id={`fn-${id}`} className={styles.footnote}>
      <span className={styles.anchor}>[{id}]</span> {children}
    </div>
  );
}
