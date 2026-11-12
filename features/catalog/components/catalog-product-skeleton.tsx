import styles from "./catalog-page.module.css";

export function CatalogProductSkeleton() {
  return (
    <li className={`${styles.preview} ${styles.previewSkeleton}`}>
      <article>
        <div className={`${styles.previewImage} ${styles.skeletonImage}`} />
        <div className={styles.previewDetails}>
          <span className={`${styles.skeletonBlock} ${styles.skeletonCategory}`} />
          <span className={`${styles.skeletonBlock} ${styles.skeletonName}`} />
          <span className={`${styles.skeletonBlock} ${styles.skeletonNameShort}`} />
          <span className={`${styles.skeletonBlock} ${styles.skeletonPrice}`} />
        </div>
        <div className={styles.skeletonFacts}>
          <span className={`${styles.skeletonBlock} ${styles.skeletonFactsLabel}`} />
          <span className={`${styles.skeletonBlock} ${styles.skeletonFactsIcon}`} />
        </div>
      </article>
    </li>
  );
}
