import React, { useState, useEffect, createContext }  from 'react'

export const ScrollContext = createContext(0)


const ScrollContextProvider = ({ children }) => {
    const [scrollValue, setScrollValue] = useState(0)

    const scrollHandler = () => setScrollValue(window.scrollY)

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)

        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])

    return (
        <ScrollContext.Provider value={scrollValue}>
            {children}
        </ScrollContext.Provider>
    );
}
 
export default ScrollContextProvider