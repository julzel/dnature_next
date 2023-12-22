import { faShieldDog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './NutritionalAppointments.module.scss';

const appointmentTypes = [
  {
    title: 'Consulta Nutricional Básica',
    description:
      'Comprender las bases nutricionales y obtener recomendaciones personalizadas. Requiere llenar anamnesis y últimos exámenes de sangre.',
    price: '$60',
    followUp: 'Revisión adicional disponible por $30.',
  },
  {
    title: 'Plan Nutricional Personalizado',
    description:
      'Para condiciones específicas o nutrición especializada. Requiere anamnesis, caso clínico completo, exámenes y dictamen médico veterinario.',
    price: '$90',
    followUp:
      'Incluye seguimiento en semana 4. Ajustes gratuitos dentro de las primeras 4 semanas. Segunda valoración después de 4 semanas por $30.',
  },
];

const NutritionalAppointments = () => {
  return (
    <div className={styles.container}>
      <div className={styles.appointments}>
        <div className={styles['appointments-info']}>
          <h2 className='title'>Consultas Nutricionales para Mascotas</h2>
          <p>
            Descubre nuestros servicios personalizados de consulta nutricional,
            diseñados para las necesidades únicas de tu mascota.
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
              <button className={styles['appointment-type_cta']}>
                Agendar
              </button>
              <p className={styles['appointment-type_followUp']}>
                {appointment.followUp}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionalAppointments;
