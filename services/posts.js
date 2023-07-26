import { fetchFromContentful } from './util';

const BLOG_PREVIEW_QUERY = `
  {
    blogPostCollection {
      items {
        sys {
          id
        }
        title
        excerpt
        hashtags
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
          firstPublishedAt
        }
        title
        body {
          json
        }
        hashtags
        media {
          url
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
          firstPublishedAt
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
};

export async function getPostsByHashtag(hashtag) {
  try {
    const data = await fetchFromContentful(POSTS_BY_HASHTAG_QUERY, { hashtag });
    return data.blogPostCollection.items;
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
};
