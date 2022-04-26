import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './Product.module.scss'

const Product = ({ product }) => {
    const whatsappMessageText = `Orden de compra:
        
        Nombre del artículo:
        
        ${product.productName}
        `
    return (
        <section className={styles.product}>
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
                    <p>
                        ₡{product.precio}
                    </p>
                    <p className={styles.small}>
                        {product.medida}
                    </p>
                    <div>
                        <a href={`https://api.whatsapp.com/send?phone=50671732328&text=${whatsappMessageText}`}>
                            <FontAwesomeIcon icon={faShoppingBasket} size='s' />
                            Comprar
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.productDetail}>
                <h2>
                    Información
                </h2>
                <p>
                    {product.description}
                </p>
                {product.ingredientes && (
                    <>
                        <h2>Ingredientes</h2>
                        <p className={styles.ingredients}>
                            {product.ingredientes}
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