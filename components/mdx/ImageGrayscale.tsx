import Image from "next/image";
import styles from "./ImageGrayscale.module.css";

type Props = {
  src: string;
  alt: string;
  caption?: string;
};

export function ImageGrayscale({ src, alt, caption }: Props) {
  return (
    <figure className={styles.figure}>
      <div className={styles.imageWrapper}>
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className={styles.image}
        />
      </div>
      {caption && (
        <figcaption className={styles.caption}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
