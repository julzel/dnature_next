import styles from './NutritionalAppointments.module.scss';

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
          <div className={styles['appointment-type']}>
            <h3 className={styles['appointment-type_title']}>
              Standard Nutritional Consultation
            </h3>
            <p className={styles['appointment-type_description']}>
              Our standard consultation offers a comprehensive assessment and
              tailored dietary advice.
            </p>
            <p className={styles['appointment-type_price']}>Price: $100</p>
            <button className={styles['appointment-type_cta']}>Book Now</button>
          </div>

          <div className={styles['appointment-type']}>
            <h3 className={styles['appointment-type_title']}>
              Extended Nutritional Consultation
            </h3>
            <p className={styles['appointment-type_description']}>
              Includes an in-depth analysis of your dietary habits, lifestyle,
              and a customized nutrition plan.
            </p>
            <p className={styles['appointment-type_price']}>Price: $150</p>
            <button className={styles['appointment-type_cta']}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionalAppointments;
