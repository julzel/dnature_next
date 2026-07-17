import Link from 'next/link';

import styles from './Fallback.module.scss';

const NotFound = () => (
  <div className={styles.fallback}>
    <div className={styles.panel}>
      <h1 className={styles.title}>Página no encontrada</h1>
      <p className={styles.copy}>
        Lo sentimos, la página que buscas no está disponible.
      </p>
      <Link className={styles.button} href='/'>
        Volver al inicio
      </Link>
    </div>
  </div>
);

export default NotFound;
