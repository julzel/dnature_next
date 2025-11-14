'use client';

import React, { useMemo } from 'react';

import navigationItems from './navigationItems';
import Header from './Header';
import { useCartContext } from '../../contexts/shopping-cart-context';

const HeaderContainer = () => {
  const { cart } = useCartContext();
  const navItems = useMemo(() => navigationItems, []);
  const cartCount = cart?.totalItems ?? 0;

  return <Header navigationItems={navItems} cartCount={cartCount} />;
};

export default HeaderContainer;
