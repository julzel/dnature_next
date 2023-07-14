import React, { useState } from "react";

// local imports
import useWindow from "../../hooks/useWindow";
import navigationItems from "./navigationItems";

// components
import Header from "./Header";

const HeaderContainer = () => {
  // state
  const [displayMenu, setDisplayMenu] = useState(false);
  const isMobile = useWindow();

  return (
    <Header
      isMobile={isMobile}
      navigationItems={navigationItems}
      displayMobileMenu={displayMenu}
      onMobileMenuIconClick={() => setDisplayMenu(!displayMenu)}
    />
  );
};

export default HeaderContainer;
