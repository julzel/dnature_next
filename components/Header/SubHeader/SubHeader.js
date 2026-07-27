import React from "react";
import Link from "next/link";
import { ShoppingBag } from 'lucide-react';

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
          <ShoppingBag aria-hidden='true' size={27} strokeWidth={1.8} />
          {totalCartItems > 0 && (
            <span className={styles.badge}>{totalCartItems}</span>
          )}
        </span>
      </Link>
    </nav>
  );
};

export default SubHeader;
