import React from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * TODO
 * Properties:
 * - children
 * - slideDirection
 * - onClose
*/

// local imports

// styles
import styles from './Drower.module.scss'

const Drower = ({ children, close }) => {
    return (
        <div className={styles.drower}>
            <div className={styles.drowerContainer}>
                <div className={styles.drowerContainerHeader} onClick={() => close()}>
                    <span tabIndex='0' role="button">
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                </div>
                {children}
            </div>
        </div>
    );
}
 
export default Drower;