'use client';

import { useEffect, useRef, useState } from 'react'

// local imports
// styles
import styles from './AnimationBox.module.scss'

const animations = {
    'fade-in': {
        classname: styles.fadeIn,
        animation: styles.fadeInAnimation
    },
    'fade-in-from-center': {
        classname: styles.fadeInFromCenter,
        animation: styles.fadeInFromCenterAnimation
    },
    'fade-in-from-top': {
        classname: styles.fadeInFromTop,
        animation: styles.fadeInFromTopAnimation
    },
    'fade-in-from-bottom': {
        classname: styles.fadeInFromBottom,
        animation: styles.fadeInFromBottomAnimation
    },
    'fade-in-from-left': {
        classname: styles.fadeInFromLeft,
        animation: styles.fadeInFromLeftAnimation
    },
    'fade-in-from-right': {
        classname: styles.fadeInFromRight,
        animation: styles.fadeInFromRightAnimation
    },
    'grow-from-bottom': {
        classname: styles.growFromBottom,
        animation: styles.growFromBottomAnimation
    },
}

const AnimationBox = ({ children, animation }) => {
    const boxElement = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px' }
        );

        if (boxElement.current) observer.observe(boxElement.current);
        return () => observer.disconnect();
    }, [])

    const elemAnimation = animations[animation]
    const cssClass = visible ? `${elemAnimation.classname} ${elemAnimation.animation}` : elemAnimation.classname

    return (
        <div
            className={styles.animationBox}
            ref={boxElement}
        >
            <div className={cssClass}>
                {children}
            </div>
        </div>
    )
}
 
export default AnimationBox
