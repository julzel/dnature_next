'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

import Button from '../../../components/Button';
import { accountStyles as styles } from '../../../features/Account';

const AccountError = ({ error, reset }) => {
  useEffect(() => {
    console.error('Customer account route failed', {
      digest: error?.digest,
      name: error?.name,
    });
  }, [error]);

  return (
    <div className={styles.accountPage}>
      <div className={styles.signedOutWrap}>
        <section className={styles.signedOutCard}>
          <span className={styles.roundIcon} aria-hidden='true'>
            <AlertTriangle size={32} />
          </span>
          <p className={styles.eyebrow}>Mi DNAture</p>
          <h1>No pudimos cargar tu cuenta</h1>
          <p>
            Tus datos no se modificaron. Intentá nuevamente o volvé al inicio.
          </p>
          <div className={styles.buttonRowCentered}>
            <Button onClick={reset}>Intentar de nuevo</Button>
            <Button href='/' variant='secondary'>
              Volver al inicio
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountError;
