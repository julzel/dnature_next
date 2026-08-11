import Calculator from '../../features/Calculator';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: 'Calculadora de porciones para perros',
  description:
    'Calculá una estimación de la porción diaria para las Recetas completas DNAture según la etapa de vida, condición, actividad y peso de tu perro.',
  path: '/calculadora',
  image: '/calculator/calculadora.jpg',
  imageAlt: 'Tazón DNAture con ingredientes de alimentación natural',
});

const CalculatorPage = () => <Calculator />;

export default CalculatorPage;
