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
import AnimationBox from '../../../AnimationBox'

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
                                <AnimationBox animation='fade-in-from-bottom'>
                                    <Image src={category.thumbnail} alt="snack icon" />
                                </AnimationBox>
                                <div className={styles.filter} />
                                <div className={styles.productsCategoryContent}>
                                    <AnimationBox animation='fade-in-from-bottom'>
                                        <div
                                            role='button'
                                            className='flex-center-column'
                                            onClick={() => onCategoryClick(category)}
                                            tabIndex="0"
                                        >
                                            <span className={styles.label}>{category.label}</span>
                                            <span className={styles.button}>Comprar</span>
                                        </div>
                                    </AnimationBox>
                                </div>
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