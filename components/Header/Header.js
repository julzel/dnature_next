import React from 'react';
import { faSnowflake, faShieldHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// local imports
// styles
import styles from './Header.module.scss';

// components
import HeaderNav from './HeaderNav';
import HeaderSearch from './HeaderSearch';
import NavigationBar from './HeaderNav/NavigationBar';
import SubHeader from './SubHeader';

const Header = ({ navigationItems, mobileNavigation }) => (
  <header className={styles.header}>
    <div className={styles.announcement}>
      <span>
        <FontAwesomeIcon icon={faSnowflake} />
        Envíos refrigerados en el GAM
      </span>
      <span className={styles.desktopTrustSignal}>
        <FontAwesomeIcon icon={faShieldHeart} />
        Compra segura · Asesoría personalizada
      </span>
      <a href='https://wa.me/50671848868' target='_blank' rel='noopener noreferrer'>
        ¿Necesitas ayuda?
      </a>
    </div>

    <div className={styles.commerceBar}>
      <div className={styles.commerceInner}>
        <HeaderNav mobileNavigation={mobileNavigation} />
        <SubHeader />
      </div>
    </div>

    <div className={styles.mobileSearch}>
      <HeaderSearch id='mobile-header-search' />
    </div>

    <div className={styles.navigationBar}>
      <NavigationBar items={navigationItems} />
    </div>
  </header>
);

export default Header;
