import React, { useState } from 'react'
import FilterDesktop from './FilterDesktop'
import FilterMobile from './FilterMobile'

// local imports
// components

const Filter = props => {

    return (
        <>
            <FilterMobile {...props} />
            <FilterDesktop {...props} />
        </>
    )
}
 
export default Filter
