import React from 'react'
import Head from 'next/head'

// local imports
import Layout from '../../../components/Layout'

//
import Product from '../../../pages_components/Product'

const ProductDetail = () => {

    return (
        <>
            <Head>
                <title>DNAture Comida natural para mascotas</title>
                <meta name="description" content="Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout showHeader>
                <Product/>
            </Layout>
        </>
    )
}

export default ProductDetail