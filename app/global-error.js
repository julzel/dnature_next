'use client';

import { useEffect } from 'react';

import { reportClientError } from '../util/monitoring';
import Button from '../components/Button';

const GlobalError = ({ error, reset }) => {
  useEffect(() => {
    reportClientError(error, { source: 'global-error' });
  }, [error]);

  return (
    <html lang='es-CR'>
      <body>
        <main>
          <h1>Ocurrió un error inesperado</h1>
          <p>Inténtalo de nuevo. Si el problema continúa, vuelve más tarde.</p>
          <Button onClick={reset}>
            Reintentar
          </Button>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
