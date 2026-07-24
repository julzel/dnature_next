import styles from './loading.module.scss';

const ProductLoading = () => (
  <div className={styles.loading} aria-label='Cargando producto' role='status'>
    <div className={styles.breadcrumb} />
    <div className={styles.productLayout}>
      <div className={styles.image} />
      <div className={styles.info}>
        <div className={styles.category} />
        <div className={styles.title} />
        <div className={styles.price} />
        <div className={styles.quantity} />
        <div className={styles.button} />
      </div>
    </div>
    <div className={styles.detail} />
    <span className='visually-hidden'>Cargando producto</span>
  </div>
);

export default ProductLoading;
