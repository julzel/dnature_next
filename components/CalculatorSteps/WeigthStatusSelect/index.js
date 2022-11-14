import React from 'react'

// local imports
// components
import Button from '../../Button'


const WeightStatusSelect = ({ dogProfile, styles, onButtonSelect }) => (
    <div className={styles.step}>
        <h2>Contextura</h2>
        <Button onClick={() => onButtonSelect('weightStatus', 'bajoPeso')} selected={dogProfile.weightStatus === 'bajoPeso'}>
            Bajo peso
        </Button>
        <Button onClick={() => onButtonSelect('weightStatus', 'pesoIdeal')} selected={dogProfile.weightStatus === 'pesoIdeal'}>
            Ideal
        </Button>
        <Button onClick={() => onButtonSelect('weightStatus', 'sobrepeso')} selected={dogProfile.weightStatus === 'sobrepeso'}>
            Sobrepeso
        </Button>
    </div>
)

export default WeightStatusSelect
