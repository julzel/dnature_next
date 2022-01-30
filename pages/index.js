import Head from 'next/head'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <div>
      <Head>
        <title>DNAture Comida natural para mascotas</title>
        <meta name="description" content="Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <Layout>
       this is main
     </Layout>
    </div>
  )
}
