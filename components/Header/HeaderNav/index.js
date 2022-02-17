import React, { useState } from 'react'
import Image from 'next/image'

// local imports
import DropdownMenu from '../DropdownMenu'
import styles from './HeaderNav.module.scss'
import logo from '../../../public/images/logo_ppal-01.svg'

// local constants
const dropdownMenuItems = [{
    label: 'item'
},{
    label: 'item'
},{
    label: 'item'
}]

const HeaderNav = () => {
    const [displayDropDownMenu, setDisplayDropDownMenu] = useState(false)

    const onDNAtureMouseEnter = () => setDisplayDropDownMenu(true)

    const onDNAtureMouseLeave = () => setDisplayDropDownMenu(false)

    return (
        <div className={styles.headerNav}>
            <div className={styles.container}>
                <Image
                    src={logo}
                    alt='DNAture Logo'
                />
                <nav>
                    <div
                        className={styles.specialItem}
                        onMouseEnter={onDNAtureMouseEnter}
                        onMouseLeave={onDNAtureMouseLeave}
                    >
                        <span>DNAture</span>
                        {displayDropDownMenu && (
                            <DropdownMenu
                                items={dropdownMenuItems}
                                classnames={styles.dropdownMenu}
                            />
                        )}
                    </div>
                    <div className={styles.item}><a>item</a></div>
                    <div className={styles.item}><a>item</a></div>
                    <div className={styles.item}><a>item</a></div>
                </nav>
            </div>
        </div>
    );
}
 
export default HeaderNav