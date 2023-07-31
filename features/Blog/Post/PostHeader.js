import Image from 'next/image';
import { Avatar, Box, Card, CardMedia, Grid, Typography } from '@mui/material';

const PostHeader = ({ title, media, date, author }) => {
  // Create a Date object
  const dateObject = new Date(date);
  // Format date to local string in day-month-year order
  const localDateString = dateObject.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  return (
    <Box mb={4}>
      <Typography variant="h3" component="h1" gutterBottom mb={2}>
        {title}
      </Typography>

      <Grid
        container
        alignItems={'center'}
        sx={{
          marginBottom: {
            xs: 4,
            sm: 4,
          },
        }}
      >
        <Grid item xs={9}>
          {author && (
            <Grid container alignItems={'center'}>
              <Grid item>
                <Avatar src={author.avatar.url} alt={author.name} />
              </Grid>
              <Grid item ml={1}>
                <Typography variant="subtitle2" component="h2" gutterBottom>
                  Por: {author.name}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={3}>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            component="h2"
            gutterBottom
            align="right"
          >
            {localDateString}
          </Typography>
        </Grid>
      </Grid>

      {media && (
        <Card elevation={0}>
          <CardMedia>
            <Image
              src={media.url}
              alt={title}
              layout="responsive"
              objectFit="cover"
              width={300}
              height={250}
            />
          </CardMedia>
        </Card>
      )}
    </Box>
  );
};

export default PostHeader;
