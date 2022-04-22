import React, { useState, useEffect } from 'react'
import Image from 'next/image'

// local imports
//styles 
import styles from './Products.module.scss'

// data
import { getCategories } from '../../../services/categories'
import AnimationBox from '../../../components/AnimationBox'

// components
import Button from '../../../components/Button'
import ProductsList from './ProductsList'
import Modal from '../../../components/Modal'

const Products = () => {
    const [displayModal, setDisplayModal] = useState(false)
    const [selectedCategory, setSelectetCategory] = useState(null)
    const [categories, setCategories] = useState(null)

    const onCategoryClick = category => {
        // setDisplayModal(true)
        console.log(category)
    }

    const onModalClose = () => setDisplayModal(false)

    useEffect(() => {
        const fetchCategories = async() => {
            const categories = await getCategories()
            setCategories(categories)
        }
        fetchCategories()
    }, [])

    return (
        <div className={styles.products}>
            <h2 className={`title ${styles.productsTitle}`}>
                Nuestros productos
            </h2>
            <div className={styles.productsCategories}>
                {categories && categories.map((category, i) => {
                    return (
                        <div
                            key={i}
                            className={styles.productsCategory}
                        >
                            <div className={styles.productsCategoryThumbnail}>
                                <AnimationBox animation='fade-in-from-bottom'>
                                    <div className={styles.image}>
                                        <Image
                                            src={category.image.url}
                                            alt={category.image.title}
                                            width="100%"
                                            height="100%"
                                            layout="responsive"
                                            objectFit="contain"
                                        />
                                    </div>
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
                                            <Button label={'Comprar'}/>
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