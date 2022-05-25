import React, { useState, useEffect } from 'react'

// local imports
// data
import { getProducts } from '../../../services/products'

// styles
import styles from './Catalog.module.scss'

// components
import Loading from '../../../components/Loading'
import CatalogList from '../CatalogList'
import CatalogTitle from '../CatalogTitle'
import Filter from '../../../components/Filter'

const getCategories = catalog => {
    const categories = []
    for (const category in catalog) {
        if (catalog.hasOwnProperty(category)) {
            const { index } = catalog[category]
            categories[index] = catalog[category]
        }
    }
    return categories
}

const getMenuList = (categories, onClick) => {
    const menuList = categories.map(({ label, id }) => ({
        label,
        id,
        onClick
    }))
    menuList.push({
        label: 'Todos los productos',
        id: 'all',
        onClick
    });
    return menuList
}

const Catalog = ({ category }) => {
    // state
    const [categories, setCategories] = useState([])
    const [menuList, setMenuList] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(null)

    // functions
    const fetchProducts = async () => {
        try {
            const catalogData = await getProducts()
            const categories = getCategories(catalogData)
            const onClick = id => {
                const selectedCategory = categories.find(c => c.id === id)
                if (selectedCategory) {
                    setSelectedCategory(selectedCategory)
                } else {
                    setSelectedCategory(id)
                }
            }
            setSelectedCategory(categories[0])
            setCategories(categories)
            setMenuList(getMenuList(categories, onClick))
            setLoading(false)
        } catch (e) {
            console.error(e)
        }
    }

    // state updates
    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (category && categories.length > 0) {
            setSelectedCategory(categories.find(c => c.id === category))
        }
    }, [category, categories])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <section className={styles.catalog}>
            <Filter
                optionsList={menuList}
                selectedOption={selectedCategory}
            />
            {selectedCategory === 'all' ? categories.map(category => {
                return (
                    <div className={styles.category} key={category.id}>
                        <CatalogTitle text={category.label} />
                        <CatalogList products={category.products} />
                    </div>
                )
            }) : (
                <div className={styles.category}>
                    <CatalogTitle text={selectedCategory.label} />
                    <CatalogList products={selectedCategory.products} />
                </div>
            )}
        </section>
    );
}

export default Catalog