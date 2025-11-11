import React from 'react';
import { Modal as MuiModal, Fade, Backdrop, Box, IconButton } from '@mui/material';
import { X } from 'lucide-react';

const Modal = ({
  children,
  closeModal,
  open = true,
  keepMounted = false,
  disableBackdropClose = false,
  ariaLabel,
}) => {
  const handleClose = (_, reason) => {
    if (disableBackdropClose && reason === 'backdropClick') {
      return;
    }
    closeModal?.();
  };

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      keepMounted={keepMounted}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 200 } }}
      aria-label={ariaLabel}
    >
      <Fade in={open}>
        <Box>
          {closeModal && (
            <IconButton
              size="small"
              onClick={closeModal}
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </IconButton>
          )}
          {children}
        </Box>
      </Fade>
    </MuiModal>
  );
};

export default Modal;
