import React from "react";
import Link from "next/link";

// local imports
//styles
import styles from "./Products.module.scss";
import ContentfulImage from "../../../components/ContentfulImage";

// data
import AnimationBox from "../AnimationBox";

// components
import ProductButton from "./ProductButton";

const Products = ({ categories = [] }) => {
  const availableCategories = Array.isArray(categories)
    ? categories.filter(
        (category) =>
          category?.slug && category?.label && category?.image?.url
      )
    : [];

  return (
    <div className={styles.products}>
      <h2 className={`title ${styles.title}`}>Nuestros productos</h2>
      <ul className={styles.productsCategories}>
        {availableCategories.map((category) => {
          return (
            <li key={category.slug} className={styles.productsCategory}>
              <Link href={`/productos?category=${category.slug}`}>
                <div>
                  <AnimationBox animation="fade-in-from-bottom">
                    <div className={styles.image}>
                      <ContentfulImage
                        src={category.image.url}
                        alt={category.image.title || category.label}
                        width={100}
                        height={100}
                        sizes="(min-width: 1024px) 25vw, 100vw"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
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
