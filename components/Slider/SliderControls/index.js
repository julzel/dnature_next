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
            <div className={styles.bullets} role="tablist" aria-label="Seleccionar diapositiva">
                {slides.map((slide, i) => (
                    <button
                        type="button"
                        className={`${styles.bullet} ${i === currentBullet ? styles.active : ''}`}
                        key={`bullet-${i}`}
                        onClick={() => onBulletClick(i)}
                        aria-label={`Ir a la diapositiva ${i + 1}`}
                        aria-selected={i === currentBullet}
                        role="tab"
                    />
                ))}
            </div>
        </div>
    );
}
 
export default SliderControls
