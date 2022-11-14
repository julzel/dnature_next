import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const Controls = ({ dogProfile, styles, hadleNextClick, handlePrevClick, handleCalc, restart, step, hideFinalControls, enableNext }) => {
    const validWeight = dogProfile.weight && dogProfile.weight !== ''
    return (
        <div className={styles.calculatorControls}>
            {step === 7 && !hideFinalControls && (
                <button onClick={restart} className={styles.actionButton}>
                    Calcular otra vez
                </button>
            )}
            {step === 6 && validWeight && (
                <button onClick={handleCalc} className={styles.actionButton}>
                    Calcular
                </button>
            )}
            {step > 0 && (
                <button onClick={handlePrevClick} className={styles.prevButton}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>Anterior</span>
                </button>
            )}
            {step < 6 && enableNext && (
                <button onClick={hadleNextClick}>
                    Siguiente
                </button>
            )}
        </div>
    )
}

export default Controls