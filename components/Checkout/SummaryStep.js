'use client';

import { Box, Stack, Typography } from '@mui/material';
import PurchaseOrderContainer from '../../features/Cart/PurchaseOrder';

const SummaryStep = ({ orderPreviewRef }) => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h5" gutterBottom>
        Vista previa de la orden
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Revisa que los datos sean correctos antes de confirmar.
      </Typography>
    </Box>
    <Box sx={{ overflowX: 'auto' }} ref={orderPreviewRef}>
      <PurchaseOrderContainer />
    </Box>
  </Stack>
);

export default SummaryStep;
