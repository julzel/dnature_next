import styles from "./catalog-page.module.css";

export function CatalogIntro() {
  return (
    <section className={styles.intro} aria-labelledby="catalog-title">
      <div className={styles.introInner}>
        <p className={styles.eyebrow}><span aria-hidden="true" /> Explorá DNAture</p>
        <h1 id="catalog-title">Productos <span>DNAture</span></h1>
        <p>Encontrá lo que buscás por familia o por nombre. Información clara para explorar a tu ritmo.</p>
      </div>
      <div className={styles.colorRail} aria-hidden="true"><span /><span /><span /><span /><span /></div>
    </section>
  );
}
