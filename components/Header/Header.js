'use client';

import React, { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  IconButton,
  Stack,
  alpha,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import logo from '../../public/images/dnature-logo.svg';
import NavLinks from './NavLinks';
import UserCartActions from './UserCartActions';
import SlideInMenu from './SlideInMenu';
import useHideOnScroll from './useHideOnScroll';

const Header = ({ navigationItems, cartCount = 0, userName }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const hideHeader = useHideOnScroll();

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleCartClick = useCallback(() => {
    router.push('/carrito');
    setMobileMenuOpen(false);
  }, [router]);

  const handleAccountClick = useCallback(() => {
    router.push('/login');
    setMobileMenuOpen(false);
  }, [router]);

  const logoLinkProps = useMemo(
    () => ({
      component: Link,
      href: '/',
      sx: {
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
      },
    }),
    []
  );

  return (
    <>
      <AppBar
        color="primary"
        elevation={hideHeader ? 0 : 4}
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          position: 'sticky',
          top: hideHeader ? -120 : 0,
          transition: 'top 220ms ease, box-shadow 200ms ease',
        }}
      >
        <Toolbar disableGutters component="nav">
          <Container
            maxWidth="xl"
            sx={{
              minHeight: { xs: 64, md: 88 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              paddingX: { xs: 2, md: 3 },
            }}
          >
            <Box {...logoLinkProps}>
              <Image
                src={logo}
                alt="DNAture"
                width={108}
                height={60}
                priority
              />
            </Box>

            <NavLinks
              items={navigationItems}
              variant="desktop"
              onNavigate={handleCloseMobileMenu}
            />

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ flexShrink: 0 }}
            >
              <UserCartActions
                cartCount={cartCount}
                userName={userName}
                onAccountClick={handleAccountClick}
                onCartClick={handleCartClick}
              />
              <IconButton
                aria-label="Abrir menú de navegación"
                onClick={handleToggleMobileMenu}
                color="inherit"
                sx={{
                  display: { xs: 'inline-flex', md: 'none' },
                  borderRadius: 2,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.grey[100], 0.7),
                }}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <SlideInMenu
        open={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        navigationItems={navigationItems}
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick}
      />
    </>
  );
};

export default Header;
