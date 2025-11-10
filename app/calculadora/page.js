import React from 'react';
import Page from '../../components/Page';
import Calculator from '../../features/Calculator';
import JsonLd from '../../components/JsonLd';
import { generateBreadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Calculadora de porciones',
  description: 'Calcula la porción ideal de comida para tu mascota según su peso, edad y nivel de actividad. Herramienta gratuita de DNAture.',
  openGraph: {
    title: 'Calculadora de porciones para mascotas | DNAture',
    description: 'Calcula la porción ideal de comida para tu mascota',
    images: [
      {
        url: '/images/dnatureplate.jpg',
        width: 1200,
        height: 630,
        alt: 'Calculadora de porciones DNAture',
      },
    ],
  },
  alternates: {
    canonical: '/calculadora',
  },
};

export default function CalculadoraPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Calculadora', url: '/calculadora' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} id="breadcrumb-schema" />
      <Page title="Calcula la porción ideal de comida para tu mascota">
        <Calculator />
      </Page>
    </>
  );
}
