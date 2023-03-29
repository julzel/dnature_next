import Head from "next/head";
import Script from "next/script";
// local imports

// components
import Layout from "../Layout";

const Page = ({ children }) => {
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
        <title>DNAture Comida natural para mascotas</title>
        <meta
          name="description"
          content="Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>{children}</Layout>
    </>
  );
};

export default Page;
