import React, { useEffect, useState } from 'react'

// local imports

// styles
import styles from './CalculatorSteps.module.scss'

// components
import AgeSelect from './AgeSelect'
import Controls from './Controls'
import PuppyStage from './PuppyStage'
import SizeSelect from './SizeSelect'
import CastratedSelect from './CastratedSelect'
import WeightStatusSelect from './WeigthStatusSelect'
import ActivitySelect from './ActivitySelect'
import WeightInput from './WeightInput'
import Results from './Results'

// util
import { calculatePortionSizeInGrams, labelKeys, valueKeys } from '../../util'

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

    const renderAgeSelect = (cb) => <AgeSelect
        dogProfile={dogProfile}
        styles={styles}
        onButtonSelect={cb}
    />

    const renderPuppyStage = (cb) => <PuppyStage
        dogProfile={dogProfile}
        styles={styles}
        onButtonSelect={cb}
    />

    const renderSizeSelect = (cb) => <SizeSelect
        dogProfile={dogProfile}
        styles={styles}
        onButtonSelect={cb}
    />

    const renderCastratedSelect = (cb) => <CastratedSelect
        dogProfile={dogProfile}
        styles={styles}
        onButtonSelect={cb}
    />

    const renderWeightStatusSelect = (cb) => <WeightStatusSelect
        dogProfile={dogProfile}
        styles={styles}
        onButtonSelect={cb}
    />

    const renderActivitySelect = (cb) => <ActivitySelect
        dogProfile={dogProfile}
        styles={styles}
        onButtonSelect={cb}
    />

    const renderWeightInput = () => <WeightInput
        styles={styles}
        handleOnChange={handleOnChange}
        value={value}
    />

    const renderResults = () => <Results
        dogProfile={dogProfile}
        styles={styles}
        result={result}
    />

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

    const renderStep = currentStep =>  (updatedogProfile)

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
            <Controls
                dogProfile={dogProfile}
                styles={styles}
                hadleNextClick={hadleNextClick}
                handlePrevClick={handlePrevClick}
                handleCalc={getPortionSize}
                restart={restart}
                step={step}
                hideFinalControls={hideFinalControls}
                enableNext={enableNext}
            />
        </div>
    )
}

export default CalculatorSteps