import React, { useContext } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

// local imports

// context
import { ScrollContext } from '../../../contexts/scroll-context';

// styles
import styles from './HeaderNav.module.scss'

// images
import logo1 from '../../../public/images/dnature-logo-transparent.svg'
import logo2 from '../../../public/images/dnature-logo.svg'
import NavigationBar from '../NavigationBar';

const TRIGGER_POSITION = 80;

const HeaderNav = ({
    changeBackground,
    showBackground,
    onMenuIconClick,
    showIcon,
    navigationItems,
}) => {
    const scrollPosition = useContext(ScrollContext)
    const switchBackground = showBackground || (changeBackground && scrollPosition >= TRIGGER_POSITION)

    return (
        <div
            className={styles.headerNav}
            style={{ 
                backgroundColor: switchBackground ? '#ffffff' : 'transparent',
                boxShadow: `-1px 1px 5px -1px ${switchBackground ? 'rgba(21,21,21,0.125)' : 'transparent'}`
            }}
        >
            {showIcon && (
                <span role='button' tabIndex='0' onClick={onMenuIconClick}>
                    <FontAwesomeIcon icon={faBars} size='lg' style={{ color: switchBackground ? 'rgb(92, 92, 92)' : 'rgba(255, 255, 255, 0.25)' }} />
                </span>
            )}
            {!showIcon && (
                <NavigationBar items={navigationItems} />
            )}
            <div className={styles.container}>
                <div
                    className={styles.logo1}
                    style={{ opacity: switchBackground ? 0 : 1 }}
                >
                    <Image
                        src={logo1}
                        alt='DNAture Logo'
                    />
                </div>
                <div
                    className={styles.logo2}
                    style={{ opacity: switchBackground ? 1 : 0 }}
                >
                    <Image
                        src={logo2}
                        alt='DNAture Logo'
                    />
                </div>
            </div>
        </div>
    );
}
 
export default HeaderNav