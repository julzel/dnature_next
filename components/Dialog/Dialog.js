'use client';

import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

const intentColor = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

const AppDialog = ({
  open = true,
  type = 'info',
  title,
  children,
  primaryAction,
  secondaryAction,
  onClose,
}) => {
  const color = intentColor[type] || 'primary';
  const primary = primaryAction || {
    label: 'Aceptar',
    color,
    onClick: onClose,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: { xs: 1, md: 2 },
        },
      }}
    >
      {title && (
        <DialogTitle id="dialog-title">
          <Typography variant="h5" component="span">
            {title}
          </Typography>
        </DialogTitle>
      )}
      <DialogContent dividers sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>{children}</Stack>
      </DialogContent>
      {(primary || secondaryAction) && (
        <DialogActions sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          {secondaryAction && (
            <Button variant="text" color="inherit" onClick={secondaryAction.onClick}>
              {secondaryAction.label || 'Cancelar'}
            </Button>
          )}
          {primary && (
            <Button
              variant="contained"
              onClick={primary.onClick}
            >
              {primary.label}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AppDialog;
