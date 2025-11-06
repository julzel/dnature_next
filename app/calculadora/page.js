import React from 'react';
import Page from '../../components/Page';
import Calculator from '../../features/Calculator';

export const metadata = {
  title: 'Calculadora de porciones',
  description: 'Calcula la porción ideal de comida para tu mascota según su peso, edad y nivel de actividad. Herramienta gratuita de DNAture.',
  alternates: {
    canonical: '/calculadora',
  },
};

export default function CalculadoraPage() {
  return (
    <Page title="Calcula la porción ideal de comida para tu mascota">
      <Calculator />
    </Page>
  );
}
