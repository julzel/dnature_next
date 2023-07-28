import { Box, Typography } from "@mui/material";
const PostAuthor = ({ author }) => {
  return (
    <Box>
      <Typography variant="subtitle1" component="h6" gutterBottom>{author.name}</Typography>
    </Box>
  );
}
 
export default PostAuthor;