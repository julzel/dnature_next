import React from 'react'

// local imports

// components
import HeaderNav from './HeaderNav'

// styles
import styles from './Header.module.scss'

const Header = ({ changeBackground }) => (
    <header className={styles.header}>
        <HeaderNav 
            changeBackground={changeBackground}
            
        />
    </header>
)
 
export default Header