import Head from 'next/head'

// local imports
import Page from '../../components/Page'
import Products from '../../pages_components/Products'


export default function App() {
  return (
    <>
      <Head>
        <title>DNAture - Productos</title>
        <meta name="description" content="Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <Page showHeader>
       <Products />
     </Page>
    </>
  )
}
