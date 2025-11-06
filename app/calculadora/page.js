import React from 'react';
import Page from '../../components/Page';
import Calculator from '../../features/Calculator';

export const metadata = {
  title: 'Calcula la porción ideal de comida para tu mascota',
  description: 'Calculadora de porciones DNAture',
};

export default function CalculadoraPage() {
  return (
    <Page title="Calcula la porción ideal de comida para tu mascota">
      <Calculator />
    </Page>
  );
}
