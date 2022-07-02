import { useContext } from 'react'

// local imports
// styles
import styles from './Layout.module.scss'

// contexts
import { GlobalContext } from '../../contexts/global-context'

// components
import Header from '../Header'
import Footer from '../Footer'

const Layout = ({ changeBackground, showHeader, children }) => {
    const { disableGlobalScroll } = useContext(GlobalContext)
    
    return (
        <div className={`${styles.Layout}`}>
            <Header changeBackground={changeBackground} showBackground={showHeader} />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout