'use client';

import { useRef, useState } from 'react';

import ContentfulImage from '../../../../components/ContentfulImage';
import styles from './ProductDetail.module.scss';

const PRODUCT_TABS = [
  { id: 'description', label: 'Descripción' },
  { id: 'ingredients', label: 'Ingredientes' },
  { id: 'benefits', label: 'Beneficios' },
  { id: 'recommendations', label: 'Recomendaciones' },
];

const EmptyTab = () => (
  <p className={styles.emptyTab}>
    Este contenido estará disponible cuando se complete la información del
    producto.
  </p>
);

const ProductDetail = ({ productDetail }) => {
  const [activeTab, setActiveTab] = useState(PRODUCT_TABS[0].id);
  const tabRefs = useRef([]);
  const activeTabIndex = PRODUCT_TABS.findIndex(({ id }) => id === activeTab);

  const activateTab = (index) => {
    const nextTab = PRODUCT_TABS[index];

    setActiveTab(nextTab.id);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (event) => {
    let nextIndex = activeTabIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (activeTabIndex + 1) % PRODUCT_TABS.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex =
        (activeTabIndex - 1 + PRODUCT_TABS.length) % PRODUCT_TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = PRODUCT_TABS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activateTab(nextIndex);
  };

  const renderTabContent = (tabId) => {
    if (tabId === 'description') {
      return productDetail.description ? (
        <div className={styles.copy}>{productDetail.description}</div>
      ) : (
        <EmptyTab />
      );
    }

    if (tabId === 'ingredients') {
      return productDetail.ingredientes ? (
        <>
          <p className={styles.copy}>{productDetail.ingredientes}</p>
          {productDetail.iconos?.length > 0 && (
            <ul className={styles.icons} aria-label='Características'>
              {productDetail.iconos.map((icon, index) => (
                <li className={styles.icon} key={icon.url || index}>
                  <ContentfulImage
                    src={icon.url}
                    alt={icon.title}
                    width={56}
                    height={56}
                    sizes='56px'
                    className={styles.iconImage}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <EmptyTab />
      );
    }

    if (tabId === 'benefits') {
      return productDetail.beneficios ? (
        <div className={styles.copy}>{productDetail.beneficios}</div>
      ) : (
        <EmptyTab />
      );
    }

    return productDetail.recomendaciones ? (
      <div className={styles.copy}>{productDetail.recomendaciones}</div>
    ) : (
      <EmptyTab />
    );
  };

  return (
    <section
      className={styles.productDetail}
      aria-label='Información del producto'
    >
      <div className={styles.tabRail}>
        <div className={styles.tabList} role='tablist'>
          {PRODUCT_TABS.map(({ id, label }, index) => (
            <button
              type='button'
              id={`product-tab-${id}`}
              className={styles.tab}
              role='tab'
              aria-selected={activeTab === id}
              aria-controls={`product-panel-${id}`}
              tabIndex={activeTab === id ? 0 : -1}
              onClick={() => setActiveTab(id)}
              onKeyDown={handleTabKeyDown}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              key={id}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {PRODUCT_TABS.map(({ id }) => (
        <div
          id={`product-panel-${id}`}
          className={styles.tabPanel}
          role='tabpanel'
          aria-labelledby={`product-tab-${id}`}
          tabIndex={activeTab === id ? 0 : -1}
          hidden={activeTab !== id}
          key={id}
        >
          {renderTabContent(id)}
        </div>
      ))}
    </section>
  );
};

export default ProductDetail;
