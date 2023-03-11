import React from "react";
import Image from "next/image";
import Link from "next/link";

// local imports
//styles
import styles from "./Shop.module.scss";

// components
import Button from "../../components/Button";

const Shop = ({ categories }) => (
  <div className={styles.container}>
    <ul className={styles.grid}>
      {categories &&
        categories.map((category, i) => {
          const firstRow = i === 0 || i === 1 || i === 2;
          const secondRow = i === 3 || i === 4;

          return (
            <li key={i} className={`${styles.square} ${firstRow ? styles.firstRow : ''} ${secondRow ? styles.secondRow : ''}`}>
              <Link href={`/productos?category=${category.slug}`} passHref>
                <div>
                  <div className={styles.imageWrapper}>
                    <div className={styles.imageContainer}>
                      <Image
                        src={category.image.url}
                        alt={category.image.title}
                        width="100%"
                        height="100%"
                        layout="responsive"
                        objectFit="contain"
                      />
                    </div>
                  </div>
                  <div className={styles.buttonWrapper}>
                    <Button className={styles.button} text={category.label} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
    </ul>
  </div>
);

export default Shop;
