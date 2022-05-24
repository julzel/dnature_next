import React, { useState, useEffect } from 'react'

// local imports
// data
import { getProducts } from '../../../services/products'

// styles
import styles from './Catalog.module.scss'

// components
import Loading from '../../../components/Loading'
import Tabs from '../../../components/Tabs'
import CatalogList from '../CatalogList'
import CatalogTitle from '../CatalogTitle'

const Catalog = () => {
    // state
    const [categories, setCategories] = useState([])
    const [categoryTabs, setCategoryTabs] = useState([])
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
            setCategoryTabs(categories.map(({label, id}) => ({ label, id })))
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
            <Loading />
        )
    }

    return (
        <section className={styles.catalog}>
            <Tabs tabs={categoryTabs} />
            {categories.map(category => (
                <div className={styles.category} key={category.id}>
                    <CatalogTitle text={category.label} />
                    <CatalogList products={category.products} />
                </div>
            ))}
        </section>
    );
}

export default Catalog