import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// local imports
// styles
import styles from './CatalogItem.module.scss'

const CatalogItem = ({ product }) => {
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
