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

export default function PostListByTag({ posts, tag }) {
  return (
    <Container maxWidth="md">
      <Box sx={{ maxWidth: 900, margin: '0 auto', mt: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Posts relacionados con
          <Chip label={tag.toUpperCase()} sx={{ ml: 1, fontSize: '10px' }} />
        </Typography>
        <Divider />
        <List>
          {posts.map((post) => (
            <ListItem key={post.sys.id} alignItems="flex-start">
              <Link href={`/blog/${post.sys.id}`} passHref>
                <a>
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
                </a>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
