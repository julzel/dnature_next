import React from 'react';
import Link from 'next/link';
import {
  Chip,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Card,
} from '@mui/material';
import { grey } from '@mui/material/colors';

// local imports
import { formatContentfulDate } from '../../../util/dates';

import postCategories from '../post-categories';
import BlogBreadcrumbs from '../BlogBreadcrumbs';

export default function PostQueryResult({ posts, query }) {
  return (
    <Container maxWidth="md" sx={{ paddingY: 3 }}>
      <BlogBreadcrumbs currentCrumb={'Resultados'} />
      <Box sx={{ maxWidth: 900, margin: '0 auto', mt: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Resultados para:
          {query.value && (
            <Chip
              label={query.value.toUpperCase()}
              sx={{ ml: 1, fontSize: '12px' }}
            />
          )}
        </Typography>
        <Divider />
        <Box mb={[2, 4]} />
        <List>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <Card
                key={post.sys.id}
                sx={{
                  mb: 2,
                  ':active': {
                    bgcolor: grey[100],
                    transform: 'scale(0.99)',
                    transition: 'all 0.1s ease-in-out',
                  },
                }}
              >
                <Link
                  href={{
                    pathname: `/blog/${post.slug}`,
                    query: { id: post.sys.id },
                  }}
                  passHref
                >
                  <a>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            width: {
                              xs: 70,
                              sm: 90,
                              md: 100,
                            },
                            height: {
                              xs: 70,
                              sm: 90,
                              md: 100,
                            },
                            mr: 2,
                          }}
                          alt={post.title}
                          src={post.media.url}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography component="h6" variant="h6" mb={1}>
                            {post.title}
                            <Typography
                              component="div"
                              variant="subtitle2"
                              color={'textSecondary'}
                            >
                              {formatContentfulDate(post.sys.publishedAt)}
                            </Typography>
                          </Typography>
                        }
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            {post.excerpt}
                          </Typography>
                        }
                        sx={{
                          borderTop: `3px solid ${
                            postCategories[post.category].color
                          }`,
                          pt: 1,
                        }}
                      />
                    </ListItem>
                  </a>
                </Link>
              </Card>
            ))
          ) : (
            <Typography
              variant="h6"
              component="h2"
              textAlign={'center'}
              gutterBottom
            >
              No se encontraron resultados
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
}
