import React from 'react'

// local imports

const SliderControls = ({
    slides,
    onBulletClick,
    currentBullet,
    idPrefix,
}) => {
    const handleKeyDown = (event, currentIndex) => {
        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % slides.length;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + slides.length) % slides.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = slides.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        onBulletClick(nextIndex);
        document.getElementById(`${idPrefix}-tab-${nextIndex}`)?.focus();
    };

    return (
        <div>
            <div role="tablist" aria-label="Seleccionar diapositiva">
                {slides.map((slide, i) => (
                    <button
                        type="button"
                        id={`${idPrefix}-tab-${i}`}
                        key={`bullet-${i}`}
                        onClick={() => onBulletClick(i)}
                        aria-label={`Ir a la diapositiva ${i + 1}`}
                        aria-controls={`${idPrefix}-panel-${i}`}
                        aria-selected={i === currentBullet}
                        tabIndex={i === currentBullet ? 0 : -1}
                        role="tab"
                        onKeyDown={(event) => handleKeyDown(event, i)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
 
export default SliderControls
