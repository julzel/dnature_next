import React, { useState } from 'react'

// local imports

// components
import HeaderNav from './HeaderNav'
import DropdownMenu from './DropdownMenu'

// styles
import styles from './Header.module.scss'

const Header = ({ changeBackground, showBackground }) => {
    // state
    const [displayMenu, setDisplayMenu] =  useState(false)

    return (
    <header className={styles.header}>
        <DropdownMenu show={displayMenu} />
        <HeaderNav 
            changeBackground={changeBackground}
            showBackground={showBackground || displayMenu}
            onMenuIconClick={() => setDisplayMenu(!displayMenu)}
        />
    </header>
)}
 
export default Header