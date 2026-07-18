'use client';

import React, { useState } from "react";

// local imports
import navigationItems from "./navigationItems";

// components
import Header from "./Header";

const HeaderContainer = () => {
  // state
  const [displayMenu, setDisplayMenu] = useState(false);

  return (
    <Header
      navigationItems={navigationItems}
      displayMobileMenu={displayMenu}
      onMobileMenuIconClick={() => setDisplayMenu((isOpen) => !isOpen)}
    />
  );
};

export default HeaderContainer;
