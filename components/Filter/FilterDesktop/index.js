import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './FilterDesktop.module.scss'

const FilterDesktop = ({ optionsList, selectedOption }) => {
    const [activeOption, setActiveOption] = useState(selectedOption.id)

    return (
        <div className={styles.filter}>
            <ul className={styles.filterList}>
                {optionsList.map(item => {
                    return (
                        <li
                            role='button'
                            key={`filter-by-${item.id}`}
                            tabIndex='0'
                            onClick={() => {
                                item.onClick(item.id)
                                setActiveOption(item.id)
                            }}
                        >
                            <span className={activeOption === item.id ? styles.active : ''}>
                                {item.label}
                            </span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default FilterDesktop
