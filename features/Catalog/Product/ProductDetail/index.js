import Image from 'next/image';

import styles from './ProductDetail.module.scss';

const ProductDetail = ({ productDetail }) => {
  const benefitIcons = (productDetail.iconos || []).slice(0, 4);

  return (
    <div className={styles.productDetail}>
      {productDetail.description && (
        <section className={styles.detailSection} aria-labelledby='description-title'>
          <h2 id='description-title'>Descripción</h2>
          <p className={styles.description}>{productDetail.description}</p>
        </section>
      )}
      {productDetail.ingredientes && (
        <section className={styles.detailSection} aria-labelledby='ingredients-title'>
          <h2 id='ingredients-title'>Ingredientes</h2>
          <p className={styles.ingredients}>{productDetail.ingredientes}</p>
        </section>
      )}
      {benefitIcons.length > 0 && (
        <section className={styles.benefits} aria-label='Beneficios del producto'>
          {benefitIcons.map((icon, index) => (
            <div className={styles.benefit} key={`${icon.url}-${index}`}>
              <span className={styles.icon}>
                <Image
                  src={icon.url}
                  alt=''
                  width={40}
                  height={40}
                  sizes='40px'
                />
              </span>
              <span>{icon.title}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
