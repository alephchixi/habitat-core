import styles from "./Quote.module.css";

type Props = {
  text: string;
  author: string;
  source?: string;
  year?: string;
};

export function Quote({ text, author, source, year }: Props) {
  return (
    <figure className={styles.quoteFigure}>
      <blockquote className={styles.blockquote}>
        &quot;{text}&quot;
      </blockquote>
      <figcaption className={styles.figcaption}>
        — <span className={styles.author}>{author}</span>
        {source && <cite className={styles.source}>, {source}</cite>}
        {year && <span className={styles.year}> ({year})</span>}
      </figcaption>
    </figure>
  );
}
