import Link from "next/link";
import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
                <FontAwesomeIcon icon={faChevronRight} />
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
