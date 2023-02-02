import React, { useState } from 'react';

// local imports
import useWindow from '../../hooks/useWindow';
import navigationItems from './navigationItems';

// components
import HeaderNav from './HeaderNav';
import DropdownMenu from './DropdownMenu';

// styles
import styles from './Header.module.scss';

const Header = () => {
  // state
  const [displayMenu, setDisplayMenu] = useState(false);
  const isMobile = useWindow();

  return (
    <header className={styles.header}>
      {isMobile && <DropdownMenu show={displayMenu} items={navigationItems} />}
      <HeaderNav
        onMenuIconClick={() => setDisplayMenu(!displayMenu)}
        showIcon={isMobile}
        navigationItems={navigationItems}
      />
    </header>
  );
};

export default Header;
