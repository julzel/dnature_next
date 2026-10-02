import Image from '../../../components/Image';

import items from './items';
import wildPlateImage from '../../../public/images/wild-plate.jpg';

const Welcome = () => {
  return (
    <section aria-labelledby='welcome-title'>
      <div>
        <p>Alimentación DNAture</p>
        <h2 id='welcome-title'>Comida real, preparada con intención</h2>
        <p>
          Una propuesta de alimentación natural que prioriza ingredientes
          reconocibles, equilibrio y acompañamiento para cada mascota.
        </p>
      </div>

      <figure>
        <Image
          src={wildPlateImage}
          alt='Plato de alimentación natural con distintas proteínas e ingredientes frescos'
          sizes='(min-width: 1200px) 1160px, calc(100vw - 32px)'
        />
        <figcaption>
          <span>Ingredientes que podés reconocer</span>
          Una selección variada para construir una alimentación con propósito.
        </figcaption>
      </figure>

      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <div>
              <Image
                src={item.icon}
                alt=''
                aria-hidden='true'
                width={item.width}
                height={item.height}
              />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Welcome;
