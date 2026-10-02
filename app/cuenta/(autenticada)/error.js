'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

import Button from '../../../components/Button';

const AccountError = ({ error, reset }) => {
  useEffect(() => {
    console.error('Customer account route failed', {
      digest: error?.digest,
      name: error?.name,
    });
  }, [error]);

  return (
    <div>
      <div>
        <section>
          <span aria-hidden='true'>
            <AlertTriangle size={32} />
          </span>
          <p>Mi DNAture</p>
          <h1>No pudimos cargar tu cuenta</h1>
          <p>
            Tus datos no se modificaron. Intentá nuevamente o volvé al inicio.
          </p>
          <div>
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
