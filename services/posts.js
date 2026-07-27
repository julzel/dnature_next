import { fetchFromContentful } from './util';
import { optimizeContentfulImage } from './contentful-images';

const optimizePostPreview = (post) => ({
  ...post,
  media: optimizeContentfulImage(post?.media, {
    width: 1000,
    quality: 75,
  }),
});

const optimizeBlogPostImages = (post) => {
  if (!post) {
    return post;
  }

  return {
    ...post,
    media: optimizeContentfulImage(post.media, {
      width: 1600,
      quality: 78,
    }),
    imagesCollection: post.imagesCollection
      ? {
          ...post.imagesCollection,
          items: (post.imagesCollection.items || []).map((image) =>
            optimizeContentfulImage(image, {
              width: 1400,
              quality: 78,
            })
          ),
        }
      : post.imagesCollection,
    productsCollection: post.productsCollection
      ? {
          ...post.productsCollection,
          items: (post.productsCollection.items || []).map((product) => ({
            ...product,
            imageCollection: product.imageCollection
              ? {
                  ...product.imageCollection,
                  items: (product.imageCollection.items || []).map((image) =>
                    optimizeContentfulImage(image, {
                      width: 160,
                      quality: 75,
                    })
                  ),
                }
              : product.imageCollection,
          })),
        }
      : post.productsCollection,
    author: post.author
      ? {
          ...post.author,
          avatar: optimizeContentfulImage(post.author.avatar, {
            width: 128,
            quality: 75,
          }),
        }
      : post.author,
  };
};

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
      BLOG_PREVIEW_QUERY,
      undefined,
      { revalidate: 120, tags: ['posts'] }
    );
    return blogPostCollection.items.map(optimizePostPreview);
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
};

const POST_BY_SLUG_QUERY = `
  query getBlogEntryBySlug($slug: String!) {
    blogPostCollection(where: {slug: $slug}, limit: 1) {
      items {
        sys {
          id
          publishedAt
        }
        title
        excerpt
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

export const getPostBySlug = async (slug) => {
  try {
    const data = await fetchFromContentful(POST_BY_SLUG_QUERY, { slug }, {
      revalidate: 120,
      tags: ['posts', `post:${slug}`],
    });
    return optimizeBlogPostImages(data.blogPostCollection.items[0]);
  } catch (error) {
    const partialPost = error?.response?.data?.blogPostCollection?.items?.[0];

    // Contentful can return usable post data together with errors for broken
    // optional links (for example, an unpublished author avatar). Render the
    // post with the available data instead of turning the whole page into a 500.
    if (partialPost) {
      const contentfulError = error?.response?.errors?.[0]?.message;
      console.warn(
        'Contentful returned partial blog post data:',
        contentfulError || 'An optional linked entry could not be resolved.'
      );
      return optimizeBlogPostImages(partialPost);
    }

    console.error('Error fetching blog post from Contentful:', error);
    throw error;
  }
};

const SEARCH_FIELDS = new Set(['category', 'hashtags_contains_some']);

export const getPostsByField = async (field, value) => {
  if (!SEARCH_FIELDS.has(field) || !value) {
    return [];
  }

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

    const data = await fetchFromContentful(POSTS_BY_FIELD_QUERY, variables, {
      revalidate: 120,
      tags: ['posts'],
    });
    return data.blogPostCollection.items.map(optimizePostPreview);
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    throw error;
  }
};
