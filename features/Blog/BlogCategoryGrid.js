import {
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router'; // import useRouter

// local imports
import postCategories from './post-categories';

const BlogCategoryGrid = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const router = useRouter(); // instantiate useRouter

  let spacing;

  if (isXs) {
    spacing = 1;
  } else {
    spacing = 2;
  }

  const handleCategoryClick = (category) => {
    router.push(`/blog/query-result/?field=category&value=${category}`);
  };

  return (
    <Box mb={4}>
      <Grid container spacing={spacing}>
        {Object.entries(postCategories).map(([category, { color, icon }]) => (
          <Grid item xs={6} sm={4} key={category}>
            <Paper
              style={{
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: color,
                cursor: 'pointer', // make the Paper component act like a button
              }}
              onClick={() => handleCategoryClick(category)} // attach click event
            >
              <Typography color="white">{icon}</Typography>
              <Typography color="white">{category}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BlogCategoryGrid;
