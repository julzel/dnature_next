import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

// local imports
// styles
import styles from "./SubHeader.module.scss";

const SubHeader = ({ isLoggedIn = false, totalCartItems, totalPets }) => {
  return (
    <nav className={styles.subheader}>
      {/* {(totalPets > 0 || true ) && (
        <Link href={"/mis-mascotas"} passHref>
          <span className={styles.link}>
            <FontAwesomeIcon icon={faDog} size="sm" />
          </span>
        </Link>
      )} */}
      <Link href={"/cart"} passHref>
        <span className={styles.link}>
          <ShoppingCart size={18} />
          {totalCartItems > 0 && (
            <span className={styles.badge}>{totalCartItems}</span>
          )}
        </span>
      </Link>
      {/* <Link href={"/login"} passHref>
        <span className={styles.link}>
          <FontAwesomeIcon
            icon={isLoggedIn ? faCircleUser : faCircleUserEmpty}
            size="sm"
          />
        </span>
      </Link> */}
    </nav>
  );
};

export default SubHeader;
