import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// local imports
//styles
import styles from './Products.module.scss';

// data
import { getCategories } from '../../../services/categories';
import AnimationBox from '../../../components/AnimationBox';

// components
import ProductButton from './ProductButton';

const Products = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  return (
    <div className={styles.products}>
      <h2 className={`title ${styles.title}`}>Nuestros productos</h2>
      <ul className={styles.productsCategories}>
        {categories &&
          categories.map((category, i) => {
            return (
              <li key={i} className={styles.productsCategory}>
                <Link href={`/productos?category=${category.slug}`} passHref>
                  <>
                    <AnimationBox animation='fade-in-from-bottom'>
                      <div className={styles.image}>
                        <Image
                          src={category.image.url}
                          alt={category.image.title}
                          width='100%'
                          height='100%'
                          layout='responsive'
                          objectFit='contain'
                        />
                      </div>
                    </AnimationBox>
                    <div className={styles.productsCategoryContent}>
                      <AnimationBox animation='fade-in-from-bottom'>
                        <div
                          role='button'
                          className='flex-center-column'
                          tabIndex='0'
                        >
                          {/* <Button label={category.label} /> */}
                          <ProductButton text={category.label} />
                        </div>
                      </AnimationBox>
                    </div>
                  </>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Products;
