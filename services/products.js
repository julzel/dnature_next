import { fetchFromContentful } from "./util"

const categoriesPriority = ['recetas', 'snacks', 'suplementos', 'proteinas']

const productsQuery = () => `
{
    productCollection {
        items {
            productName
            category
            categorySlug
            urlSlug
            medida
            precio
            imageCollection {
                items {
                    title
                    url
                }
            }
            sys {
                id
            }
        }
    }
}
`
const productQuery = productId => `
        {
            product(id:"${productId}") {
                productName
                description
                category
                medida
                precio
                ingredientes
                imageCollection {
                    items {
                        title
                        url
                    }
                }
                iconosCollection {
                    items {
                        title
                        url
                    }
                }
                sys {
                    id
                }
            }
        }
        `

const formatProductsData = productItems => {
    const catalog = {}
    productItems.forEach(item => {
        const { categorySlug, category, imageCollection } = item
        const images = imageCollection.items.map(image => image)
        item.images = images
        delete item.imageCollection

        if (catalog.hasOwnProperty(categorySlug)) {
            catalog[categorySlug].products.push(item)    
        } else {
            catalog[categorySlug] = {
                label: category,
                id: category.split(' ').join('').toLowerCase(),
                products: [],
                index: categoriesPriority.indexOf(categorySlug)
            }
            catalog[categorySlug].products.push(item)    
        }
    })
    return catalog
}

const getProducts = async () => {
    const data = await fetchFromContentful(productsQuery())
    return formatProductsData(data.productCollection.items)
}

const formatProductData = product => {
    const images = product.imageCollection?.items.map(image => image)
    product.images = images
    delete product.imageCollection

    const iconos = product.iconosCollection?.items.map(image => image)
    product.iconos = iconos
    delete product.iconosCollection
    return product
}

const getProduct = async productId => {
    const product = await fetchFromContentful(productQuery(productId))
    if (product.product) {
        return formatProductData(product.product)
    }
    return null
}

export { getProducts, getProduct  }