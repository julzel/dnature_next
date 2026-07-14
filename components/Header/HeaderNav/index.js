import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// local imports

// styles
import styles from './HeaderNav.module.scss';

import NavigationBar from './NavigationBar';

const HeaderNav = ({ onMenuIconClick, showIcon, navigationItems }) => {
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
            />
          </span>
        </Link>
      </div>
      {showIcon ? (
        <span role='button' tabIndex='0' onClick={onMenuIconClick}>
          <FontAwesomeIcon icon={faBars} size='lg' />
        </span>
      ) : (
        <NavigationBar items={navigationItems} />
      )}
    </div>
  );
};

export default HeaderNav;
