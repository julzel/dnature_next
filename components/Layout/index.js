import React from 'react'

// local imports
import Header from '../Header'
import Footer from '../Footer'

import styles from './Layout.module.scss'
import ScrollContextProvider from '../../contexts/scroll-context'

const Layout = ({ children, changeBackground }) => (
    <ScrollContextProvider>
        <div className={styles.layout}>
            <main>
                {children}
            </main>
            <Footer />
            <Header changeBackground />
        </div>
    </ScrollContextProvider>
);
 
export default Layout