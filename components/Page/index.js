// local imports
// contexts
import GlobalContextProvider from '../../contexts/global-context'

// components
import Layout from '../Layout'

const Page = ({ children, showHeader, changeBackground }) => {
  return (
    <GlobalContextProvider>
      <Layout showHeader={showHeader} changeBackground={changeBackground}>
        {children}
      </Layout>
    </GlobalContextProvider>
  )
}

export default Page
