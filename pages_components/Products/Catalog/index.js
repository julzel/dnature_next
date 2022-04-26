import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// local imports
// data
import { getProducts } from '../../../services/products'

// styles
import styles from './Catalog.module.scss'

const Catalog = () => {
    // state
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    // functions
    const fetchProducts = async () => {
        const categories = []
        try {
            const catalog = await getProducts()
            for (const category in catalog) {
                if(catalog.hasOwnProperty(category)) {
                    const { index } = catalog[category]
                    categories[index] = catalog[category]
                }
            }
            setCategories(categories)
            setLoading(false)
        } catch (e) {
            console.error(e)
        }
    }

    // state updates
    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div>loading</div>
        )
    }

    return (
        <section className={styles.catalog}>
            {categories.map(category => (
                <div className={styles.category} key={category.id}>
                    <h2 className={`title ${styles.categoryTitle}`}>
                        {category.label}
                    </h2>
                    <ul className={styles.categoryList}>
                        {category.products.map(product => (
                            <li
                                className={styles.product}
                                key={product.sys.id}
                            >
                                <Link
                                    passHref
                                    href={{
                                        pathname: `/productos/${product.urlSlug}`,
                                        query: { id: product.sys.id },
                                    }}
                                >
                                    <span>
                                        <span className={styles.productImages}>
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
                                        <span className={styles.productDetails}>
                                            <h3>{product.productName}</h3>
                                            <p>Precio (1kg) <span>₡{product.precio}</span></p>
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}

export default Catalog