import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDna } from '@fortawesome/free-solid-svg-icons'

import styles from './DNAAnimation.module.scss'

const DNAAnimation = () => {
    return (
        <div className={styles.dnaAnimation}>
            <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faDna} />
            </div>
            Cargando...
        </div>
    )
}

export default DNAAnimation