import { GraphQLClient } from "graphql-request";

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const TOKEN_ACCESS = process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_API_KEY;

const endpoint = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${TOKEN_ACCESS}`,
  },
});

const fetchFromContentful = async (query, variables) => {
  try {
    const data = await graphQLClient.request(query, variables);
    return data;
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    throw error;
  }
};

export { fetchFromContentful };
