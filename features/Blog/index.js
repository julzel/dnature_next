import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import Head from 'next/head';
import styles from './Blog.module.scss';
import BlogIntro from './BlogIntro';

const Blog = ({ posts }) => {
  return (
    <Box px={2} py={4} className={styles['blog-container']}>
      <Head>
        <title>Blog | My Online Store</title>
        <meta
          name="description"
          content="Check out the latest blog posts from My Online Store"
        />
      </Head>
      <Typography variant="h2" component="h1" gutterBottom>
        Nutrición con Amor: Guía para Mascotas Felices
      </Typography>
      <BlogIntro />
      <Grid container spacing={4}>
        {posts.map((post, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card className={styles['blog-card']}>
              {/* <CardMedia
                className={styles['blog-media']}
                image={post.mediaCollection.items[0].url}
                title={post.title}
              /> */}
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.excerpt}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Blog;
