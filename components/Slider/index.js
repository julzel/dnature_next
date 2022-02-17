import React, { useState } from 'react'

// local imports
import Slide from './Slide'
import styles from './Slider.module.scss'
import SliderControls from './SliderControls'

const Slider = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const onBulletClick = newCurrentSlide => {
        if (currentSlide !== newCurrentSlide) {
            setCurrentSlide(newCurrentSlide)
        }
    }

    return (
        <div className={styles.slider}>
            <div className={styles.container}>
                {slides.map(slide => (
                    <Slide
                        key={slide.id}
                        slide={slide}
                        currentSlide={currentSlide}
                    >
                        {slide.slideComponent}
                    </Slide>
                ))}
            </div>
            <SliderControls
                slides={slides}
                onBulletClick={onBulletClick}
            />
        </div>
    )
}
 
export default Slider