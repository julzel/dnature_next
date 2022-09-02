import React, { useEffect, useState, useCallback } from 'react'
import SCREEN_SIZE from '../constants/breakpoints'

const useWindow = () => {
    const [isMobile, setIsMobile] = useState(true)
    const { TABLET } = SCREEN_SIZE

    const handleWindowResize = useCallback(() => {
        if (window.innerWidth < TABLET) {
            if (!isMobile) {
                setIsMobile(true)
            }
        } else {
            if (isMobile) {
                setIsMobile(false)
            }
        }
    }, [TABLET, isMobile])

    useEffect(() => {
        setIsMobile(window.innerWidth < TABLET)
        window.addEventListener('resize', handleWindowResize)

        return () => window.removeEventListener('resize', handleWindowResize)
    }, [TABLET, handleWindowResize])

    return isMobile
}

export default useWindow