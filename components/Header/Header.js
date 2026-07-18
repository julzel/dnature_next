import React from "react";

// local imports
// styles
import styles from "./Header.module.scss";

// components
import HeaderNav from "./HeaderNav";
import SubHeader from "./SubHeader";
import DropdownMenu from "./DropdownMenu";

const Header = ({
  displayMobileMenu,
  onMobileMenuIconClick,
  navigationItems,
  totalCartItems,
}) => (
  <header className={styles.header}>
    {displayMobileMenu && (
      <DropdownMenu items={navigationItems} />
    )}
    <HeaderNav
      onMenuIconClick={onMobileMenuIconClick}
      displayMobileMenu={displayMobileMenu}
      navigationItems={navigationItems}
    />
    <SubHeader totalCartItems={totalCartItems} />
  </header>
);

export default Header;
