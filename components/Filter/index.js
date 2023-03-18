import React from 'react'

// local imports
// components
import FilterDesktop from './FilterDesktop'
import FilterMobile from './FilterMobile'

const Filter = props => {

    return (
        <>
            {/* <FilterMobile {...props} /> */}
            <FilterDesktop {...props} />
        </>
    )
}
 
export default Filter
