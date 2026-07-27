import Link from "next/link";
import React from "react";
import { ChevronRight } from 'lucide-react';
import WhatsAppLink from "../../WhatsAppLink";

// local imports
import styles from "./DropdownMenu.module.scss";

const DropdownMenu = ({ items, onNavigate }) => {
  return (
    <nav
      id="mobile-navigation"
      className={styles.dropdown}
      aria-label="Navegación móvil"
    >
      <div className={styles.dropdownHeader}>
        <p>Explora DNAture</p>
        <h2>¿Qué estás buscando?</h2>
      </div>
      <ul className={styles.dropdownMenu}>
        {items.map((link, i) => (
          <li key={i} className={styles.item}>
            <Link href={link.href} onClick={onNavigate}>
              <span className={styles.itemLink}>
                <span>{link.label}</span>
                <ChevronRight aria-hidden='true' size={17} strokeWidth={1.8} />
              </span>
            </Link>
          </li>
        ))}
        <li className={styles.item}>
          <WhatsAppLink
            phone="50671848868"
            display="Ayuda por WhatsApp"
            withIcon
            className={styles.supportLink}
            onClick={onNavigate}
          />
        </li>
      </ul>
      <p className={styles.dropdownFooter}>
        Comida real para una vida más natural.
      </p>
    </nav>
  );
};

export default DropdownMenu;
