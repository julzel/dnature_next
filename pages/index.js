import Head from 'next/head'

// local imports
import Layout from '../components/Layout'
import Home from '../pages_components/Home'


export default function App() {
  return (
    <>
      <Head>
        <title>DNAture Comida natural para mascotas</title>
        <meta name="description" content="Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <Layout changeBackground>
       <Home />
     </Layout>
    </>
  )
}
