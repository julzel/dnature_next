import Head from 'next/head';
// local imports

// components
import Layout from '../Layout';

const Page = ({ children }) => {
  return (
    <>
      <Head>
        <title>DNAture Comida natural para mascotas</title>
        <meta
          name='description'
          content='Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>{children}</Layout>
    </>
  );
};

export default Page;
