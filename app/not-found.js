import Button from '../components/Button';

import styles from './Fallback.module.scss';

const NotFound = () => (
  <div className={styles.fallback}>
    <div className={styles.panel}>
      <h1 className={styles.title}>Página no encontrada</h1>
      <p className={styles.copy}>
        Lo sentimos, la página que buscas no está disponible.
      </p>
      <Button href='/' variant='primary'>
        Volver al inicio
      </Button>
    </div>
  </div>
);

export default NotFound;
