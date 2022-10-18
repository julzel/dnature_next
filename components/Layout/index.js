import { useContext, useEffect, useState } from 'react'

// local imports
// styles
import styles from './Layout.module.scss'

// contexts
import { GlobalContext } from '../../contexts/global-context'
import { useUser } from '../../contexts/user-context'

// components
import Header from '../Header'
import Footer from '../Footer'
import Drower from '../Drower'
import UserForm from '../UserForm'

const Layout = ({ changeBackground, showHeader, children }) => {
  const [showUserDrower, setShowUserDrower] = useState(false)
  const { user } = useUser()
  const { disableGlobalScroll } = useContext(GlobalContext)

  const onDrowerClose = () => setShowUserDrower(false)

  useEffect(() => {
    if (!user.exists) {
      setShowUserDrower(!user.exists)
    }
  }, [user])

  useEffect(() => {
      document.body.style.overflow = disableGlobalScroll ? 'hidden' :
          'auto'
  }, [disableGlobalScroll])

  return (
      <div className={`${styles.layout}`}>
          <Header changeBackground={changeBackground} showBackground={showHeader || showUserDrower} />
          <main>
              {children}
          </main>
          {showUserDrower && (
            <Drower close={onDrowerClose}>
              <UserForm dismiss={onDrowerClose} />
            </Drower>
          )}
          <Footer />
      </div>
  )
}

export default Layout