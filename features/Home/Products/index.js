import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Divider, Typography } from "@mui/material";

// local imports
//styles
import styles from "./Products.module.scss";

// components
import AnimationBox from "../../../components/AnimationBox";
import CursiveTitle from "../../../components/CursiveTitle";
import ProductButton from "./ProductButton";

const Products = ({ categories }) => {
  return (
    <div className={styles.products}>
      <CursiveTitle>Nuestros productos</CursiveTitle>
      <Divider sx={{ mb: 8, mx: 2 }} />
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
