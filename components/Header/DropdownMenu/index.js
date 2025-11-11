import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";
import WhatsAppLink from "../../WhatsAppLink";

// local imports
import styles from "./DropdownMenu.module.scss";

const DropdownMenu = ({ items, show }) => {
  return (
    <div
      className={styles.dropdown}
      style={{
        transform: show ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <ul className={styles.dropdownMenu}>
        {items.map((link, i) => (
          <li key={i} className={styles.item}>
                                      <Link href={link.href} passHref>
              <span className={styles.itemLink}>
                <span>{link.label}</span>
                <ChevronRight size={16} />
              </span>
            </Link>
          </li>
        ))}
        <li className={styles.item}>
          <span className={styles.itemLink}>
            <span>Contáctanos</span>
            <WhatsAppLink phone="71848868" iconOnly />
          </span>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
