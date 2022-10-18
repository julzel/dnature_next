import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

// local imports

// styles
import styles from './CalculatorSteps.module.scss'

// components
import Button from '../Button'

// util
import { calculatePortionSizeInGrams, labelKeys, valueKeys } from '../../util'

// images
import dogLg from '../../public/calculator/dog_mobile_lg.jpg'
import dogM from '../../public/calculator/dog_mobile_peque_med.jpg'

const CalculatorSteps = ({ hideFinalControls, onFinalStep }) => {
    const [step, setStep] = useState(0)
    const [value, setValue] = useState('')
    const [dogProfile, setDogProfile] = useState({})
    const [result, setResult] = useState(null)
    const [enableNext, setEnableNext] = useState(false)

    const restart = () => {
        setStep(0)
        setValue('')
        setDogProfile({})
        setResult(null)
        setEnableNext(false)
    }

    const getPortionSize = () => {

        if (dogProfile.weight !== '') { // add regex validation as well
            setResult(calculatePortionSizeInGrams(dogProfile))
            setStep(step + 1)
        }
    }

    const handlePrevClick = () => {
        if (step > 0) {
            if (step === 5) {
                setStep(0)
            } else if (step === 6) {
                if (dogProfile.age === 'cachorro') {
                    setStep(step - 1)    
                } else {
                    setStep(step - 2)
                }
            } else {
                setStep(step - 1)
            }
        } else {
            restart()
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

    const renderControls = () => {
        const validWeight = dogProfile.weight && dogProfile.weight !== ''
        return (
            <div className={styles.calculatorControls}>
                {step === 7 && !hideFinalControls && (
                    <button onClick={restart} className={styles.actionButton}>
                        Calcular otra vez
                    </button>
                )}
                {step === 6 && validWeight && (
                    <button onClick={getPortionSize} className={styles.actionButton}>
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

    const renderAgeSelect = (cb) => (
        <div className={styles.step}>
            <h2>Edad</h2>
            <Button role="button" tabIndex='0' onClick={() => cb('age', 'adulto')} selected={dogProfile.age === 'adulto'}>
                Adulto
            </Button>
            <Button role="button" tabIndex='0' onClick={() => cb('age', 'cachorro')} selected={dogProfile.age === 'cachorro'}>
                Cachorro
            </Button>
        </div>
    )

    const renderPuppyStage = (cb) => (
        <div className={styles.step}>
            <h2>Edad</h2>
            <div role="button" tabIndex='0' onClick={() => cb('stage', 'stage1')} selected={dogProfile.stage === 'stage1'}>
                Etapa 1 <span>menor a 7 meses</span>
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('stage', 'stage2')} selected={dogProfile.stage === 'stage2'}>
                Etapa 2 <span>7 meses a 1 año</span>
            </div>
            <div role="button" tabIndex='0' onClick={() => cb('stage', 'stage3')} selected={dogProfile.stage === 'stage3'}>
                Etapa 3 <span>más de 1 año hasta su etapa adulta</span>
            </div>
        </div>
    )

    const renderSizeSelect = (cb) => (
        <div className={styles.step}>
            <h2>Tamaño</h2>
            <Button role="button" tabIndex='0' onClick={() => cb('size', 'pequeno')} selected={dogProfile.size === 'pequeno'}>
                Mini <span>menos de 4kg</span>
            </Button>
            <Button role="button" tabIndex='0' onClick={() => cb('size', 'mediano')} selected={dogProfile.size === 'mediano'}>
                Pequeño - Mediano <span>5kg a 25kg</span>
            </Button>
            <Button role="button" tabIndex='0' onClick={() => cb('size', 'grande')} selected={dogProfile.size === 'grande'}>
                Grande - Gigante <span>más de 25kg</span>
            </Button>
        </div>
    )

    const renderCastratedSelect = (cb) => (
        <div className={styles.step}>
            <h2>Castración</h2>
            <Button role="button" tabIndex='0' onClick={() => cb('castrated', 'noCastrado')} selected={dogProfile.castrated === 'noCastrado'}>
                Sin castrar
            </Button>
            <Button role="button" tabIndex='0' onClick={() => cb('castrated', 'castrado')} selected={dogProfile.castrated === 'castrado'}>
                Castrado
            </Button>
        </div>
    )

    const renderWeightStatusSelect = (cb) => (
        <div className={styles.step}>
            <h2>Contextura</h2>
            <Button role="button" tabIndex='0' onClick={() => cb('weightStatus', 'bajoPeso')} selected={dogProfile.weightStatus === 'bajoPeso'}>
                Bajo peso
            </Button>
            <Button role="button" tabIndex='0' onClick={() => cb('weightStatus', 'pesoIdeal')} selected={dogProfile.weightStatus === 'pesoIdeal'}>
                Ideal
            </Button>
            <Button role="button" tabIndex='0' onClick={() => cb('weightStatus', 'sobrepeso')} selected={dogProfile.weightStatus === 'sobrepeso'}>
                Sobrepeso
            </Button>
        </div>
    )

    const renderActivitySelect = (cb) => (
        <div className={styles.step}>
            <h2>Actividad física diaria</h2>
            <Button role="button" tabIndex='0' onClick={() => cb('activity', 'sedentario')} selected={dogProfile.activity === 'sedentario'}>
                Sedentario
            </Button>
            <Button role="button" tabIndex='0' onClick={() => cb('activity', 'activo')} selected={dogProfile.activity === 'activo'}>
                Activo
            </Button>
            <Button role="button" tabIndex='0' onClick={() => cb('activity', 'deportista')} selected={dogProfile.activity === 'deportista'}>
                Deportista
            </Button>
        </div>
    )

    const renderWeightInput = () => (
        <div className={`${styles.step} ${styles.short}`}>
            <h2>Peso en kg</h2>
            <input required type="number" inputMode='number' onChange={handleOnChange} value={value} />
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
            {/* <div className={styles.resultImage}>
                <Image
                    src={dogProfile.size === 'grande' ? dogLg : dogM}
                    alt="Perro de raza dálmata comiendo alimentación natural cruda"
                />
            </div> */}
        </div>
    )

    const updatedogProfile = (key, value) => {
        dogProfile[key] = value
        setDogProfile({ ...dogProfile })
        if (key === 'age' && value === 'cachorro') {
            setTimeout(() => setStep(5), 250)
        } else {
            if (key === 'activity') {
                setTimeout(() => setStep(step + 2), 250)
            } else {
                setTimeout(() => setStep(step + 1), 250)
            }
        }
    }

    const renderStep = currentStep => steps[currentStep](updatedogProfile)

    const steps = {
        0: renderAgeSelect,
        1: renderSizeSelect,
        2: renderCastratedSelect,
        3: renderWeightStatusSelect,
        4: renderActivitySelect,
        5: renderPuppyStage,
        6: renderWeightInput,
        7: renderResults
    }

    useEffect(() => onFinalStep(step === 7), [step, onFinalStep])

    return (
        <div className={styles.calculatorSteps}>
            {renderStep(step)}
            {renderControls()}
        </div>
    )
}

export default CalculatorSteps