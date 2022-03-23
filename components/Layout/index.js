import React from 'react'

// local imports
import Header from '../Header'
import Footer from '../Footer'

import styles from './Layout.module.scss'
import ScrollContextProvider from '../../contexts/scroll-context'

const Layout = ({ children }) => (
    <ScrollContextProvider>
        <div className={styles.layout}>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    </ScrollContextProvider>
);
 
export default Layout