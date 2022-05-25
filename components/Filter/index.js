import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './Filter.module.scss'

const Filter = ({ optionsList, selectedOption }) => {
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
                <span>Catálogo&nbsp;</span>
                <span
                    style={{
                        transform: `rotate(${showList ? '180' : '0'}deg)`,
                    }}
                    className={styles.icon}
                >
                    <FontAwesomeIcon icon={faCaretDown} />
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
                    <span style={{
                        textDecoration: activeOption === item.id ? 'underline' : 'none'
                    }}
                    >
                        {item.label}
                    </span>
                </li>)
            })}
            </ul>
        </div>
    )
}
 
export default Filter
