import React from 'react';
import { Container, Divider, Grid } from '@mui/material';

// local imports
import styles from './Post.module.scss';

import PostTags from './PostTags';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import PostAside from './PostAside';
import PostProducts from './PostProducts';

const Post = ({ post }) => {
  return (
    <Container className={styles.post} sx={{ marginY: 4 }} component={'article'}>
      <PostHeader title={post.title} media={post.media} />
      <Grid container sx={{ marginBottom: 4 }} component={'section'}>
        <Grid item xs={12} md={8}>
          {post.body && post.imagesCollection?.items && (
            <PostBody body={post.body} images={post.imagesCollection.items} />
          )}
        </Grid>
        <Grid item xs={12} md={4} component={'aside'}>
          {post.asideContent && <PostAside content={post.asideContent} />}
        </Grid>
      </Grid>
      <Divider />
      {post.productsCollection?.items && post.productsCollection?.items.length > 0 && (
        <PostProducts products={post.productsCollection.items} />
      )}
      {post.hashtags && <PostTags tags={post.hashtags} />}
    </Container>
  );
};

export default Post;
