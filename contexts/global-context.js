import React, { useState, createContext } from 'react'
import ScrollContextProvider from './scroll-context'
import UserContextProvider from './user-context'

export const GlobalContext = createContext({})

/**
 * add context for:
 * - dark-mode
 * - media query check
 */

const GlobalContextProvider = ({ children }) => {
  const [disableGlobalScroll, setDisableGlobalScroll] = useState(false)

  return (
    <GlobalContext.Provider
      value={{ disableGlobalScroll, setDisableGlobalScroll }}
    >
      <ScrollContextProvider>
        <UserContextProvider>{children}</UserContextProvider>
      </ScrollContextProvider>
    </GlobalContext.Provider>
  )
}

export default GlobalContextProvider
