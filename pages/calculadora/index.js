import Head from 'next/head';

// local imports

// components
import Page from '../../components/Page';
import Calculator from '../../features/Calculator';

export default function App() {
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

      <Page showHeader>
        <Calculator />
      </Page>
    </>
  );
}
