import React from 'react';

// local imports
import styles from './Slide.module.scss'

const Slide = ({ slide }) => {
    return (
        <div
            className={styles.slide}
            style={{
                backgroundColor: slide.backgroundColor
            }}
        >
            {slide.text}
        </div>
    );
}
 
export default Slide;