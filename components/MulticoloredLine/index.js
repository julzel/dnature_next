import React from 'react'

import styles from './MulticoloredLine.module.scss'

const MulticoloredLine = () => {
    return (
        <div className={styles.multicoloredBorder}>
            <div style={{backgroundColor: '#0086C2'}} />
            <div style={{backgroundColor: '#D20000'}} />
            <div style={{backgroundColor: '#800085'}} />
            <div style={{backgroundColor: '#006D01'}} />
        </div>
    )
}
 
export default MulticoloredLine