import React from 'react'

// local imports
// components
import Button from '../../Button'


const ActivitySelect = ({ dogProfile, styles, onButtonSelect }) => (
    <div className={styles.step}>
        <h2>Actividad física diaria</h2>
        <Button onClick={() => onButtonSelect('activity', 'sedentario')} selected={dogProfile.activity === 'sedentario'}>
            Sedentario
        </Button>
        <Button onClick={() => onButtonSelect('activity', 'activo')} selected={dogProfile.activity === 'activo'}>
            Activo
        </Button>
        <Button onClick={() => onButtonSelect('activity', 'deportista')} selected={dogProfile.activity === 'deportista'}>
            Deportista
        </Button>
    </div>
)

export default ActivitySelect
