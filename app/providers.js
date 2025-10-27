'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import { lightTheme } from '../theme';
import createEmotionCache from '../emotionCache';
import ShoppingCartContextProvider from '../contexts/shopping-cart-context';

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={lightTheme}>
        <ShoppingCartContextProvider>
          <ScopedCssBaseline>
            {children}
          </ScopedCssBaseline>
        </ShoppingCartContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
