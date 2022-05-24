import React from 'react'

// local imports
// styles
import styles from './CatalogTitle.module.scss'

const CatalogTitle = ({ text }) => {
    return (
        <h2 className={`title ${styles.categoryTitle}`}>
            {text}
        </h2>
    )
}

export default CatalogTitle