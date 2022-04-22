import React from 'react';

// local imports
import styles from './Slide.module.scss'

const Slide = ({
    slide,
    currentSlide,
    children
}) => {
    // TODO
    // calcular la diferencia entre currentSlide and nextSlide
    return (
        <div
            className={styles.slide}
            style={{
                backgroundColor: slide.backgroundColor,
                // webkitTransform: `translateX(${-currentSlide * 100}%)`,
                transform: `translateX(${-currentSlide * 100}%)`,
            }}
        >
            {children}
        </div>
    );
}
 
export default Slide;