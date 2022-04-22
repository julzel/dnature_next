import { fetchFromContentful } from "./util"

const productsQuery = `
{
    productCollection {
        items {
            productName
            description
            category
            precio
            sys {
                id
            }
        }
    }
}
`

const getProducts = async () => {
    const data = await fetchFromContentful(productsQuery)
    return data.productCollection.items
}

export { getProducts }