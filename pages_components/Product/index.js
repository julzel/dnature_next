import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons'
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './Product.module.scss'

// data
import { getProduct } from '../../services/products'
import Loading from '../../components/Loading'

const TAB = '&nbsp&nbsp&nbsp&nbsp'
const NEW_LINE = '<br />'

const formatDescription = description => {
    let formattedString = description.replaceAll('-', `${NEW_LINE}- `)
        .replaceAll('%', `%${NEW_LINE}${TAB}`)
        .replaceAll('     ', TAB)
        .replace(':', `:${NEW_LINE}${TAB}`)
    return formattedString;
}

const Product = () => {

    const router = useRouter()

    // state
    const [productDetail, setProductDetail] = useState(null)
    const [loading, setLoading] = useState(true)

    // functions
    const fetchProduct = useCallback(async () => {
        const { query } = router
        if (query.id) {
            const product = await getProduct(query.id)
            // formatDescription(product.description)
            product.description = formatDescription(product.description)
            // console.log(product.description)
            setProductDetail(product)
            setLoading(false)
        }
    }, [router])

    const getWhatsappMessage = productName => `
    Orden de compra:    
    Nombre del artículo:
    
    ${productName}
    `

    // state updates
    useEffect(() => {
        fetchProduct()
    }, [fetchProduct])

    if (loading) {
        return <Loading />
    }

    return (
        <section className={styles.product}>
            <div className={styles.backLink}>
                <Link href={'/productos'} passHref>
                    <span>
                        <FontAwesomeIcon icon={faCircleLeft} size='1x' />
                        &nbsp;
                        Volver
                    </span>
                </Link>
            </div>
            <div className={styles.productInfo}>
                <div className={styles.images}>
                    {productDetail.images?.map((img, i) => (
                        <Image
                            key={i}
                            src={img.url}
                            alt={img.title}
                            width="100%"
                            height="100%"
                            layout="responsive"
                            objectFit="contain"
                        />
                    ))}
                </div>
                <div className={styles.info}>
                    <div>
                        <h1>
                            {productDetail.productName}
                        </h1>
                        <div className={styles.price}>
                            <p className={styles.precio}>
                                ₡{productDetail.precio} <span className={styles.small}>| {productDetail.medida}</span>
                            </p>
                        </div>
                    </div>
                    <a href={`https://api.whatsapp.com/send?phone=50671732328&text=${getWhatsappMessage(productDetail.productName)}`}>
                        <FontAwesomeIcon icon={faShoppingBasket} size='1x' />
                        Comprar
                    </a>
                </div>
            </div>
            <div className={styles.productDetail}>
                {productDetail.description && (
                    <div>
                        <h2>
                            Información
                        </h2>
                        <p dangerouslySetInnerHTML={{ __html: productDetail.description }} />
                    </div>
                )}
                {productDetail.ingredientes && (
                    <div>
                        <h2>Ingredientes</h2>
                        <p className={styles.ingredients}>
                            <br />
                            {productDetail.ingredientes}
                        </p>
                        {productDetail.iconos && (
                            <div className={styles.icons}>
                                {productDetail.iconos.map((icono, j) => (
                                    <div key={j}>
                                        <Image
                                            src={icono.url}
                                            alt={icono.title}
                                            width="100%"
                                            height="100%"
                                            layout="responsive"
                                            objectFit="contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Product;