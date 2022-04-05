import React from 'react'

// local imports
import styles from './SliderControls.module.scss'

const SliderControls = ({
    slides,
    onBulletClick,
    currentBullet
}) => {
    return (
        <div className={styles.sliderControls}>
            <div className={styles.bullets}>
                {slides.map((slide, i) => (
                    <div
                        className={`${styles.bullet} ${i === currentBullet ? styles.active : ''}`}
                        key={`bullet-${i}`}
                        onClick={() => onBulletClick(i)}
                    />
                ))}
            </div>
        </div>
    );
}
 
export default SliderControls