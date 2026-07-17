import Calculator from '../../features/Calculator';

export const metadata = {
  title: 'Calcula la porción ideal de comida para tu mascota',
  description:
    'Calcula la ración diaria de comida natural adecuada para tu mascota.',
  alternates: { canonical: '/calculadora' },
};

const CalculatorPage = () => <Calculator />;

export default CalculatorPage;
