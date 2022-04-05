import React, { useState, useEffect } from 'react'

// local imports
import Slide from './Slide'
import styles from './Slider.module.scss'
import SliderControls from './SliderControls'

let intervalId;

const Slider = ({ slides, interval = 5, autoplay }) => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const onBulletClick = newCurrentSlide => {
        if (currentSlide !== newCurrentSlide) {
            setCurrentSlide(newCurrentSlide)
        }
    }

    useEffect(() => {
        if (autoplay) {
            intervalId = setInterval(() => {
                if (currentSlide < slides.length - 1) {
                    setCurrentSlide(currentSlide + 1)
                } else {
                    setCurrentSlide(0)
                }
            }, interval*1000)
            return () => {
                clearInterval(intervalId)
            }
        }
    }, [autoplay, currentSlide, interval, slides])

    return (
        <div className={styles.slider}>
            <div className={styles.container}>
                {slides.map((slide, i) => (
                    <Slide
                        key={i}
                        slide={slide}
                        currentSlide={currentSlide}
                    >
                        {slide}
                    </Slide>
                ))}
            </div>
            <SliderControls
                slides={slides}
                onBulletClick={onBulletClick}
                currentBullet={currentSlide}
            />
        </div>
    )
}
 
export default Slider