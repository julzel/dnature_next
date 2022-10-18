import React from 'react'
import styles from './Step3.module.scss'

const Step3 = ({ onPrev }) => {
    return (
        <div>
            <div>
                Step3
            </div>
            <div>
                <button onClick={onPrev}>Volver</button>
            </div>
        </div>
    )
}
 
export default Step3