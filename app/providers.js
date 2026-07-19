'use client';

import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { ShoppingCartProvider } from '../features/Cart/state';
import { lightTheme } from '../theme';

const Providers = ({ children }) => (
  <ThemeProvider theme={lightTheme}>
    <ShoppingCartProvider>
      <ScopedCssBaseline>{children}</ScopedCssBaseline>
    </ShoppingCartProvider>
  </ThemeProvider>
);

export default Providers;
