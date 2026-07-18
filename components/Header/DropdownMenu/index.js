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
          <span className={styles.itemLink}>
            <span>Contáctanos</span>
            <WhatsAppLink phone="71848868" iconOnly onClick={onNavigate} />
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default DropdownMenu;
