'use client';

import React, { useMemo } from 'react';
import {
  Badge,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  alpha,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const UserCartActions = ({
  cartCount,
  userName,
  onAccountClick,
  onCartClick,
}) => {
  const initials = useMemo(
    () => (userName ? userName.slice(0, 1).toUpperCase() : null),
    [userName]
  );

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title={userName ? `Hola, ${userName}` : 'Inicia sesión'}>
        <IconButton
          aria-label="Ir a mi cuenta"
          onClick={onAccountClick}
          color="inherit"
          sx={{
            borderRadius: 2,
            backgroundColor: alpha('#FFFFFF', 0.12),
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#FFFFFF',
            width: 44,
            height: 44,
            '&:hover': {
              backgroundColor: alpha('#FFFFFF', 0.2),
            },
          }}
        >
          {initials ? (
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: 13,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              {initials}
            </Avatar>
          ) : (
            <PersonOutlineRoundedIcon />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title="Ver carrito">
        <IconButton
          aria-label="Abrir carrito"
          onClick={onCartClick}
          color="inherit"
          sx={{
            borderRadius: 2,
            backgroundColor: alpha('#FFFFFF', 0.12),
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#FFFFFF',
            width: 44,
            height: 44,
            '&:hover': {
              backgroundColor: alpha('#FFFFFF', 0.2),
            },
          }}
        >
          <Badge
            badgeContent={cartCount}
            color="secondary"
            overlap="circular"
            showZero
          >
            <ShoppingBagOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default UserCartActions;
