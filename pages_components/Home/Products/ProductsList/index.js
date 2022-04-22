import React from 'react'
import Image from 'next/image'

// local imports
// components
import Header from '../../../../components/Header'

// styles
import styles from './ProductsList.module.scss'

// images
import pawIcon from '../../../../public/images/paw-orange.svg'

const ProductsList = ({ style, productsList, visible }) => {
    const { title, text, items, price, img } = productsList;
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
                <div className={styles.productsListContainer}>
                    {text && (
                        <div className={styles.productsListText}>
                            {text}
                        </div>
                    )}
                    {items && (
                        <div className={styles.productsListDetail}>
                            <ul className={styles.productsListItems}>
                                {items.map((item, i) => (
                                    <li key={i}>
                                        <span>
                                            <Image src={pawIcon} alt='icono de huella de perrito' />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.productsListPrice}>
                               {price}
                            </div>
                        </div>
                    )}
                    {img && (
                        <Image src={img} alt={title} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductsList