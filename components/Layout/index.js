import React from 'react';

// local imports

// components
import Header from '../Header';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div className='site-layout'>
      <a className='skip-link' href='#main-content'>Saltar al contenido</a>
      <Header />
      <main id='main-content' tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
