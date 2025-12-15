'use client';

import React, { useCallback } from 'react';
import {
  Drawer,
  Box,
  Divider,
  Stack,
  Button,
  Typography,
  alpha,
} from '@mui/material';

import NavLinks from './NavLinks';
import WhatsAppLink from '../WhatsAppLink';

const SlideInMenu = ({
  open,
  onClose,
  navigationItems,
  onAccountClick,
  onCartClick,
}) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: 'min(320px, 100vw)',
          backgroundColor: (theme) => theme.palette.category.wild,
          color: (theme) => theme.palette.common.white,
        },
      }}
    >
      <Box
        component="section"
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Navegación
        </Typography>
        <NavLinks
          items={navigationItems}
          variant="drawer"
          onNavigate={handleClose}
        />
        <Divider
          sx={{ my: 1, borderColor: (theme) => alpha(theme.palette.common.white, 0.2) }}
        />
        <Stack spacing={1.5}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onCartClick}
            sx={{ borderRadius: 999, fontWeight: 600 }}
          >
            Ver carrito
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onAccountClick}
            sx={{
              borderRadius: 999,
              fontWeight: 600,
              borderColor: (theme) => alpha(theme.palette.common.white, 0.5),
              color: (theme) => theme.palette.common.white,
              '&:hover': {
                borderColor: (theme) => theme.palette.common.white,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.08),
              },
            }}
          >
            Iniciar sesión
          </Button>
          <WhatsAppLink
            phone="71848868"
            withIcon
            display="Contáctanos por WhatsApp"
            sx={{
              width: '100%',
              justifyContent: 'center',
              fontWeight: 600,
              color: (theme) => theme.palette.common.white,
            }}
          />
        </Stack>
      </Box>
    </Drawer>
  );
};

export default SlideInMenu;
