'use client';

import Script from "next/script";
// local imports

// components
import Layout from "../Layout";

const Page = ({
  title = "DNAture - Alimentación natural para mascotas",
  description = "Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado. Snacks, dieta blanda, barf, raw. Todo en comida natural y saludable para mascotas",
  imageUrl = "/public/images/hero3.jpg",
  imageAlt = "Perro comiendo alimentación natural",
  path = "/",
  children,
}) => {
  const url = process.env.NEXT_PUBLIC_SITE_URL + path;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: title,
    description,
    url,
    image: imageUrl,
  };

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload" id="gtag-strategy">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
          page_path: window.location.pathname,
          });
        `}
      </Script>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Layout>{children}</Layout>
    </>
  );
};

export default Page;
