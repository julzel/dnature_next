import React from 'react'
import Header from '../../../../Header'

// local imports
// styles
import styles from './ProductsList.module.scss'

const ProductsList = ({ style, productsList, visible }) => {
    const { title, text } = productsList;
    return (
        <div
            className={styles.productsList}
            style={style}
        >
            {visible && <Header />}
            <div>
                {title && (
                    <h3 className={`title ${styles.productsListTitle}`}>
                        {title}
                    </h3>
                )}
                {text && (
                    <div className={styles.productsListText}>
                        {text}
                    </div>
                )}
            </div>
        </div>
    )
}
 
export default ProductsList