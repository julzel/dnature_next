'use client';

import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { lightTheme } from '../theme';
import ShoppingCartContextProvider from '../contexts/shopping-cart-context';

export default function Providers({ children }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <ShoppingCartContextProvider>
        {children}
      </ShoppingCartContextProvider>
    </ThemeProvider>
  );
}
