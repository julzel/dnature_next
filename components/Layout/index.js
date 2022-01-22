import Header from '../Header'
import Footer from '../Footer'
import styles from './Layout.module.scss'

const Layout = ({ children }) => (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )

  export default Layout