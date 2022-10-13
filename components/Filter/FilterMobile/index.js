import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './FilterMobile.module.scss'

const FilterMobile = ({ optionsList, selectedOption }) => {
    const [showList, setShowList] = useState(false)
    const [activeOption, setActiveOption] = useState(selectedOption.id)

    return (
        <div className={styles.filter}>
            <div
                className={styles.filterHeader}
                role='button'
                tabIndex='0'
                onClick={() => setShowList(!showList)}
            >
                <span>Filtrar&nbsp;</span>
                <span
                    style={{
                        transform: `rotate(${showList ? '180' : '0'}deg)`,
                    }}
                    className={styles.icon}
                >
                    <FontAwesomeIcon icon={faChevronDown} />
                </span>
            </div>
            <ul className={`${styles.filterList} ${showList ? styles.show : ''}`}>
            {optionsList.map(item => {
                return (<li
                    role='button'
                    key={`filter-by-${item.id}`}
                    tabIndex='0'
                    onClick={() => {
                        item.onClick(item.id)
                        setActiveOption(item.id)
                    }}
                >
                    <span className={activeOption === item.id ? styles.active : '' }>
                        {item.label}
                    </span>
                </li>)
            })}
            </ul>
        </div>
    )
}
 
export default FilterMobile
