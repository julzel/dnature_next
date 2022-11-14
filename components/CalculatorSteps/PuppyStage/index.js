import React from 'react'

// local imports
// components
import Button from '../../Button'


const PuppyStage = ({ dogProfile, styles, onButtonSelect }) => (
    <div className={styles.step}>
        <h2>Edad</h2>
        <Button onClick={() => onButtonSelect('stage', 'stage1')} selected={dogProfile.stage === 'stage1'}>
            Etapa 1 <span>menor a 7 meses</span>
        </Button>
        <Button onClick={() => onButtonSelect('stage', 'stage2')} selected={dogProfile.stage === 'stage2'}>
            Etapa 2 <span>7 meses a 1 año</span>
        </Button>
        <Button onClick={() => onButtonSelect('stage', 'stage3')} selected={dogProfile.stage === 'stage3'}>
            Etapa 3 <span>más de 1 año hasta su etapa adulta</span>
        </Button>
    </div>
)

export default PuppyStage
