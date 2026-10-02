import Button from '../components/Button';

const NotFound = () => (
  <div className='page-state'>
    <div>
      <h1>Página no encontrada</h1>
      <p>
        Lo sentimos, la página que buscas no está disponible.
      </p>
      <Button href='/' variant='primary'>
        Volver al inicio
      </Button>
    </div>
  </div>
);

export default NotFound;
