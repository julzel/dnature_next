import React from 'react';
import Link from 'next/link';
import { Logo } from '../../DesignSystem';

// local imports

import NavigationBar from './NavigationBar';

const HeaderNav = ({ mobileNavigation, navigationItems }) => {
  return (
    <div className='header-navigation'>
      <div className='mobile-menu-control'>{mobileNavigation}</div>
      <div>
        <Link href={'/'} aria-label='Ir al inicio'>
          <Logo loading='eager' />
        </Link>
      </div>
      <div className='desktop-navigation'>
        <NavigationBar items={navigationItems} />
      </div>
    </div>
  );
};

export default HeaderNav;
