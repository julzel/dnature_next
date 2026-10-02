import React, { useEffect, useRef } from 'react';

// local imports

const Slide = ({
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
            hidden={!isCurrentSlide}
            tabIndex={isCurrentSlide ? 0 : -1}
        >
            {children}
        </div>
    );
}
 
export default Slide;
