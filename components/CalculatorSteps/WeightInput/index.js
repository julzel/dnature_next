import React from 'react'

const WeightInput = ({ styles, handleOnChange, value }) => (
    <div className={`${styles.step} ${styles.short}`}>
        <h2>Peso en kg</h2>
        <input required type="number" inputMode='number' onChange={handleOnChange} value={value} />
    </div>
)

export default WeightInput