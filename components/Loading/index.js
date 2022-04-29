import React from 'react'

// local imports
// styles
import styles from './Loading.module.scss'

// components
import DNAAnimation from './DNAAnimation'


const Loading = () => {
    return (
        <div className={styles.loading}>
            <DNAAnimation />
        </div>
    )
}
 
export default Loading