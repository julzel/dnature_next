'use client';

import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import ShoppingCartContextProvider from '../contexts/shopping-cart-context';
import { lightTheme } from '../theme';

const Providers = ({ children }) => (
  <ThemeProvider theme={lightTheme}>
    <ShoppingCartContextProvider>
      <ScopedCssBaseline>{children}</ScopedCssBaseline>
    </ShoppingCartContextProvider>
  </ThemeProvider>
);

export default Providers;
