import React, { useState } from "react";

// local imports
// components
import Loading from "../../../components/Loading";
import Catalog from "./Catalog";

// hooks
import { useCatalog } from "../../../hooks";

const CatalogContainer = () => {
  const {
    loading,
    categoriesList,
    selectedCategory,
    filterOptions,
    handleSelectedCategoryChange,
  } = useCatalog("all");

  if (loading) {
    return <Loading />;
  }

  return (
    <Catalog
      filterOptions={filterOptions}
      handleSelectedCategoryChange={handleSelectedCategoryChange}
      selectedCategory={selectedCategory}
      categoriesList={categoriesList}
    />
  );
};

export default CatalogContainer;
