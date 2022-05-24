import React from 'react'

// local imports
import styles from './Tabs.module.scss'

const Tabs = ({ ariaLabel, tabs, onTabSelect }) => {
    return (
        <div className={styles.tabs}>
            <div
                role='tablist'
                aria-label={ariaLabel}
                className={styles.tabList}
            >
                {tabs.map((tab) => (
                    <button
                        role="tab"
                        onClick={() => onTabSelect(tab.id)}
                        key={tab.id}
                    >
                        {tab.label.split(' ')[0]}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Tabs