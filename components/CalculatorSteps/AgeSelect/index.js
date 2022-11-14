import React from 'react'

// local imports
// components
import Button from '../../Button'


const AgeSelect = ({ dogProfile, styles, onButtonSelect }) => (
    <div className={styles.step}>
        <h2>Edad</h2>
        <Button onClick={() => onButtonSelect('age', 'adulto')} selected={dogProfile.age === 'adulto'}>
            Adulto
        </Button>
        <Button onClick={() => onButtonSelect('age', 'cachorro')} selected={dogProfile.age === 'cachorro'}>
            Cachorro
        </Button>
    </div>
)

export default AgeSelect
