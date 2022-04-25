import React, { useContext } from 'react'
import Image from 'next/image'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// local imports

// context
import { ScrollContext } from '../../../contexts/scroll-context';

// styles
import styles from './HeaderNav.module.scss'

// images
import logo1 from '../../../public/images/dnature-logo-transparent.svg'
import logo2 from '../../../public/images/dnature-logo.svg'

const TRIGGER_POSITION = 140;

const HeaderNav = ({
    changeBackground,
    showBackground,
    onMenuIconClick
}) => {
    const scrollPosition = useContext(ScrollContext)
    const switchBackground = showBackground || (changeBackground && scrollPosition >= TRIGGER_POSITION)

    return (
        <div
            className={styles.headerNav}
            style={{ 
                backgroundColor: switchBackground ? '#fefefa' : 'transparent',
                borderBottomColor: switchBackground ? '#fefefa' : 'transparent'
            }}
        >
            <span role='button' tabIndex='0' onClick={onMenuIconClick}>
                <FontAwesomeIcon icon={faEllipsis} size='lg' style={{ color: switchBackground ? 'rgb(58, 58, 58)' : 'rgba(255, 255, 255, 0.25)' }} />
            </span>
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