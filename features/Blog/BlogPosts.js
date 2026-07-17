'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Card, ImageList, ImageListItem, Typography } from '@mui/material';

// local imports
import styles from './Blog.module.scss';
import { useWindow } from '../../hooks';
import { formatToLocaleDate } from '../../util/dates';
import postCategories from './post-categories';

const BlogPostItem = ({ post }) => (
  <Card elevation={1} sx={{ mb: 1 }}>
    <Box position={'relative'}>
      <Image
        src={post.media.url}
        alt={post.title}
        width={300}
        height={250}
        sizes="(min-width: 900px) 33vw, 100vw"
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
    </Box>
    <Box p={1} bgcolor={postCategories[post.category].color}>
      <Typography color="white" variant="h6" gutterBottom>
        {post.title}
      </Typography>
      <Typography textAlign="right" color="white" variant="subtitle2" gutterBottom>
        {formatToLocaleDate(post.sys.publishedAt)}
      </Typography>
    </Box>
    <Box height="100%" flex={1} p={1}>
      <Typography color variant="body2">
        {post.excerpt}
      </Typography>
    </Box>
  </Card>
);

const BlogPosts = ({ posts }) => {
  const isMobile = useWindow();

  return (
    <Box pt={[2, 4]} pb={[1, 3]}>
      <Typography mb={[2, 4]} component="h3" variant="h4" gutterBottom>
        Entradas más recientes
      </Typography>
      <ImageList gap={16} cols={isMobile ? 1 : 3}>
        {posts.map((post, index) => (
          <ImageListItem key={index}>
            <Link href={`/blog/${encodeURIComponent(post.slug)}`} className={styles['blog-posts_link']}>
              <BlogPostItem post={post} />
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default BlogPosts;
