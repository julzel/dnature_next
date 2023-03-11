import React from "react";

// local imports
// styles
import styles from "./Header.module.scss";

// components
import HeaderNav from "./HeaderNav";
import SubHeader from "./SubHeader";
import DropdownMenu from "./DropdownMenu";

const Header = ({
  isMobile,
  displayMobileMenu,
  onMobileMenuIconClick,
  navigationItems,
  totalCartItems,
}) => (
  <header className={styles.header}>
    {isMobile && (
      <DropdownMenu show={displayMobileMenu} items={navigationItems} totalCartItems={totalCartItems} />
    )}
    <HeaderNav
      onMenuIconClick={onMobileMenuIconClick}
      showIcon={isMobile}
      navigationItems={navigationItems}
    />
    <SubHeader totalCartItems={totalCartItems} />
  </header>
);

export default Header;
