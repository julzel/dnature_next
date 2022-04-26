import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons'
import { faShoppingBasket } from '@fortawesome/free-regular-svg-icons'

// local imports
// styles
import styles from './Product.module.scss'

const Product = ({ product }) => {

    const [whatsappMessageText] = useState(`
    Orden de compra:    
    Nombre del artículo:
    
    ${product.productName}
    `
    )

    return (
        <section className={styles.product}>
            <div className={styles.backLink}>
                <Link href={'/productos'} passHref>
                    <span>
                        <FontAwesomeIcon icon={faCircleLeft} size='1x' />
                        &nbsp;
                        Regresar
                    </span>
                </Link>
            </div>
            <h1>
                {product.productName}
            </h1>
            <div className={styles.productInfo}>
                <div className={styles.images}>
                    {product.images?.map((img, i) => (
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
                    <p className={styles.precio}>
                        ₡{product.precio}
                    </p>
                    <p className={styles.small}>
                        {product.medida}
                    </p>
                    {product.ingredientes && (
                        <>
                            <h6>Ingredientes:</h6>
                            <p className={styles.ingredients}>
                                {product.ingredientes}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.productBuy}>
                <a href={`https://api.whatsapp.com/send?phone=50671732328&text=${whatsappMessageText}`}>
                    <FontAwesomeIcon icon={faShoppingBasket} size='1x' />
                    Comprar
                </a>
            </div>
            <div className={styles.productDetail}>
                {product.description && (
                    <>
                        <h2>
                            Información
                        </h2>
                        <p>
                            {product.description}
                        </p>
                    </>
                )}
                {product.iconos && (
                    <div className={styles.icons}>
                        {product.iconos.map((icono, j) => (
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
        </section>
    );
}

export default Product;