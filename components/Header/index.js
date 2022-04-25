import React from 'react'

// local imports

// components
import HeaderNav from './HeaderNav'

// styles
import styles from './Header.module.scss'

const Header = ({ changeBackground, showBackground }) => (
    <header className={styles.header}>
        <HeaderNav 
            changeBackground={changeBackground}
            showBackground={showBackground}
        />
    </header>
)
 
export default Header