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
        mr: { xs: 2, md: 2.5 },
        height: { xs: 44, md: 52 },
        position: 'relative',
        top: 3,
      },
    }),
    []
  );

  return (
    <>
      <AppBar
        color="transparent"
        enableColorOnDark
        elevation={hideHeader ? 0 : 4}
        aria-hidden={hideHeader}
        sx={{
          backgroundColor: (theme) => theme.palette.category?.wild ?? '#124563',
          color: (theme) => theme.palette.common.white,
          position: 'sticky',
          top: 0,
          transform: hideHeader ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 300ms ease, box-shadow 200ms ease',
          pointerEvents: hideHeader ? 'none' : 'auto',
        }}
      >
        <Toolbar
          disableGutters
          component="nav"
          sx={{ minHeight: { xs: 56, md: 64 } }}
        >
          <Container
            maxWidth="xl"
            sx={{
              minHeight: { xs: 56, md: 64 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 1, md: 2 },
              paddingX: { xs: 2, md: 3 },
              flexWrap: 'nowrap',
            }}
          >
            <Box {...logoLinkProps}>
              <Image
                src={logo}
                alt="DNAture"
                width={180}
                height={60}
                priority
                style={{
                  height: '100%',
                  width: 'auto',
                }}
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
                  width: 48,
                  height: 48,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
                  border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.25)}`,
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
