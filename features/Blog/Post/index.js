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
  console.log(post);
  return (
    <div className={styles.post}>
      <Container sx={{ paddingY: 4 }} component={'article'}>
        <PostHeader
          title={post.title}
          media={post.media}
          date={post.sys.firstPublishedAt}
          author={post.author}
        />
        <Card elevation={0}>
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
            </Grid>
          </Grid>
        </Card>
        {post.productsCollection?.items &&
          post.productsCollection?.items.length > 0 && (
            <PostProducts products={post.productsCollection.items} />
          )}
        {post.hashtags && <PostTags tags={post.hashtags} />}
      </Container>
    </div>
  );
};

export default Post;
