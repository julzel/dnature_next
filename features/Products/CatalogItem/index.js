import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// local imports
// styles
import styles from './CatalogItem.module.scss'

const CatalogItem = ({ product }) => {
    const { images } = product
    const itemImage = images[0]

    return (
        <Link
            passHref
            href={{
                pathname: `/productos/${product.urlSlug}`,
                query: { id: product.sys.id },
            }}
        >
            <span className={styles.catalogItem}>
                <span className={styles.catalogItemImages}>
                    <Image
                        src={itemImage.url}
                        alt={itemImage.title}
                        width="100%"
                        height="100%"
                        layout="responsive"
                        objectFit="contain"
                    />
                </span>
                <span className={styles.catalogItemDetails}>
                    <h3>{product.productName}</h3>
                    <p>
                        ₡{product.precio} <span> | {product.medida}</span>
                    </p>
                </span>
            </span>
        </Link>

    )
}

export default CatalogItem