import React, { useState, useEffect } from 'react'
import Image from 'next/image'

// local imports
// data
import { getProducts } from '../../../services/products'

const Catalog = () => {
    const [ categories, setCategories ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        const fetchProducts = async() => {
            const categories = []
            try {
                const catalog = await getProducts()
                for (const category in catalog) {
                    categories.push(catalog[category])
                }
                setCategories(categories)
                setLoading(false)
                console.log(categories)
            } catch (e) {
                console.log(e)
            }
        }
        fetchProducts()
    }, [])

    return (
        <section>
            {loading ? (
                <div>loading</div>
            ) : (
                <>
                {categories.map(category => (
                    <div className='' key={category.id}>
                        <h2>{category.label}</h2>
                        <ul>
                            {category.products.map(product => (
                                <li key={product.sys.id}>
                                    <div>
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
                                    </div>
                                    <div>
                                        <h3>{product.productName}</h3>
                                        <p>{product.description}</p>
                                        <p>₡{product.precio}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                </>
            )}
        </section>
    );
}
 
export default Catalog