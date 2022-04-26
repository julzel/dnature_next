const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const TOKEN_ACCESS = process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_API_KEY

const fetchFromContentful = async query => {
    const url = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN_ACCESS}`,
        },
        body: JSON.stringify({ query }),
    }
    const resp = await window.fetch(url, options)
    const data = await resp.json()
    return data.data
}

export { fetchFromContentful }