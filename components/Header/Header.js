import React from 'react';
import { MessageCircleMore, Snowflake } from 'lucide-react';
import { DNATURE_WHATSAPP_PHONE } from '../../constants/contact';

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
        Coordinamos envíos refrigerados en el GAM
      </span>
      <span className={styles.desktopTrustSignal}>
        <MessageCircleMore aria-hidden='true' size={13} strokeWidth={2} />
        Compra asistida · Atención personalizada
      </span>
      <a href={`https://wa.me/${DNATURE_WHATSAPP_PHONE}`} target='_blank' rel='noopener noreferrer'>
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
