import React, { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

// local imports

// styles
import styles from './CalculatorSteps.module.scss'

// util
import {
    calculatePortionSizeInGrams,
    isSupportedPortionProfile,
    isValidPetWeight,
    labelKeys,
    valueKeys,
} from '../../../util/portion-size'

// images
import dogLg from '../../../public/calculator/dog_mobile_lg.jpg'
import dogM from '../../../public/calculator/dog_mobile_peque_med.jpg'

const OptionButton = ({ children, isSelected, onClick }) => (
    <button
        type="button"
        className={isSelected ? styles.selected : ''}
        aria-pressed={isSelected}
        onClick={onClick}
    >
        {children}
    </button>
)

const CalculatorSteps = () => {
    const [step, setStep] = useState(0)
    const [value, setValue] = useState('')
    const [dogProfile, setDogProfile] = useState({})
    const [result, setResult] = useState(null)
    const [enableNext, setEnableNext] = useState(false)
    const [weightError, setWeightError] = useState(false)

    const restart = () => {
        setStep(0)
        setValue('')
        setDogProfile({})
        setResult(null)
        setEnableNext(false)
        setWeightError(false)
    }

    const getPortionSize = () => {

        if (isValidPetWeight(dogProfile.weight) && isSupportedPortionProfile(dogProfile)) {
            const portionSize = calculatePortionSizeInGrams(dogProfile)

            if (portionSize) {
                setResult(portionSize)
                setWeightError(false)
                setStep((currentStep) => currentStep + 1)
                return
            }
        }

        setWeightError(true)
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
        setValue(target.value)
        setDogProfile((previousProfile) => ({ ...previousProfile, weight: target.value }))
        setWeightError(false)
    }

    const renderControls = () => {
        const validWeight = isValidPetWeight(dogProfile.weight) && isSupportedPortionProfile(dogProfile)
        return (
            <div className={styles.calculatorControls}>
                {step === 7 && (
                    <button type="button" onClick={restart} className={styles.actionButton}>
                        Calcular otra vez
                    </button>
                )}
                {step === 6 && validWeight && (
                    <button type="button" onClick={getPortionSize} className={styles.actionButton}>
                        Calcular
                    </button>
                )}
                {step > 0 && (
                    <button type="button" onClick={handlePrevClick} className={styles.prevButton}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span>Anterior</span>
                    </button>
                )}
                {step < 6 && enableNext && (
                    <button type="button" onClick={hadleNextClick}>
                        Siguiente
                    </button>
                )}
            </div>
        )
    }

    const renderAgeSelect = (cb) => (
        <div className={styles.step}>
            <h2>Edad</h2>
            <OptionButton isSelected={dogProfile.age === 'adulto'} onClick={() => cb('age', 'adulto')}>Adulto</OptionButton>
            <OptionButton isSelected={dogProfile.age === 'cachorro'} onClick={() => cb('age', 'cachorro')}>Cachorro</OptionButton>
        </div>
    )

    const renderPuppyStage = (cb) => (
        <div className={styles.step}>
            <h2>Edad</h2>
            <OptionButton isSelected={dogProfile.stage === 'stage1'} onClick={() => cb('stage', 'stage1')}>Etapa 1 <span>menor a 7 meses</span></OptionButton>
            <OptionButton isSelected={dogProfile.stage === 'stage2'} onClick={() => cb('stage', 'stage2')}>Etapa 2 <span>7 meses a 1 año</span></OptionButton>
            <OptionButton isSelected={dogProfile.stage === 'stage3'} onClick={() => cb('stage', 'stage3')}>Etapa 3 <span>más de 1 año hasta su etapa adulta</span></OptionButton>
        </div>
    )

    const renderSizeSelect = (cb) => (
        <div className={styles.step}>
            <h2>Tamaño</h2>
            <OptionButton isSelected={dogProfile.size === 'pequeno'} onClick={() => cb('size', 'pequeno')}>Mini <span>menos de 4kg</span></OptionButton>
            <OptionButton isSelected={dogProfile.size === 'mediano'} onClick={() => cb('size', 'mediano')}>Pequeño - Mediano <span>5kg a 25kg</span></OptionButton>
            <OptionButton isSelected={dogProfile.size === 'grande'} onClick={() => cb('size', 'grande')}>Grande - Gigante <span>más de 25kg</span></OptionButton>
        </div>
    )

    const renderCastratedSelect = (cb) => (
        <div className={styles.step}>
            <h2>Castración</h2>
            <OptionButton isSelected={dogProfile.castrated === 'noCastrado'} onClick={() => cb('castrated', 'noCastrado')}>Sin castrar</OptionButton>
            <OptionButton isSelected={dogProfile.castrated === 'castrado'} onClick={() => cb('castrated', 'castrado')}>Castrado</OptionButton>
        </div>
    )

    const renderWeightStatusSelect = (cb) => (
        <div className={styles.step}>
            <h2>Contextura</h2>
            <OptionButton isSelected={dogProfile.weightStatus === 'bajoPeso'} onClick={() => cb('weightStatus', 'bajoPeso')}>Bajo peso</OptionButton>
            <OptionButton isSelected={dogProfile.weightStatus === 'pesoIdeal'} onClick={() => cb('weightStatus', 'pesoIdeal')}>Ideal</OptionButton>
            <OptionButton isSelected={dogProfile.weightStatus === 'sobrepeso'} onClick={() => cb('weightStatus', 'sobrepeso')}>Sobrepeso</OptionButton>
        </div>
    )

    const renderActivitySelect = (cb) => (
        <div className={styles.step}>
            <h2>Actividad física diaria</h2>
            <OptionButton isSelected={dogProfile.activity === 'sedentario'} onClick={() => cb('activity', 'sedentario')}>Sedentario</OptionButton>
            <OptionButton isSelected={dogProfile.activity === 'activo'} onClick={() => cb('activity', 'activo')}>Activo</OptionButton>
            {dogProfile.weightStatus !== 'sobrepeso' && (
                <OptionButton isSelected={dogProfile.activity === 'deportista'} onClick={() => cb('activity', 'deportista')}>Deportista</OptionButton>
            )}
        </div>
    )

    const renderWeightInput = () => (
        <div className={`${styles.step} ${styles.short}`}>
            <h2>Peso en kg</h2>
            <input required type="number" inputMode='decimal' min="0.1" max="100" step="0.1" onChange={handleOnChange} value={value} />
            {weightError && <p className={styles.warning}>Ingresa un peso válido entre 0.1kg y 100kg.</p>}
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
            <div className={styles.resultImage}>
                <Image
                    src={dogProfile.size === 'grande' ? dogLg : dogM}
                    alt="Perro de raza dálmata comiendo alimentación natural cruda"
                />
            </div>
        </div>
    )

    const updatedogProfile = (key, value) => {
        setDogProfile((previousProfile) => ({ ...previousProfile, [key]: value }))
        if (key === 'age' && value === 'cachorro') {
            setTimeout(() => setStep(5), 250)
        } else {
            if (key === 'activity') {
                setTimeout(() => setStep((currentStep) => currentStep + 2), 250)
            } else {
                setTimeout(() => setStep((currentStep) => currentStep + 1), 250)
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
    return (
        <div className={styles.calculatorSteps}>
            {renderStep(step)}
            {renderControls()}
        </div>
    )
}

export default CalculatorSteps
