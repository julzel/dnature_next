import React, { useState } from 'react'
import Image from 'next/image'

// local imports
// components
import ProductsList from './ProductsList'
import Modal from '../../../Modal'

//styles 
import styles from './Products.module.scss'

// data
import Categories from './categories'

const Products = () => {
    const [displayModal, setDisplayModal] = useState(false)
    const [selectedCategory, setSelectetCategory] = useState(null)

    const onCategoryClick = category => {
        setDisplayModal(true)
        setSelectetCategory(category)
    }

    const onModalClose = () => setDisplayModal(false)

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
                                <h3
                                    className={styles.productsCategoryRibbon}
                                    style={{ backgroundColor: category.backgroundColor }}
                                >
                                    <div className={styles.label}>{category.ribbonTitle}</div>
                                </h3>
                                <button
                                    onClick={() => onCategoryClick(category)}
                                    className={styles.productsCategoryButton}
                                >
                                    <Image src={category.icon} alt="snack icon" />
                                    <span>Ver más</span>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
            <Modal
                onModalClose={onModalClose}
                show={displayModal}
            >
                {selectedCategory && (
                    <ProductsList
                        productsList={selectedCategory.productsList}
                        style={selectedCategory.style}
                        visible={displayModal}
                    />
                )}
            </Modal>
        </div>
    );
}

export default Products