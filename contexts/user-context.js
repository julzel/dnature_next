import React, { useState, createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const initialUserData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  pets: [],
  shoppingCart: {},
  exists: false
};

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserData)
  const { setValue } = useLocalStorage('user')

  const updateUser = (user) => {
    setValue(user)
    setUser(user)
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider

export const useUser = () => useContext(UserContext)
