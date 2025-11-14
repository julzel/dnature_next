'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stack, Button } from '@mui/material';

const NavLinks = ({ items, variant, onNavigate }) => {
  const pathname = usePathname();

  const handleNavigate = useCallback(() => {
    onNavigate?.();
  }, [onNavigate]);

  const isDesktop = variant === 'desktop';

  return (
    <Stack
      component="nav"
      aria-label="Navegación principal"
      direction={isDesktop ? 'row' : 'column'}
      spacing={isDesktop ? 1.5 : 0.5}
      sx={{
        flexGrow: isDesktop ? 1 : 0,
        display: {
          xs: isDesktop ? 'none' : 'flex',
          md: 'flex',
        },
        justifyContent: isDesktop ? 'center' : 'flex-start',
      }}
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Button
            key={item.href}
            component={Link}
            href={item.href}
            size="medium"
            color={active ? 'primary' : 'inherit'}
            variant={active ? 'contained' : 'text'}
            onClick={handleNavigate}
            fullWidth={!isDesktop}
            sx={{
              fontWeight: 600,
              justifyContent: isDesktop ? 'center' : 'flex-start',
              borderRadius: 999,
              textTransform: 'none',
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
};

export default NavLinks;
