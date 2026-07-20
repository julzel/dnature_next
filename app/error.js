'use client';

import { useEffect } from 'react';

import styles from './Fallback.module.scss';
import { reportClientError } from '../util/monitoring';
import Button from '../components/Button';

const Error = ({ error, reset }) => {
  useEffect(() => {
    reportClientError(error, { source: 'app-error' });
  }, [error]);

  return (
    <div className={styles.fallback} role='alert'>
      <div className={styles.panel}>
        <h1 className={styles.title}>No pudimos cargar esta página</h1>
        <p className={styles.copy}>
          Inténtalo de nuevo. Si el problema continúa, vuelve más tarde.
        </p>
        <Button onClick={reset}>
          Reintentar
        </Button>
      </div>
    </div>
  );
};

export default Error;
