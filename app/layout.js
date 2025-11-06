import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.scss';

import Providers from './providers';
import { generateOrganizationSchema, generateWebSiteSchema } from '../lib/seo';

export const metadata = {
  metadataBase: new URL('https://dnaturefood.com'),
  title: {
    default: 'DNAture - Nutrición personalizada para tu mascota',
    template: '%s | DNAture',
  },
  description: 'DNAture - Nutrición fisiológica personalizada para tu mascota basada en ADN',
  keywords: ['dnature', 'nutrición canina', 'dieta fisiológica', 'comida para perros', 'comida para gatos', 'alimentación personalizada', 'ADN canino', 'Costa Rica'],
  authors: [{ name: 'DNAture' }],
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
    images: [
      {
        url: '/images/hero3_wide.jpg',
        width: 1200,
        height: 630,
        alt: 'DNAture - Nutrición personalizada para mascotas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNAture - Nutrición personalizada para tu mascota',
    description: 'DNAture - Nutrición personalizada para tu mascota basada en ADN',
    images: ['/images/hero3_wide.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
