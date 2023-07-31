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
          {posts.map((post) => (
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
                    <Avatar alt={post.title} src={post.media.url} />
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
                  />
                </ListItem>
                <Divider variant="inset" />
              </a>
            </Link>
          ))}
        </List>
      </Box>
    </Container>
  );
}
