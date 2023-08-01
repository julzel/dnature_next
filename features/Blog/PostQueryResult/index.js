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
} from '@mui/material';

// local imports
import postCategories from '../post-categories';

export default function PostQueryResult({ posts, query }) {
  return (
    <Container maxWidth="md">
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
          {(Array.isArray(posts) && posts.length > 0) ?
            posts.map((post) => (
              <Link
                key={post.sys.id}
                href={{
                  pathname: `/blog/${post.slug}`,
                  query: { id: post.sys.id },
                }}
                passHref
              >
                <a>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ width: 70, height: 70, mr: 2 }} alt={post.title} src={post.media.url} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography component="h6" variant="h6">
                            {post.title}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            {post.excerpt}
                          </Typography>
                        </React.Fragment>
                      }
                      sx={{ borderTop: `3px solid ${postCategories[post.category].color}`, pt: 1}}
                    />
                  </ListItem>
                </a>
              </Link>
            ))
            :
            <Typography variant="h6" component="h2" gutterBottom>
              No se encontraron resultados
            </Typography>
          }
        </List>
      </Box>
    </Container>
  );
}
