'use client';

import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import { lightTheme } from '../theme';
import ShoppingCartContextProvider from '../contexts/shopping-cart-context';

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <ShoppingCartContextProvider>{children}</ShoppingCartContextProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
