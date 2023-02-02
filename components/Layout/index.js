import React from 'react';

// local imports
// styles
import styles from './Layout.module.scss';

// components
import Header from '../Header';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div className={`${styles.layout}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
