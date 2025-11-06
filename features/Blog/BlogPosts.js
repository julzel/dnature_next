"use client";
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';
import Link from 'next/link';

// local imports
import { useWindow } from '../../hooks';
import styles from './Blog.module.scss';
import BlogPostItem from './BlogPostItem';

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
            <Link
              href={{
                pathname: `/blog/${post.slug}`,
                query: { id: post.sys.id },
              }}
              passHref
            >
              <span className={styles['blog-posts_link']}>
                <BlogPostItem post={post} />
              </span>
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default BlogPosts;
