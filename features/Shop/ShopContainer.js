import React from 'react';

// local imports
// components
import Shop from './Shop';

// hooks
import { useCategories } from '../../hooks';

const ShopContainer = () => {
    const { categories } = useCategories();
    return <Shop categories={categories} />;
};

export default ShopContainer;