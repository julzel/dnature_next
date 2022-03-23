import React from 'react'
import Image from 'next/image'

// local imports

//styles 
import styles from './Products.module.scss'

// data
import Categories from './categories'

const Products = () => {
    return (
        <div className={styles.products}>
            <h2 className={`title ${styles.productsTitle}`}>
                Nuestros productos
            </h2>
            <div className={styles.productsCategories}>
            {Categories.map((category, i) => {
                return (
                    <div
                        key={i}
                        className={styles.productsCategory}
                    >
                        <div className={styles.productsCategoryThumbnail}>
                            <Image src={category.thumbnail} alt="snack icon" />
                            <div className={styles.filter} />
                            <h3
                                className={styles.productsCategoryRibbon}
                                style={{ backgroundColor: category.backgroundColor }}
                            >
                                <div className={styles.icon}><Image src={category.icon} alt="snack icon" /></div>
                                <div className={styles.label}>{category.ribbonTitle}</div>
                            </h3>
                        </div>
                        {/* <div className={styles.productsCategoryListContainer}>
                            <ul className={styles.productsList}>
                                {category.products.map((product, j) => {
                                    return (
                                        <li key={j}>
                                            product
                                        </li>
                                    )
                                })}
                            </ul>
                        </div> */}
                    </div>
                )
            })}
            </div>
        </div>
    );
}

export default Products