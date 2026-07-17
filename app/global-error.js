'use client';

import { useEffect } from 'react';

const GlobalError = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang='es-CR'>
      <body>
        <main>
          <h1>Ocurrió un error inesperado</h1>
          <p>Inténtalo de nuevo. Si el problema continúa, vuelve más tarde.</p>
          <button onClick={reset} type='button'>
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
