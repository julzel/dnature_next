import {
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// local imports
import postCategories from './post-categories';

const BlogCategoryGrid = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  let spacing;

  if (isXs) {
    spacing = 1;
  } else {
    spacing = 2;
  }

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
              }}
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
