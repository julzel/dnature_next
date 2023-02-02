import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// local imports

// styles
import styles from './HeaderNav.module.scss';

// images
import logo from '../../../public/images/dnature-logo.svg';
import NavigationBar from './NavigationBar';

const HeaderNav = ({ onMenuIconClick, showIcon, navigationItems }) => {
  return (
    <div className={styles.headerNav}>
      <div className={styles.logoContainer}>
        <Link href={'/'} passHref>
          <span className={styles.logo}>
            <Image src={logo} alt='DNAture Logo' />
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
