import React from 'react'

import styles from './OurDiet.module.scss'

const OurDiet = () => {
    return (
        <section className={styles.ourDiet}>
            <h2>
                <span>Nutrición balanceada natural</span>
                <span>Qué tipo de dieta utilizamos</span>
            </h2>
            <div>
                <div>
                    <p>
                        Utilizamos una dieta acorde a las necesidades de los <span>carnívoros facultativos y carnívoros 
                        estrictos</span>.
                    </p>
                </div>
                <div>
                    <p>
                        Todos nuestros ingredientes cumplen con un propósito y función por lo que no nos adherimos a
                        dietas pre estipuladas, sino que nos enfocamos en <span>promover el equilibrio holístico que
                        exite entre nutrición, salud y el bienestar físico, social y emocional de tu mascota</span>.
                    </p>
                </div>
                <div>
                    <p>
                        Libre de almidones, preservantes; cruda, balanceada y provee los nutrientes esenciales para un
                        correcto mantenimiento de su salud.
                    </p>
                </div>
            </div>
        </section>
    )
}
 
export default OurDiet