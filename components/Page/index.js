'use client';

import Script from 'next/script';
// local imports

// components
import Layout from '../Layout';

const Page = ({
  title = 'DNAture - Alimentación natural para mascotas',
  description = 'Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado. Snacks, dieta blanda, barf, raw. Todo en comida natural y saludable para mascotas',
  imageUrl = '/public/images/hero3.avif',
  imageAlt = 'Perro comiendo alimentación natural',
  path = '/',
  children,
}) => {
  return (
    <>
      <Script
        strategy="worker"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="worker" id="gtag-strategy">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
          page_path: window.location.pathname,
          });
        `}
      </Script>
      <Layout>{children}</Layout>
    </>
  );
};

export default Page;
