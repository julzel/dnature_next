import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

// local imports
// styles
import styles from "./SubHeader.module.scss";

const SubHeader = ({ totalCartItems }) => {
  return (
    <nav className={styles.subheader}>
      <Link href={"/cart"}>
        <span className={styles.link}>
          <FontAwesomeIcon icon={faCartShopping} size="sm" />
          {totalCartItems > 0 && (
            <span className={styles.badge}>{totalCartItems}</span>
          )}
        </span>
      </Link>
    </nav>
  );
};

export default SubHeader;
