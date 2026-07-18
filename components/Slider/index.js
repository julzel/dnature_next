'use client';

import { useEffect, useState } from 'react'

// local imports
import Slide from './Slide'
import styles from './Slider.module.scss'
import SliderControls from './SliderControls'

const Slider = ({ slides, interval = 5, autoplay }) => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const onBulletClick = newCurrentSlide => {
        if (currentSlide !== newCurrentSlide) {
            setCurrentSlide(newCurrentSlide)
        }
    }

    useEffect(() => {
        if (!autoplay || slides.length < 2) return undefined;

        const intervalId = setInterval(() => {
            if (
                document.visibilityState === 'hidden' ||
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) return;

            setCurrentSlide((current) => (current + 1) % slides.length);
        }, interval * 1000);

        return () => clearInterval(intervalId);
    }, [autoplay, interval, slides.length])

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
