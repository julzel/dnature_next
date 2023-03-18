import React, { useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './FilterDesktop.module.scss'

const FilterDesktop = ({ options, selected, onOptionSelect }) => {
    console.log(selected)

    return (
        <div className={styles.filter}>
            <ul className={styles.filterList}>
                {options.map(item => {
                    return (
                        <li
                            role='button'
                            key={`filter-by-${item.id}`}
                            tabIndex='0'
                            onClick={() =>onOptionSelect(item.id) }
                            className={selected === item.id ? styles.active : ''}
                        >
                            {item.label}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default FilterDesktop
