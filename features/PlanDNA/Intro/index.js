import Button from '../../../components/Button';

const Intro = ({ start }) => (
  <div className='plan-intro'>
    <h1>¡Hola!</h1>
    <p>
      A continuación te haremos algunas preguntas para conocer mejor a tu
      mascota y poder recomendarte el mejor plan para ella.
    </p>
    <Button onClick={start}>Comencemos</Button>
  </div>
);

export default Intro;
