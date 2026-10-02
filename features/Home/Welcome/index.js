import Image from '../../../components/Image';
import { SectionHeading } from '../../../components/DesignSystem';

import items from './items';
import wildPlateImage from '../../../public/images/wild-plate.jpg';

const Welcome = () => {
  return (
    <section className='home-welcome section-shell' aria-labelledby='welcome-title'>
      <SectionHeading id='welcome-title' number='01' eyebrow='Alimentación DNAture' title='Comida real, preparada con intención'>
          Una propuesta de alimentación natural que prioriza ingredientes
          reconocibles, equilibrio y acompañamiento para cada mascota.
      </SectionHeading>

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
