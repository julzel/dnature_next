import { useState, useContext } from 'react'

// local imports
// styles
import styles from './Calculator.module.scss'

// contexts
import { GlobalContext } from '../../contexts/global-context'

// components
import CalculatorSteps from './CalculatorSteps'
import Drower from '../../components/Drower'

const Calculator = () => {
    const [startCalculator, setStartCalculator] = useState(false)
    const { setDisableGlobalScroll } = useContext(GlobalContext)

    const handleStartClick = () => {
        setStartCalculator(true)
        setDisableGlobalScroll(true)
    }

    const handleClose = () => {
        setStartCalculator(false)
        setDisableGlobalScroll(false)
    }

    const renderIntro = () => (
        <>
            <h2>¿Cuánto alimento le debo dar a mi mascota?</h2>
            <p>
                Tu mascota irá teniendo diferentes necesidades nutricionales a lo largo de su vida.
                La cantidad de alimento que requiere diariamente depende de distintos factores
                que determinan la cantidad de energía y nutrientes que necesita para llevar una vida plena.
            </p>
            <p>
                Calcula la ración diaria de las Recetas completas de DNAture
                completando algunos datos de tu mascota.
            </p>
            <div>
                <button
                    onClick={handleStartClick}
                    className={styles.actionButton}
                >
                    Empezar
                </button>
            </div>
        </>
    )

    return (
        <section className={styles.calculator}>
            <div className={styles.calculatorIntro}>
                {renderIntro()}
            </div>
            {startCalculator && (
                <Drower close={handleClose}>
                    <CalculatorSteps />
                </Drower>
            )}
        </section>
    )
}

export default Calculator