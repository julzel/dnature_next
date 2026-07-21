import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

// local imports
// styles
import styles from "./SubHeader.module.scss";

const SubHeader = ({ totalCartItems }) => {
  return (
    <nav className={styles.subheader} aria-label='Carrito'>
      <Link
        href={"/cart"}
        aria-label={
          totalCartItems > 0
            ? `Abrir carrito: ${totalCartItems} ${
                totalCartItems === 1 ? 'producto' : 'productos'
              }`
            : 'Abrir carrito'
        }
      >
        <span className={styles.link}>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faBagShopping} />
          </span>
          <span className={styles.label}>
            <strong>Carrito</strong>
          </span>
          {totalCartItems > 0 && (
            <span className={styles.badge}>{totalCartItems}</span>
          )}
        </span>
      </Link>
    </nav>
  );
};

export default SubHeader;
