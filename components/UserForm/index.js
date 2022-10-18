import React, { useState } from 'react'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

/**
 * Workflow
 * 1: Bienvenida
 *  1.a: titulo
 *  1.b: parrafo
 *  1.c: Yes / No
 * 2: Calcular porcion
 * 3: pedir otros datos
 * 
 */

const STEPS = {
  ONE: 0,
  TWO: 1,
  THREE: 2,
}

const UserForm = ({ dismiss }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.ONE)

  const onNext = () => setCurrentStep(currentStep + 1)
  const onPrev = () => setCurrentStep(currentStep - 1)

  return (
    <div>
      {currentStep === STEPS.ONE && <Step1 onNext={onNext} dismiss={dismiss} />}
      {currentStep === STEPS.TWO && <Step2 onNext={onNext} />}
      {currentStep === STEPS.THREE && <Step3 onNext={onNext} onPrev={onPrev} />}
    </div>
  )
}

export default UserForm;
