import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// local imports
import Layout from '../../../components/Layout'

// data
import { getProduct } from '../../../services/products'

//
import Product from '../../../pages_components/product'

const ProductDetail = () => {
    const router = useRouter()

    // state
    const [productDetail, setProductDetail] = useState(null)
    const [loading, setLoading] = useState(true)

    // functions
    const fetchProduct = useCallback(async () => {
        const { query } = router
        try {
            const product = await getProduct(query.id)
            setProductDetail(product);
            setLoading(false)
        } catch (e) {
            console.error(e)
        }
    }, [router])

    // state updates
    useEffect(() => {
        fetchProduct()
    }, [fetchProduct])

    if (loading) {
        return (
            <div>loading</div>
        )
    }

    return (
        <>
            <Head>
                <title>DNAture Comida natural para mascotas</title>
                <meta name="description" content="Buscas la mejor alimentación para tu mascota. Has llegado al lugar indicado" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout showHeader>
                {productDetail && <Product product={productDetail} />}
            </Layout>
        </>
    )
}

export default ProductDetail