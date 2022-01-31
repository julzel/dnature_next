import React from 'react'

// local imports
import styles from './SliderControls.module.scss'

const SliderControls = ({
    slides,
    onSlideNext,
    onSlidePrev,
    onBulletClick
}) => {
    return (
        <div className={styles.sliderControls}>
            <div className={styles.bullets}>
                {slides.map((slide, i) => (
                    <div
                        className={styles.bullet}
                        key={`bullet-${slide.id}`}
                        onClick={() => onBulletClick(i)}
                    />
                ))}
            </div>
        </div>
    );
}
 
export default SliderControls