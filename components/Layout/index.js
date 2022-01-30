import React from 'react'

// local imports
import Header from '../Header'
import Footer from '../Footer'

import styles from './Layout.module.scss'

const Layout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}
 
export default Layout