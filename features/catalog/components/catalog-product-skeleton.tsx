import styles from "./catalog-page.module.css";

export function CatalogProductSkeleton({ showCartControl = true }: { showCartControl?: boolean }) {
  return (
    <li className={`${styles.preview} ${styles.previewSkeleton}`}>
      <article className={showCartControl ? styles.catalogArticle : undefined}>
        <div className={`${styles.previewImage} ${styles.skeletonImage}`}>
          <span className={`${styles.skeletonBlock} ${styles.skeletonCategory}`} />
        </div>
        <div className={`${styles.previewDetails} ${showCartControl ? styles.catalogDetails : ""}`}>
          <span className={`${styles.skeletonBlock} ${styles.skeletonName}`} />
          <span className={`${styles.skeletonBlock} ${styles.skeletonNameShort}`} />
          <span className={`${styles.skeletonBlock} ${styles.skeletonPrice}`} />
          {showCartControl && <div className={`${styles.skeletonBlock} ${styles.skeletonCartControl}`} />}
        </div>
        <div className={styles.skeletonFacts}>
          <span className={`${styles.skeletonBlock} ${styles.skeletonFactsLabel}`} />
          <span className={`${styles.skeletonBlock} ${styles.skeletonFactsIcon}`} />
        </div>
      </article>
    </li>
  );
}
