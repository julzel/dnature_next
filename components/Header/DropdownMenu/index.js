import Link from "next/link";
import React from "react";
import { ChevronRight } from "../../Icon";
import WhatsAppLink from "../../WhatsAppLink";
import { DNATURE_WHATSAPP_PHONE } from '../../../constants/contact';

// local imports

const DropdownMenu = ({ items, onNavigate }) => {
  return (
    <nav
      id="mobile-navigation"
      aria-label="Navegación móvil"
    >
      <div>
        <p>Explorá DNAture</p>
        <h2>¿Qué estás buscando?</h2>
      </div>
      <ul>
        {items.map((link, i) => (
          <li key={i}>
            <Link href={link.href} onClick={onNavigate}>
              <span>
                <span>{link.label}</span>
                <ChevronRight aria-hidden='true' size={17} strokeWidth={1.8} />
              </span>
            </Link>
          </li>
        ))}
        <li>
          <WhatsAppLink
            phone={DNATURE_WHATSAPP_PHONE}
            display="Ayuda por WhatsApp"
            withIcon
            onClick={onNavigate}
          />
        </li>
      </ul>
      <p>
        Comida real para una vida más natural.
      </p>
    </nav>
  );
};

export default DropdownMenu;
