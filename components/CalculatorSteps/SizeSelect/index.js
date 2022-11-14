import React from 'react'

// local imports
// components
import Button from '../../Button'


const SizeSelect = ({ dogProfile, styles, onButtonSelect }) => (
    <div className={styles.step}>
        <h2>Tamaño</h2>
        <Button onClick={() => onButtonSelect('size', 'pequeno')} selected={dogProfile.size === 'pequeno'}>
            Mini <span>menos de 4kg</span>
        </Button>
        <Button onClick={() => onButtonSelect('size', 'mediano')} selected={dogProfile.size === 'mediano'}>
            Pequeño - Mediano <span>5kg a 25kg</span>
        </Button>
        <Button onClick={() => onButtonSelect('size', 'grande')} selected={dogProfile.size === 'grande'}>
            Grande - Gigante <span>más de 25kg</span>
        </Button>
    </div>
)

export default SizeSelect
