import React, { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Button from '../../../components/Button'

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
                if (dogProfile.age === 'puppy') {
                    setStep((currentStep) => currentStep - 1)
                } else {
                    setStep((currentStep) => currentStep - 2)
                }
            } else {
                setStep((currentStep) => currentStep - 1)
            }
        } else {
            restart()
        }
    }

    const hadleNextClick = () => {
        setEnableNext(false)
        setStep((currentStep) => currentStep + 1)
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
                    <Button variant="secondary" fullWidth onClick={restart}>
                        Calcular otra vez
                    </Button>
                )}
                {step === 6 && validWeight && (
                    <Button variant="primary" fullWidth onClick={getPortionSize}>
                        Calcular
                    </Button>
                )}
                {step > 0 && (
                    <Button
                        variant="tertiary"
                        iconStart={<FontAwesomeIcon icon={faChevronLeft} />}
                        onClick={handlePrevClick}
                    >
                        Anterior
                    </Button>
                )}
                {step < 6 && enableNext && (
                    <Button variant="primary" onClick={hadleNextClick}>
                        Siguiente
                    </Button>
                )}
            </div>
        )
    }

    const renderAgeSelect = (cb) => (
        <div className={styles.step}>
            <h2>Edad</h2>
            <OptionButton isSelected={dogProfile.age === 'adult'} onClick={() => cb('age', 'adult')}>Adulto</OptionButton>
            <OptionButton isSelected={dogProfile.age === 'puppy'} onClick={() => cb('age', 'puppy')}>Cachorro</OptionButton>
        </div>
    )

    const renderPuppyStage = (cb) => (
        <div className={styles.step}>
            <h2>Edad</h2>
            <OptionButton isSelected={dogProfile.puppyStage === 'stage1'} onClick={() => cb('puppyStage', 'stage1')}>Etapa 1 <span>menor a 7 meses</span></OptionButton>
            <OptionButton isSelected={dogProfile.puppyStage === 'stage2'} onClick={() => cb('puppyStage', 'stage2')}>Etapa 2 <span>7 meses a 1 año</span></OptionButton>
            <OptionButton isSelected={dogProfile.puppyStage === 'stage3'} onClick={() => cb('puppyStage', 'stage3')}>Etapa 3 <span>más de 1 año hasta su etapa adulta</span></OptionButton>
        </div>
    )

    const renderSizeSelect = (cb) => (
        <div className={styles.step}>
            <h2>Tamaño</h2>
            <OptionButton isSelected={dogProfile.size === 'small'} onClick={() => cb('size', 'small')}>Mini <span>menos de 4kg</span></OptionButton>
            <OptionButton isSelected={dogProfile.size === 'medium'} onClick={() => cb('size', 'medium')}>Pequeño - Mediano <span>5kg a 25kg</span></OptionButton>
            <OptionButton isSelected={dogProfile.size === 'large'} onClick={() => cb('size', 'large')}>Grande - Gigante <span>más de 25kg</span></OptionButton>
        </div>
    )

    const renderCastratedSelect = (cb) => (
        <div className={styles.step}>
            <h2>Castración</h2>
            <OptionButton isSelected={dogProfile.castrated === 'notCastrated'} onClick={() => cb('castrated', 'notCastrated')}>Sin castrar</OptionButton>
            <OptionButton isSelected={dogProfile.castrated === 'castrated'} onClick={() => cb('castrated', 'castrated')}>Castrado</OptionButton>
        </div>
    )

    const renderWeightStatusSelect = (cb) => (
        <div className={styles.step}>
            <h2>Contextura</h2>
            <OptionButton isSelected={dogProfile.bodyContexture === 'underWeight'} onClick={() => cb('bodyContexture', 'underWeight')}>Bajo peso</OptionButton>
            <OptionButton isSelected={dogProfile.bodyContexture === 'ideal'} onClick={() => cb('bodyContexture', 'ideal')}>Ideal</OptionButton>
            <OptionButton isSelected={dogProfile.bodyContexture === 'overWeight'} onClick={() => cb('bodyContexture', 'overWeight')}>Sobrepeso</OptionButton>
        </div>
    )

    const renderActivitySelect = (cb) => (
        <div className={styles.step}>
            <h2>Actividad física diaria</h2>
            <OptionButton isSelected={dogProfile.dailyActivity === 'sedentary'} onClick={() => cb('dailyActivity', 'sedentary')}>Sedentario</OptionButton>
            <OptionButton isSelected={dogProfile.dailyActivity === 'active'} onClick={() => cb('dailyActivity', 'active')}>Activo</OptionButton>
            {dogProfile.bodyContexture !== 'overWeight' && (
                <OptionButton isSelected={dogProfile.dailyActivity === 'veryActive'} onClick={() => cb('dailyActivity', 'veryActive')}>Deportista</OptionButton>
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
                    src={dogProfile.size === 'large' ? dogLg : dogM}
                    alt="Perro de raza dálmata comiendo alimentación natural cruda"
                />
            </div>
        </div>
    )

    const updatedogProfile = (key, value) => {
        setDogProfile((previousProfile) => ({ ...previousProfile, [key]: value }))
        if (key === 'age' && value === 'puppy') {
            setTimeout(() => setStep(5), 250)
        } else {
            if (key === 'dailyActivity') {
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
