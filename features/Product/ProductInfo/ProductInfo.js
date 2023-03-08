import React from "react";
import Link from "next/link";
import Image from "next/image";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// local imports
// styles
import styles from "./ProductInfo.module.scss";
import counterStyles from "./Counter.module.scss";
import addToCartStyles from "./AddToCart.module.scss";
import presentationStyles from "./PresentationSelect.module.scss";

// components
import Button from "../../../components/Button";
import CounterInput from "../../../components/CounterInput";
import CustomSelect from "../../../components/CustomSelect";

// consts
import { RECETAS_COMPLETAS } from "../consts";

const ProductInfo = ({
  productDetail,
  quantity,
  onQuantityChange,
  presentation,
  onPresentationChange,
  presentationOptions,
  onBuyItem,
  cartTotalItems,
}) => (
  <div className={styles.productInfo}>
    <div className={styles.images}>
      {productDetail.images?.map((img, i) => (
        <Image
          key={i}
          src={img.url}
          alt={img.title}
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="contain"
        />
      ))}
    </div>
    <div className={styles.info}>
      <div>
        <h1>{productDetail.productName}</h1>
        <p className={styles.price}>
          ₡{productDetail.precio}{" "}
          <span className={styles.small}>| {productDetail.medida}</span>
        </p>
      </div>
      <div className={styles.quantity}>
        <label htmlFor="quantity">Cantidad</label>
        <CounterInput
          classes={{ counter: counterStyles.counter }}
          id="quantity"
          name="quantity"
          maxValue={200}
          errorMessageText="La cantidad debe estar entre 1 y 200"
          value={quantity}
          onChange={onQuantityChange}
          controls
        />
      </div>
      {productDetail.category === RECETAS_COMPLETAS && (
        <div className={styles.presentation}>
          <label htmlFor="presentation">Presentación</label>
          <CustomSelect
            options={presentationOptions}
            selectedOption={presentation}
            onSelect={onPresentationChange}
            classes={{ select: presentationStyles.select }}
          />
          <p></p>
          {/* TODO: add dynamic selector: quantiy by type */}
        </div>
      )}
      <Button
        text={"Agregar al carrito"}
        onClick={() => onBuyItem(productDetail, quantity, presentation)}
        className={addToCartStyles.addToCart}
      />
      <Link href={"/cart"} passHref>
        <a>
          Ver Carrito
          <FontAwesomeIcon icon={faCartShopping} />
          {cartTotalItems > 0 && <span>({cartTotalItems})</span>}
        </a>
      </Link>
    </div>
  </div>
);

export default ProductInfo;
