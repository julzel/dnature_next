import React from 'react';
import { X } from 'lucide-react';

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
                        <X size={24} />
                    </span>
                </div>
                {children}
            </div>
        </div>
    );
}
 
export default Drower;