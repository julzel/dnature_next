import React from 'react'

// local imports

// components
import HeaderNav from './HeaderNav'

// styles
import styles from './Header.module.scss'

const Header = () => (
    <header className={styles.header}>
        <HeaderNav />
    </header>
)
 
export default Header