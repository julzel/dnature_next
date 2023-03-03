import React from 'react';
import Image from 'next/image';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// local imports
// styles
import styles from './ProductInfo.module.scss';
import Button from '../../../components/Button';
import InputNumber from '../../../components/Form/InputNumber';
import Link from 'next/link';

const ProductInfo = ({
  productDetail,
  quantity,
  onQuantityChange,
  onBuyItem,
}) => (
  <div className={styles.productInfo}>
    <div className={styles.images}>
      {productDetail.images?.map((img, i) => (
        <Image
          key={i}
          src={img.url}
          alt={img.title}
          width='100%'
          height='100%'
          layout='responsive'
          objectFit='contain'
        />
      ))}
    </div>
    <div className={styles.info}>
      <div>
        <h1>{productDetail.productName}</h1>
        <p className={styles.price}>
          ₡{productDetail.precio}{' '}
          <span className={styles.small}>| {productDetail.medida}</span>
        </p>
      </div>
      <InputNumber
        className={styles.quantity}
        label='Cantidad'
        id='quantity'
        name='quantity'
        min={1}
        max={200}
        errorMessageText='La cantidad debe estar entre 1 y 200'
        value={quantity}
        setValue={onQuantityChange}
      />
      <Button
        text={'Comprar'}
        onClick={() => onBuyItem(productDetail, quantity)}
        className={styles.buyButton}
      />
      <Link href={'/cart'} passHref>
        <a>
          Ver Carrito
          <FontAwesomeIcon icon={faCartShopping} />
        </a>
      </Link>
    </div>
  </div>
);

export default ProductInfo;
