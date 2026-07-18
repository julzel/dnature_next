import React from "react";

// local imports
// styles
import styles from "./Header.module.scss";

// components
import HeaderNav from "./HeaderNav";
import SubHeader from "./SubHeader";
const Header = ({ navigationItems, mobileNavigation }) => (
  <header className={styles.header}>
    <HeaderNav
      navigationItems={navigationItems}
      mobileNavigation={mobileNavigation}
    />
    <SubHeader />
  </header>
);

export default Header;
