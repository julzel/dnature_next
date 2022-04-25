import React from 'react'
import Image from 'next/image'

// local imports
// styles
import styles from './Product.module.scss'

const Product = ({ product }) => {
    return (
        <section className={styles.product}>
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
                        ₡{product.precio} 1kg
                    </p>
                </div>
            </div>
            <div className={styles.productDetail}>
                <h2>{product.productName}</h2>
                <p>
                    {product.description}
                </p>
            </div>
        </section>
    );
}
 
export default Product;