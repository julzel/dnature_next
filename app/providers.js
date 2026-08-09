'use client';

import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { ShoppingCartProvider } from '../features/Cart/state';
import { AccountDemoProvider } from '../features/AccountDemo/model/account-demo-context';
import { lightTheme } from '../theme';

const Providers = ({ children }) => (
  <ThemeProvider theme={lightTheme}>
    <AccountDemoProvider>
      <ShoppingCartProvider>
        <ScopedCssBaseline>{children}</ScopedCssBaseline>
      </ShoppingCartProvider>
    </AccountDemoProvider>
  </ThemeProvider>
);

export default Providers;
