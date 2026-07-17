'use client';

import { useEffect } from 'react';

import styles from './Fallback.module.scss';

const Error = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.fallback} role='alert'>
      <div className={styles.panel}>
        <h1 className={styles.title}>No pudimos cargar esta página</h1>
        <p className={styles.copy}>
          Inténtalo de nuevo. Si el problema continúa, vuelve más tarde.
        </p>
        <button className={styles.button} onClick={reset} type='button'>
          Reintentar
        </button>
      </div>
    </div>
  );
};

export default Error;
