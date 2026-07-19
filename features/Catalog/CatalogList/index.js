import React from 'react'

// local imports
// styles
import styles from './CatalogList.module.scss'

// components
import CatalogItem from '../CatalogItem'

const CatalogList = ({ products }) => {
    return (
        <ul className={styles.catalogList}>
            {products.map(product => (
                <li
                    className={styles.product}
                    key={product.sys.id}
                >
                    <CatalogItem product={product} />
                </li>
            ))}
        </ul>
    )
}

export default CatalogList