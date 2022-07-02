// local imports
// contexts
import ScrollContextProvider from '../../contexts/scroll-context'
import GlobalContextProvider from '../../contexts/global-context'

// components
import Layout from '../Layout'

const Page = ({ children, showHeader, changeBackground }) => {
    return (
        <GlobalContextProvider>
            <ScrollContextProvider>
               <Layout
                showHeader={showHeader}
                changeBackground={changeBackground}
               >
                {children}
               </Layout>
            </ScrollContextProvider>
        </GlobalContextProvider>
    )
}

export default Page