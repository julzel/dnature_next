import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Chip, Container, Typography } from '@mui/material';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import styles from './Post.module.scss';

function Post({ post }) {
  return (
    <Container maxWidth="md" className={styles.post}>
      <Box sx={{ maxWidth: 900, margin: '0 auto', mt: 2, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Box my={2}>
          <Image
            src={post.media.url}
            alt={post.title}
            layout="responsive"
            objectFit="cover"
            width={300}
            height={250}
          />
        </Box>
        <Box pt={2} mb={2} className={styles.post_body}>
          {documentToReactComponents(post.body.json)}
        </Box>
        <Box>
          <Typography variant="h6" component="h6" gutterBottom>
            Etiquetas
          </Typography>
          {post.hashtags.map((hashtag) => (
            <Link key={hashtag} href={`/blog/etiquetas/${hashtag}`} passHref>
              <Chip
                component={'a'}
                label={hashtag.toUpperCase()}
                sx={{ mr: 1, fontSize: '10px' }}
              />
            </Link>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default Post;
