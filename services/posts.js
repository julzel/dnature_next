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
      }
    }
  }
`;

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

const POSTS_BY_HASHTAG_QUERY = `
  query getBlogEntriesByHashtag($hashtag: [String!]!) {
    blogPostCollection(where: {hashtags_contains_some: $hashtag}) {
      items {
        sys {
          id
          publishedAt
        }
        excerpt
        title
        media {
          url
        }
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

export async function getPost(id) {
  try {
    const data = await fetchFromContentful(POST_QUERY, { id });
    return data.blogPostCollection.items[0];
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
}

export async function getPostsByHashtag(hashtag) {
  try {
    const data = await fetchFromContentful(POSTS_BY_HASHTAG_QUERY, { hashtag });
    return data.blogPostCollection.items;
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
}
