import Image from 'next/image';
import { Box, Typography } from '@mui/material';

const PostHeader = ({ title, media }) => {
  return (
    <Box mb={4}>
      <Typography variant="h3" component="h1" gutterBottom>
        {title}
      </Typography>
      <Image
        src={media.url}
        alt={title}
        layout="responsive"
        objectFit="cover"
        width={300}
        height={250}
      />
    </Box>
  );
};

export default PostHeader;
