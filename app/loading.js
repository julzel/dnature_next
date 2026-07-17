import styles from './Fallback.module.scss';

const Loading = () => (
  <div className={styles.fallback} aria-busy='true' aria-live='polite'>
    <div className={styles.panel}>
      <h1 className={styles.title}>Cargando…</h1>
      <p className={styles.copy}>Estamos preparando esta página.</p>
    </div>
  </div>
);

export default Loading;
