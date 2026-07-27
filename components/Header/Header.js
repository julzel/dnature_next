import React from 'react';
import { ShieldCheck, Snowflake } from 'lucide-react';

// local imports
// styles
import styles from './Header.module.scss';

// components
import HeaderNav from './HeaderNav';
import HeaderActions from './HeaderActions';

const Header = ({ navigationItems, mobileNavigation }) => (
  <header className={styles.header}>
    <div className={styles.announcement}>
      <span>
        <Snowflake aria-hidden='true' size={13} strokeWidth={2} />
        Envíos refrigerados en el GAM
      </span>
      <span className={styles.desktopTrustSignal}>
        <ShieldCheck aria-hidden='true' size={13} strokeWidth={2} />
        Compra segura · Asesoría personalizada
      </span>
      <a href='https://wa.me/50671848868' target='_blank' rel='noopener noreferrer'>
        ¿Necesitas ayuda?
      </a>
    </div>

    <div className={styles.commerceBar}>
      <div className={styles.commerceInner}>
        <HeaderNav
          mobileNavigation={mobileNavigation}
          navigationItems={navigationItems}
        />
        <HeaderActions />
      </div>
    </div>
  </header>
);

export default Header;
