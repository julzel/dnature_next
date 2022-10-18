import React, { useState } from 'react'
import CalculatorSteps from '../../CalculatorSteps'
import styles from './Step2.module.scss'

/**
 * Cuantas mascotas
 * un formulario por mascota
 * formulario:
 * Nombre
 * Ra
 */

const Step2 = ({ onNext }) => {
    const [showNextButton, setShowNextButton] = useState(false)

    const onFinalStep = isFinalStep => setShowNextButton(isFinalStep)

    return (
        <div>
            <CalculatorSteps onFinalStep={onFinalStep} hideFinalControls={true}  />
            {showNextButton && (
                <div>
                    <button onClick={onNext}>Siguiente</button>
                </div>
            )}
        </div>
    )
}
 
export default Step2