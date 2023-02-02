import Head from 'next/head';

// local imports
import Page from '../../components/Page';
import Faq from '../../features/Faq';

export default function App() {
  return (
    <>
      <Head>
        <title>DNAture Comida natural para mascotas</title>
        <meta
          name='description'
          content='Preguntas frecuentes sobre alimentación natural'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Page changeBackground>
        <Faq />
      </Page>
    </>
  );
}
