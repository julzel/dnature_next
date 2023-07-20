import { fetchFromContentful } from "./util";

const BLOG_PREVIEW_QUERY = `
  {
    blogEntryCollection {
      items {
        title
        excerpt
      }
    }
  }
`;

const BLOG_POSTS_QUERY = `
  query {
    blogEntryCollection {
      items {
        sys {
          id
        }
        title
        body
        media {
          title
          url
        }
        recommendedPostsCollection {
          items {
            title
            sys {
              id
            }
          }
        }
        author {
          name
          bio
          avatar {
            title
            url
          }
          socialNetworks
        }
      }
    }
  }
`;

export const getPosts = async () => {
  try {
    const { blogEntryCollection } = await fetchFromContentful(BLOG_PREVIEW_QUERY);
    return blogEntryCollection.items;
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
};



// export const fetchBlogPosts = async () => {
//   try {
//     const { blogEntryCollection } = await fetchFromContentful(BLOG_POSTS_QUERY);
//     return blogEntryCollection.items;
//   } catch (error) {
//     console.error('Error fetching blog posts from Contentful:', error);
//     throw error;
//   }
// };

