import React, { useState } from 'react'

// local imports
import Slide from './Slide'
import styles from './Slider.module.scss'
import SliderControls from './SliderControls'

const slides = [
    {
        id: 'sld_0',
        text: 'slider 0',
        backgroundColor: '#d8e2dc'
    },
    {
        id: 'sld_1',
        text: 'slider 1',
        backgroundColor: '#ffe5d9'
    },
    {
        id: 'sld_2',
        text: 'slider 2',
        backgroundColor: '#fbfaf0'
    },
    {
        id: 'sld_3',
        text: 'slider 3',
        backgroundColor: '#ffe9ee'
    },
    {
        id: 'sld_4',
        text: 'slider 4',
        backgroundColor: '#ffdde4'
    },
]

const Slider = () => {
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
                    />
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