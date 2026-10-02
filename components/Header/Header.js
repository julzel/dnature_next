import React from 'react';
import { MessageCircleMore, Snowflake } from "../Icon";
import { DNATURE_WHATSAPP_PHONE } from '../../constants/contact';

// local imports

// components
import HeaderNav from './HeaderNav';
import HeaderActions from './HeaderActions';

const Header = ({ navigationItems, mobileNavigation }) => (
  <header>
    <div>
      <span>
        <Snowflake aria-hidden='true' size={13} strokeWidth={2} />
        Coordinamos envíos refrigerados en el GAM
      </span>
      <span>
        <MessageCircleMore aria-hidden='true' size={13} strokeWidth={2} />
        Compra asistida · Atención personalizada
      </span>
      <a href={`https://wa.me/${DNATURE_WHATSAPP_PHONE}`} target='_blank' rel='noopener noreferrer'>
        ¿Necesitas ayuda?
      </a>
    </div>

    <div>
      <div>
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
