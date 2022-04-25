import React, { useContext } from 'react'
import Image from 'next/image'

// local imports

// context
import { ScrollContext } from '../../../contexts/scroll-context';

// styles
import styles from './HeaderNav.module.scss'

// images
import logo1 from '../../../public/images/dnature-logo-transparent.svg'
import logo2 from '../../../public/images/dnature-logo.svg'

const TRIGGER_POSITION = 140;

const HeaderNav = ({ changeBackground, showBackground }) => {
    console.log(showBackground)
    const scrollPosition = useContext(ScrollContext)
    const switchBackground = showBackground || (changeBackground && scrollPosition >= TRIGGER_POSITION)

    return (
        <div
            className={styles.headerNav}
            style={{ 
                backgroundColor: switchBackground ? '#f9f9f9' : 'transparent',
                borderBottomColor: switchBackground ? '#f9f9f9' : 'transparent'
            }}
        >
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