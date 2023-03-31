import Head from "next/head";
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

      <Script strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
          page_path: window.location.pathname,
          });
        `}
      </Script>
      <Head>
        <html lang="es" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content={imageAlt} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content={imageAlt} />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>
      <Layout>{children}</Layout>
    </>
  );
};

export default Page;
