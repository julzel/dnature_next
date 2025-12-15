'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stack, Button, alpha } from '@mui/material';

const NavLinks = ({ items, variant, onNavigate }) => {
  const pathname = usePathname();

  const normalizePath = useCallback((path) => {
    if (!path) return '/';
    const trimmed = path.replace(/\/+$/, '');
    return trimmed || '/';
  }, []);
  const currentPath = normalizePath(pathname);

  const handleNavigate = useCallback(() => {
    onNavigate?.();
  }, [onNavigate]);

  const isDesktop = variant === 'desktop';

  return (
    <Stack
      component="nav"
      aria-label="Navegación principal"
      direction={isDesktop ? 'row' : 'column'}
      spacing={isDesktop ? 3 : 1}
      sx={{
        flexGrow: isDesktop ? 1 : 0,
        width: isDesktop ? 'auto' : '100%',
        px: isDesktop ? 0 : 0.5,
        display: {
          xs: isDesktop ? 'none' : 'flex',
          md: 'flex',
        },
        justifyContent: isDesktop ? 'center' : 'flex-start',
        alignItems: isDesktop ? 'center' : 'stretch',
      }}
    >
      {items.map((item) => {
        const active = currentPath === normalizePath(item.href);
        return (
          <Button
            key={item.href}
            component={Link}
            href={item.href}
            size="medium"
            color="inherit"
            variant="text"
            onClick={handleNavigate}
            fullWidth={!isDesktop}
            aria-current={active ? 'page' : undefined}
            sx={{
              fontWeight: 600,
              justifyContent: isDesktop ? 'center' : 'flex-start',
              borderRadius: 999,
              textTransform: 'none',
              px: { xs: 1.5, md: 2.5 },
              py: { xs: 0.75, md: 1 },
              color: '#FFFFFF',
              border: '1px solid transparent',
              position: 'relative',
              minHeight: { xs: 44, md: 48 },
              fontSize: { xs: 14, md: 15 },
              lineHeight: 1.5,
              letterSpacing: 0.2,
              backgroundColor: active ? alpha('#FFFFFF', 0.18) : 'transparent',
              borderColor: active ? alpha('#FFFFFF', 0.4) : 'transparent',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
              '&:hover': {
                backgroundColor: alpha('#FFFFFF', active ? 0.28 : 0.16),
                borderColor: alpha('#FFFFFF', 0.3),
              },
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
