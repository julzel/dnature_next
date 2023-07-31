import React from 'react';
import { Box } from '@mui/material';
import Head from 'next/head';

// local imports
// styles
import styles from './Blog.module.scss';

// components
import BlogIntro from './BlogIntro';
import BlogCategoryGrid from './BlogCategoryGrid';
import BlogHero from './BlogHero';
import BlogPosts from './BlogPosts';

const Blog = ({ posts }) => {
  return (
    <Box pb={4} className={styles['blog-container']}>
      <Head>
        <title>DNAture Blog | Nutrición con amor</title>
        <meta
          name="description"
          content="Blog de DNAture, tips de nutrición, tenencia responsable, y todo lo que necesitas saber sobre alimentación natural para mascotas."
        />
      </Head>
      <header>
        <BlogHero />
      </header>
      <Box component={'section'} p={[2, 4]} maxWidth={'md'} mx={'auto'}>
        <BlogIntro />
        <BlogCategoryGrid />
        <BlogPosts posts={posts} />
      </Box>
    </Box>
  );
};

export default Blog;
