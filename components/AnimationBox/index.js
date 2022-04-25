import React, { useRef, useEffect, useCallback, useState } from 'react'

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

    const checkIfElementIsInViewPort = element => {
        const bounding = element.getBoundingClientRect();
        const elementHeight = element.offsetHeight/4;
        const elementWidth = element.offsetWidth;
        if (bounding.top >= -elementHeight 
            && bounding.left >= -elementWidth
            && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + elementWidth
            && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + elementHeight) {
    
            setVisible(true);
        }
    }

    const handleScroll = useCallback(() => {
        if (!visible) {
            boxElement?.current && checkIfElementIsInViewPort(boxElement.current);
        }
    }, [visible])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () =>  window.removeEventListener('scroll', handleScroll);
    }, [handleScroll])

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