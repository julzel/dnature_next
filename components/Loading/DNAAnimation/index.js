import React from 'react'
import { Dna } from 'lucide-react';

import styles from './DNAAnimation.module.scss'

const DNAAnimation = () => {
    return (
        <div className={styles.dnaAnimation}>
            <div className={styles.iconContainer}>
                <Dna size={48} />
            </div>
            Cargando...
        </div>
    )
}

export default DNAAnimation