import { fetchFromContentful } from "./util"

const productsQuery = `
{
    productCollection {
        items {
            productName
            description
            category
            categorySlug
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
        console.log(item)

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

export { getProducts }