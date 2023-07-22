import React from 'react';
import { Box } from '@mui/material';
import Head from 'next/head';

// local imports
// styles
import styles from './Blog.module.scss';

// components
import BlogIntro from './BlogIntro';
import BlogHero from './BlogHero';
import BlogPosts from './BlogPosts';

const Blog = ({ posts }) => {
  console.log(posts)
  return (
    <Box pb={4} className={styles['blog-container']}>
      <Head>
        <title>DNAture Blog | Nutrición con amor</title>
        <meta
          name="description"
          content="Check out the latest blog posts from My Online Store"
        />
      </Head>
      <header>
        <BlogHero />
      </header>
      <div className={styles['pull-up']}>
        <BlogIntro />
        <BlogPosts posts={posts} />
      </div>
    </Box>
  );
};

export default Blog;
