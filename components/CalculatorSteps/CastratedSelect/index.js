import React from 'react'

// local imports
// components
import Button from '../../Button'


const CastratedSelect = ({ dogProfile, styles, onButtonSelect }) => (
    <div className={styles.step}>
        <h2>Castración</h2>
        <Button onClick={() => onButtonSelect('castrated', 'noCastrado')} selected={dogProfile.castrated === 'noCastrado'}>
            Sin castrar
        </Button>
        <Button onClick={() => onButtonSelect('castrated', 'castrado')} selected={dogProfile.castrated === 'castrado'}>
            Castrado
        </Button>
    </div>
)

export default CastratedSelect
