import React, { useRef } from 'react'
import SVG from 'react-inlinesvg'

// local imports
// styles
import styles from './RibbonTitle.module.scss'

// images
import ribbonBlue from '../../public/images/ribbonBlue.svg'
import ribbonOrange from '../../public/images/ribbonOrange.svg'

const ribbonTypes = {
    blue: ribbonBlue,
    orange: ribbonOrange
}

const RibbonTitle = ({ children, type, flip }) => {
    return (
        <div className={styles.ribbonTitle}>
            <div className={styles.RibbonTitleContainer}>
                <div style={{
                        transform: flip ? 'scaleX(-1)' : 'scaleX(1)'
                    }}
                >
                    <SVG src={`${process.env.PUBLIC_URL}/images/ribbonOrange.svg`} width={24} height="auto" title="Menu" />
                </div>
                {children}
            </div>
        </div>
    )
}
 
export default RibbonTitle
