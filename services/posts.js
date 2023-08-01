import { fetchFromContentful } from './util';

const BLOG_PREVIEW_QUERY = `
  {
    blogPostCollection {
      items {
        sys {
          id
          publishedAt
        }
        title
        excerpt
        category
        media {
          url
        }
        slug
      }
    }
  }
`;

export const getPosts = async () => {
  try {
    const { blogPostCollection } = await fetchFromContentful(
      BLOG_PREVIEW_QUERY
    );
    return blogPostCollection.items;
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
};

const POST_QUERY = `
  query getBlogEntry($id: String!) {
    blogPostCollection(where: {sys: {id: $id}}) {
      items {
        sys {
          id
          publishedAt
        }
        title
        media {
          url
        }
        body {
          json
        }
        asideContent {
          json
        }
        imagesCollection (limit: 5) {
          items {
            url
            title
          }
        }
        productsCollection (limit: 5) {
          items {
            sys {
              id
            }
            urlSlug
            productName
            imageCollection (limit: 1) {
              items {
                  title
                  url
              }
            }
          }
        }
        hashtags
        category
        author {
          name
          avatar {
            url
          }
        }
      }
    }
  }
`;

export const getPost = async (id) => {
  try {
    const data = await fetchFromContentful(POST_QUERY, { id });
    return data.blogPostCollection.items[0];
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
};

export const getPostsByField = async (field, value) => {
  try {
    let variables;
    let queryValue;

    if (field === 'hashtags_contains_some') {
      queryValue = '[String!]!';
      variables = { value: [value] };
    } else {
      queryValue = 'String!';
      variables = { value };
    }

    const POSTS_BY_FIELD_QUERY = `
      query getBlogEntriesBy${
        field.charAt(0).toUpperCase() + field.slice(1)
      }($value: ${queryValue}) {
        blogPostCollection(where: {${field}: $value}) {
          items {
            sys {
              id
              publishedAt
            }
            excerpt
            title
            category
            slug
            media {
              url
            }
          }
        }
      }
    `;

    const data = await fetchFromContentful(POSTS_BY_FIELD_QUERY, variables);
    return data.blogPostCollection.items;
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
};
