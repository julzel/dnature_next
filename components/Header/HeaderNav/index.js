import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { faGrip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// local imports

// styles
import styles from './HeaderNav.module.scss';

import Search from '../../../features/Search';

const HeaderNav = ({ mobileNavigation }) => {
  return (
    <div className={styles.headerNav}>
      <div className={styles.mobileNavigation}>{mobileNavigation}</div>
      <div className={styles.logoContainer}>
        <Link href={'/'} aria-label='Ir al inicio'>
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
      <Link href='/productos' className={styles.catalogLink}>
        <FontAwesomeIcon icon={faGrip} />
        <span>Productos</span>
      </Link>
      <div className={styles.desktopSearch}>
        <Search id='desktop-header-search' />
      </div>
    </div>
  );
};

export default HeaderNav;
