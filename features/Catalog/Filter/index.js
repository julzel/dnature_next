import React from "react";

// local imports
// components
import FilterDesktop from "./FilterDesktop";
import FilterMobile from "./FilterMobile";

const Filter = (props) => {
  return (
    <>
      <FilterMobile key={props.selected.id} {...props} />
      <FilterDesktop {...props} />
    </>
  );
};

export default Filter;
