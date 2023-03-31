import React from "react";
import Image from "next/image";
import Link from "next/link";

// local imports
//styles
import styles from "./Products.module.scss";

// data
import AnimationBox from "../../../components/AnimationBox";

// components
import ProductButton from "./ProductButton";

const Products = ({ categories }) => {
  return (
    <div className={styles.products}>
      <h2 className={`title ${styles.title}`}>Nuestros productos</h2>
      <ul className={styles.productsCategories}>
        {categories &&
          categories.map((category, i) => {
            return (
              <li key={i} className={styles.productsCategory}>
                <Link href={`/productos?category=${category.slug}`} passHref>
                  <div>
                    <AnimationBox animation="fade-in-from-bottom">
                      <div className={styles.image}>
                        <Image
                          src={category.image.url}
                          alt={category.image.title}
                          width="100%"
                          height="100%"
                          layout="responsive"
                          objectFit="contain"
                        />
                      </div>
                    </AnimationBox>
                    <div className={styles.productsCategoryContent}>
                      <AnimationBox animation="fade-in-from-bottom">
                        <div className="flex-center-column">
                          <ProductButton text={category.label} />
                        </div>
                      </AnimationBox>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Products;
