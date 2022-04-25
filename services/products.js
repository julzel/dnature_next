import { fetchFromContentful } from "./util"

const productsQuery = `
{
    productCollection {
        items {
            productName
            category
            categorySlug
            urlSlug
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

const generateProductData = productItems => {
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
                products: []
            }
            catalog[categorySlug].products.push(item)    
        }
    })
    return catalog
}

const getProducts = async () => {
    const data = await fetchFromContentful(productsQuery)
    return generateProductData(data.productCollection.items)
}

const getProduct = async (productId) => {
    const productQuery = `
        {
            product(id:"${productId}") {
                productName
                description
                category
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
        `
    const { product } = await fetchFromContentful(productQuery)
    if (product) {
        const images = product.imageCollection?.items.map(image => image)
        product.images = images
        delete product.imageCollection
        return product
    }
    return null
}

export { getProducts, getProduct  }