import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// local imports

// styles
import styles from './HeaderNav.module.scss';

import NavigationBar from './NavigationBar';

const HeaderNav = ({ navigationItems, mobileNavigation }) => {
  return (
    <div className={styles.headerNav}>
      <div className={styles.logoContainer}>
        <Link href={'/'}>
          <span className={styles.logo}>
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
      <div className={styles.mobileNavigation}>{mobileNavigation}</div>
      <div className={styles.desktopNavigation}>
        <NavigationBar items={navigationItems} />
      </div>
    </div>
  );
};

export default HeaderNav;
