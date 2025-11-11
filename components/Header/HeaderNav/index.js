import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';

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
            <Image src={logo} alt='DNAture Logo' width={75} height={58} loading='eager' />
          </span>
        </Link>
      </div>
      {showIcon ? (
        <span role='button' tabIndex='0' onClick={onMenuIconClick}>
          <Menu size={24} />
        </span>
      ) : (
        <NavigationBar items={navigationItems} />
      )}
    </div>
  );
};

export default HeaderNav;
