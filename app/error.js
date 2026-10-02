'use client';

import { useEffect } from 'react';

import { reportClientError } from '../util/monitoring';
import Button from '../components/Button';

const Error = ({ error, reset }) => {
  useEffect(() => {
    reportClientError(error, { source: 'app-error' });
  }, [error]);

  return (
    <div role='alert'>
      <div>
        <h1>No pudimos cargar esta página</h1>
        <p>
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
