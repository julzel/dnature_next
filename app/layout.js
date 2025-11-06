import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.scss';

import Providers from './providers';

export const metadata = {
  metadataBase: new URL('https://dnaturefood.com'),
  title: {
    default: 'DNAture - Nutrición personalizada para tu mascota',
    template: '%s | DNAture',
  },
  description: 'DNAture - Nutrición fisiológica personalizada para tu mascota basada en ADN',
  keywords: ['dnature', 'nutrición canina', 'dieta fisiológica', 'comida para perros', 'comida para gatos', 'alimentación personalizada', 'ADN canino', 'Costa Rica'],
  authors: [{ name: 'DAture' }],
  creator: 'DNAture',
  publisher: 'DNAture',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: 'https://dnaturefood.com',
    siteName: 'DNAture',
    title: 'DNAture - Nutrición personalizada para tu mascota',
    description: 'DNAture - Nutrición personalizada para tu mascota basada en ADN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNAture - Nutrición personalizada para tu mascota',
    description: 'DNAture - Nutrición personalizada para tu mascota basada en ADN',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
