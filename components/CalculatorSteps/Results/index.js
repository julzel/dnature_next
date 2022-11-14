import React from 'react'

const Results = ({ dogProfile, styles, result}) => (
    <div className={`${styles.step} ${styles.short}`}>
        <div className={styles.profile}>
            <div className={styles.profileResults}>
                {result ? (
                    <div>
                        <h3>{result}g <span>al día</span></h3>
                    </div>
                ) : (
                    <p className={styles.warning}>Por favor ingrese un valor de peso correcto</p>
                )}
            </div>
            <div className={styles.profileDetails}>
                {Object.keys(dogProfile).map((key, i) => (<div key={i}>
                    <span>{labelKeys[key]}:&nbsp;</span>
                    <span>{key === 'weight' ? `${dogProfile[key]}kg` : valueKeys[dogProfile[key]]}</span>
                </div>))}
            </div>
        </div>
    </div>
)

export default Results