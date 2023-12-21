import { faShieldDog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './NutritionalAppointments.module.scss';

const appointmentTypes = [
  {
    title: 'Standard Nutritional Consultation',
    description: 'Our standard consultation offers a comprehensive assessment and tailored dietary advice.',
    price: '$100',
  },
  {
    title: 'Extended Nutritional Consultation',
    description: 'Includes an in-depth analysis of your dietary habits, lifestyle, and a customized nutrition plan.',
    price: '$150',
  },
];

const NutritionalAppointments = () => {
  return (
    <div className={styles.container}>
      <div className={styles.appointments}>
        <div className={styles['appointments-info']}>
          <h2 className='title'>Consulta nutricional</h2>
          <p>
            Explore our personalized nutritional consultation services designed
            to fit your unique health goals.
          </p>
        </div>

        <div className={styles['appointments-types']}>
          {appointmentTypes.map((appointment, index) => (
            <div key={index} className={styles['appointment-type']}>
              <FontAwesomeIcon className={styles.icon} icon={faShieldDog} />
              <h3 className={styles['appointment-type_title']}>
                {appointment.title}
              </h3>
              <p className={styles['appointment-type_description']}>
                {appointment.description}
              </p>
              <p className={styles['appointment-type_price']}>
                Precio: {appointment.price}
              </p>
              <button className={styles['appointment-type_cta']}>Agendar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionalAppointments;
