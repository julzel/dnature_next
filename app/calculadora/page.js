import Calculator from '../../features/Calculator';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: 'Calcula la porción ideal de comida para tu mascota',
  description:
    'Calcula la ración diaria de comida natural adecuada para tu mascota.',
  path: '/calculadora',
});

const CalculatorPage = () => <Calculator />;

export default CalculatorPage;
