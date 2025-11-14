'use client';

import React, { useCallback } from 'react';
import {
  Drawer,
  Box,
  Divider,
  Stack,
  Button,
  Typography,
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
    >
      <Box
        component="section"
        sx={{
          width: 320,
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
        <Divider sx={{ my: 1 }} />
        <Stack spacing={1.5}>
          <Button variant="contained" color="primary" onClick={onCartClick}>
            Ver carrito
          </Button>
          <Button variant="outlined" color="primary" onClick={onAccountClick}>
            Iniciar sesión
          </Button>
          <WhatsAppLink
            phone="71848868"
            withIcon
            display="Contáctanos por WhatsApp"
            style={{
              width: '100%',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          />
        </Stack>
      </Box>
    </Drawer>
  );
};

export default SlideInMenu;
