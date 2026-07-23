import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import Analytics from './analytics';
import Providers from './providers';
import Layout from '../components/Layout';
import { defaultSocialImage, siteUrl } from '../constants/seo';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/corinthia/700.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.scss';

const defaultTitle = 'DNAture - Alimentación natural para mascotas';
const defaultDescription =
  'Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado. Snacks, dieta blanda, barf, raw. Todo en comida natural y saludable para mascotas.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | DNAture',
  },
  description: defaultDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    siteName: 'DNAture',
    title: defaultTitle,
    description: defaultDescription,
    url: '/',
    images: [{ url: defaultSocialImage, alt: 'Perro comiendo alimentación natural' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultSocialImage],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DNAture',
  description: defaultDescription,
  url: siteUrl,
  image: `${siteUrl}${defaultSocialImage}`,
};

const RootLayout = ({ children }) => (
  <html lang='es-CR'>
    <body>
      <AppRouterCacheProvider>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </AppRouterCacheProvider>
      <Analytics />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </body>
  </html>
);

export default RootLayout;
