import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// local imports

// styles
import styles from './HeaderNav.module.scss';

import NavigationBar from './NavigationBar';

const HeaderNav = ({ onMenuIconClick, displayMobileMenu, navigationItems }) => {
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
      <button
        type='button'
        className={styles.menuButton}
        onClick={onMenuIconClick}
        aria-expanded={displayMobileMenu}
        aria-controls='mobile-navigation'
        aria-label={displayMobileMenu ? 'Cerrar menú' : 'Abrir menú'}
      >
          <FontAwesomeIcon icon={faBars} size='lg' />
      </button>
      <div className={styles.desktopNavigation}>
        <NavigationBar items={navigationItems} />
      </div>
    </div>
  );
};

export default HeaderNav;
