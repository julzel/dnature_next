'use client';

import { ShoppingCartProvider } from '../features/Cart/state';

const Providers = ({ children }) => (
  <ShoppingCartProvider>{children}</ShoppingCartProvider>
);

export default Providers;
