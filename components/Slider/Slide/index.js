import React, { useEffect, useRef } from 'react';

// local imports
import styles from './Slide.module.scss'

const Slide = ({
    slide,
    slideIndex,
    currentSlide,
    idPrefix,
    children
}) => {
    const isCurrentSlide = slideIndex === currentSlide;
    const slideRef = useRef(null);

    useEffect(() => {
        if (slideRef.current) {
            slideRef.current.inert = !isCurrentSlide;
        }
    }, [isCurrentSlide]);

    return (
        <div
            ref={slideRef}
            id={`${idPrefix}-panel-${slideIndex}`}
            role="tabpanel"
            aria-labelledby={`${idPrefix}-tab-${slideIndex}`}
            aria-hidden={!isCurrentSlide}
            tabIndex={isCurrentSlide ? 0 : -1}
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
