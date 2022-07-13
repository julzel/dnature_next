import React, { useState, createContext }  from 'react'

export const GlobalContext = createContext({})

/**
 * add context for:
 * - dark-mode
 * - media query check
*/

const GlobalContextProvider = ({ children }) => {
    const [disableGlobalScroll, setDisableGlobalScroll] = useState(false)

    return (
        <GlobalContext.Provider value={{disableGlobalScroll, setDisableGlobalScroll}}>
            {children}
        </GlobalContext.Provider>
    );
}
 
export default GlobalContextProvider