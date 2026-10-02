import React from 'react';
import Link from 'next/link';
import Image from '../../Image';

// local imports

import NavigationBar from './NavigationBar';

const HeaderNav = ({ mobileNavigation, navigationItems }) => {
  return (
    <div>
      <div>{mobileNavigation}</div>
      <div>
        <Link href={'/'} aria-label='Ir al inicio'>
          <span>
            <Image
              src='/images/dnature-logo.svg'
              alt='DNAture Logo'
              width={75}
              height={58}
              loading='eager'
            />
          </span>
        </Link>
      </div>
      <div>
        <NavigationBar items={navigationItems} />
      </div>
    </div>
  );
};

export default HeaderNav;
