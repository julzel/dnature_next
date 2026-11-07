import styles from "./best-selling-snacks.module.css";

export function BestSellingSnacksLoading() {
  return (
    <div className={styles.content} role="status" aria-label="Cargando snacks deshidratados">
      <div className={styles.intro}>
        <div>
          <p className={styles.kicker}>Favoritos recientes</p>
          <h2>Snacks deshidratados más vendidos</h2>
        </div>
      </div>
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => <div className={styles.placeholder} key={index} />)}
      </div>
    </div>
  );
}
