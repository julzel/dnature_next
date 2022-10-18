import React from 'react'
import styles from './Step1.module.scss'

const Step1 = ({ onNext, dismiss }) => {
    return (
        <div>
            <div>
                <h3>¡Hola!</h3>
                <p>
                    Parece que es tu primera vez por acá. En ese nos gustaría saber un poco más sobre tu
                    mascota(s), con el fin de brindarte una experiencia más personalizada.
                </p>
            </div>
            <div>
                <button onClick={onNext}>¡Claro!</button>
                <button onClick={dismiss}>Tal vez luego</button>
            </div>
        </div>
    )
}

export default Step1