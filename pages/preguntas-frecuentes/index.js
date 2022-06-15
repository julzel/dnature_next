import Head from 'next/head'

// local imports
import Layout from '../../components/Layout'
import Faq from '../../pages_components/Faq'


export default function App() {
  return (
    <>
      <Head>
        <title>DNAture Comida natural para mascotas</title>
        <meta name="description" content="Preguntas frecuentes sobre alimentación natural" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <Layout changeBackground>
       <Faq />
     </Layout>
    </>
  )
}
