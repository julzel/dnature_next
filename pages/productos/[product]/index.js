import React from 'react'
import Head from 'next/head'

// local imports
import Page from '../../../components/Page'

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

            <Page showHeader>
                <Product/>
            </Page>
        </>
    )
}

export default ProductDetail