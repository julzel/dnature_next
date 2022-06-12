import React, { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

// local imports
// styles
import styles from './Calculator.module.scss'

// images
import dogLg from '../../../public/calculator/dog_mobile_lg.jpg'
import dogM from '../../../public/calculator/dog_mobile_peque_med.jpg'

// util
import { calculatePortionSizeInGrams, labelKeys, valueKeys } from '../../../util'

const Calculator = () => {
    const [step, setStep] = useState(0)
    const [value, setValue] = useState('')
    const [dogProfile, setDogProfile] = useState({})
    const [result, setResult] = useState(null)
    const [enableNext, setEnableNext] = useState(false)
    const [startCalculator, setStartCaluculator] = useState(false)

    const restart = () => {
        setStep(0)
        setValue('')
        setDogProfile({})
        setResult(null)
        setEnableNext(false)
    }

    const getPortionSize = () => {
        console.log(dogProfile)
        if (dogProfile.weight !== '') { // add regex validation as well
            setResult(calculatePortionSizeInGrams(dogProfile))
            setStep(step + 1)
        }
    }

    const handlePrevClick = () => {
        if (step > 0) {
            setStep(step - 1)
        } else {
            restart()
            setStartCaluculator(false)
        }
    }

    const hadleNextClick = () => {
        setEnableNext(false)
        setStep(step + 1)
    }

    const handleOnChange = ({ target }) => {
        dogProfile.weight = target.value
        setValue(target.value)
    }

    const renderIntro = () => (
        <>
            <h2>¿Cuánto alimento le debo dar a mi mascota?</h2>
            <p>
                Tu mascota irá teniendo diferentes necesidades nutricionales a lo largo de su vida.
            </p>
            <p>
                La cantidad de alimento que requiere diariamente depende de distintos factores
                que determinan la cantidad de energía y nutrientes que necesita para llevar una vida plena.
            </p>
            <p>
                Calcula la ración diaria de las Recetas completas de DNAture
                completando algunos datos de tu mascota.
            </p>
            <div>
                <button onClick={() => setStartCaluculator(true)} className={styles.actionButton}>
                    Empezar
                </button>
            </div>
        </>
    )

    const renderControls = () => {
        const validWeight = dogProfile.weight && dogProfile.weight !== ''
        return (
            <div>
                {step === 6 && (
                    <button onClick={restart} className={styles.actionButton}>
                        Calcular otra vez
                    </button>
                )}
                {step === 5 && validWeight && (
                    <button onClick={getPortionSize} className={styles.actionButton}>
                        Calcular
                    </button>
                )}
                <button onClick={handlePrevClick} className={styles.prevButton}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>Anterior</span>
                </button>
                {step < 5 && enableNext && (
                    <button onClick={hadleNextClick}>
                        Siguiente
                    </button>
                )}
            </div>
        )
    }

    const renderAgeSelect = (cb) => (
        <div className={styles.step}>
            <h2>Edad</h2>
            <div role="button" tabIndex='0' onClick={() => cb('age', 'adulto')} className={dogProfile.age === 'adulto' ? styles.selected : ''}>
                Adulto
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('age', 'cachorro')} className={dogProfile.age === 'cachorro' ? styles.selected : ''}>
                Cachorro
            </div>
        </div>
    )

    const renderSizeSelect = (cb) => (
        <div className={styles.step}>
            <h2>Tamaño</h2>
            <div role="button" tabIndex='0' onClick={() => cb('size', 'pequeno')} className={dogProfile.size === 'pequeno' ? styles.selected : ''}>
                Mini <span>(menos de 4kg)</span>
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('size', 'mediano')} className={dogProfile.size === 'mediano' ? styles.selected : ''}>
                Pequeño - Mediano <span>(5kg a 25kg)</span>
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('size', 'grande')} className={dogProfile.size === 'grande' ? styles.selected : ''}>
                Grande - Gigante <span>(más de 25kg)</span>
            </div>
        </div>
    )

    const renderCastratedSelect = (cb) => (
        <div className={styles.step}>
            <h2>Castración</h2>
            <div role="button" tabIndex='0' onClick={() => cb('castrated', 'noCastrado')} className={dogProfile.castrated === 'noCastrado' ? styles.selected : ''}>
                Sin castrar
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('castrated', 'castrado')} className={dogProfile.castrated === 'castrado' ? styles.selected : ''}>
                Castrado
            </div>
        </div>
    )

    const renderWeightStatusSelect = (cb) => (
        <div className={styles.step}>
            <h2>Contextura</h2>
            <div role="button" tabIndex='0' onClick={() => cb('weightStatus', 'bajoPeso')} className={dogProfile.weightStatus === 'bajoPeso' ? styles.selected : ''}>
                Bajo peso
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('weightStatus', 'pesoIdeal')} className={dogProfile.weightStatus === 'pesoIdeal' ? styles.selected : ''}>
                Ideal
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('weightStatus', 'sobrepeso')} className={dogProfile.weightStatus === 'sobrepeso' ? styles.selected : ''}>
                Sobrepeso
            </div>
        </div>
    )

    const renderActivitySelect = (cb) => (
        <div className={styles.step}>
            <h2>Actividad física diaria</h2>
            <div role="button" tabIndex='0' onClick={() => cb('activity', 'sedentario')} className={dogProfile.activity === 'sedentario' ? styles.selected : ''}>
                Sedentario
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('activity', 'activo')} className={dogProfile.activity === 'activo' ? styles.selected : ''}>
                Activo
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('activity', 'deportista')} className={dogProfile.activity === 'deportista' ? styles.selected : ''}>
                Deportista
            </div>
        </div>
    )

    const renderWeightInput = () => (
        <div className={`${styles.step} ${styles.short}`}>
            <h2>Peso en kg</h2>
            <input required type="number" onChange={handleOnChange} value={value} />
        </div>
    )

    const renderResults = () => (
        <div className={`${styles.step} ${styles.short}`}>
            <div className={styles.profile}>
                <div className={styles.profileResults}>
                    {result ? (
                        <div>
                            <h3>{result}g <span>al día</span></h3>
                        </div>
                    ) : (
                        <p className={styles.warning}>Por favor ingrese un valor de peso correcto</p>
                    )}
                </div>
                <div className={styles.profileDetails}>
                    {Object.keys(dogProfile).map((key, i) => (<div key={i}>
                        <span>{labelKeys[key]}:&nbsp;</span>
                        <span>{key === 'weight' ? `${dogProfile[key]}kg` : valueKeys[dogProfile[key]]}</span>
                    </div>))}
                </div>
            </div>
        </div>
    )

    const updatedogProfile = (key, value) => {
        dogProfile[key] = value
        setDogProfile({ ...dogProfile })
        // fix if key === age and value === cachorro
        setTimeout(() => setStep(step + 1), 250)
    }

    const renderStep = currentStep => steps[currentStep](updatedogProfile)

    const steps = {
        0: renderAgeSelect,
        1: renderSizeSelect,
        2: renderCastratedSelect,
        3: renderWeightStatusSelect,
        4: renderActivitySelect,
        5: renderWeightInput,
        6: renderResults
    }

    return (
        <section className={styles.calculator}>
            {startCalculator ? (
                <div>
                    <div className={styles.calculatorSteps}>{renderStep(step)}</div>
                    {step === 6 && (
                        <div className={styles.resultImage}>
                            <Image
                                src={dogProfile.size === 'grande' ? dogLg : dogM}
                                alt="Perro de raza dálmata comiendo alimentación natural cruda"
                            />
                        </div>
                    )}
                    <div className={styles.calculatorControls}>{renderControls()}</div>
                </div>
            ) : (
                <div className={styles.calculatorIntro}>
                    {renderIntro()}
                </div>
            )}
        </section>
    )
}

export default Calculator