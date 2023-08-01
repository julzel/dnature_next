import React from 'react';
import { Card, Container, Grid } from '@mui/material';

// local imports
import styles from './Post.module.scss';

import PostTags from './PostTags';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import PostAside from './PostAside';
import PostProducts from './PostProducts';

const Post = ({ post }) => {
  return (
    <div className={styles.post}>
      <Container sx={{ paddingY: 3 }} component={'article'}>
        <PostHeader
          title={post.title}
          media={post.media}
          date={post.sys.publishedAt}
          author={post.author}
          category={post.category}
        />
        <Card sx={{ mb: { xs: 2, md: 4 } }}>
          <Grid
            container
            sx={{
              padding: {
                xs: 2,
                sm: 4,
              },
            }}
            component={'section'}
          >
            <Grid item xs={12} md={8}>
              {post.body && post.imagesCollection?.items && (
                <PostBody
                  body={post.body}
                  images={post.imagesCollection.items}
                />
              )}
            </Grid>
            <Grid item xs={12} md={4} component={'aside'}>
              {post.asideContent && <PostAside content={post.asideContent} />}
              {post.hashtags && (
                <PostTags tags={post.hashtags} category={post.category} />
              )}
            </Grid>
          </Grid>
        </Card>
        {post.productsCollection?.items &&
          post.productsCollection?.items.length > 0 && (
            <PostProducts
              products={post.productsCollection.items}
              category={post.category}
            />
          )}
      </Container>
    </div>
  );
};

export default Post;
