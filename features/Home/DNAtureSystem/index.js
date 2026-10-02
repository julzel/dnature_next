import Image from '../../../components/Image';
import { ArrowRight, Check } from "../../../components/Icon";

import Button from '../../../components/Button';

import benefits from './benefits';
import planImage from '../../../public/images/plandna-mobile.jpg';

const systemFeatures = [
  'Ingredientes naturales y proteína de calidad',
  'Porciones adaptadas a las necesidades de tu mascota',
  'Acompañamiento para incorporar su alimentación',
];

const DNAtureSystem = () => {
  return (
    <section
      aria-labelledby='dnature-system-title'
    >
      <div>
        <div>
          <div>
            <Image
              src={planImage}
              alt='Selección de ingredientes naturales utilizados por DNAture'
              sizes='(min-width: 1024px) 46vw, calc(100vw - 32px)'
            />
            <span>Nutrición real</span>
          </div>

          <div>
            <p>El sistema DNAture</p>
            <h2 id='dnature-system-title'>Una alimentación pensada para su bienestar</h2>
            <p>
              Te ayudamos a incorporar alimentación natural de una forma
              sencilla, con productos frescos y una porción adecuada para tu
              mascota.
            </p>

            <ul>
              {systemFeatures.map((feature) => (
                <li key={feature}>
                  <span aria-hidden='true'>
                    <Check size={16} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div>
              <Button
                href='/calculadora'
                size='large'
                iconEnd={<ArrowRight size={18} aria-hidden='true' />}
              >
                Calculá su porción
              </Button>
              <Button href='/plan-dnature' variant='tertiary' size='large'>
                Conocé el plan DNAture
              </Button>
            </div>
          </div>
        </div>

        <div>
          <p>Bienestar integral</p>
          <h3 id='dnature-benefits-title'>Beneficios que buscamos acompañar</h3>
          <p>
            Cada mascota es diferente. Su alimentación debe considerar su
            etapa de vida, condición corporal y necesidades particulares.
          </p>
        </div>

        <ol
          aria-labelledby='dnature-benefits-title'
        >
          {benefits.map((benefit, index) => (
            <li key={benefit.title}>
              <span aria-hidden='true'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4>{benefit.title}</h4>
              <p>{benefit.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default DNAtureSystem;
