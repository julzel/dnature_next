import React from 'react'

// local imports
import styles from './AspectRatioBox.module.scss'

const AspectRatioBox = ({ aspectRatio, children }) => {
    return (
        <div
            className={styles.outer}
            style={{ paddingBottom:`${aspectRatio}%` }}
        >
            <div className={styles.inner}>
                {children}
            </div>
        </div>
    )
}
 
export default AspectRatioBox