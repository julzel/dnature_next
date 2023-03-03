import { createContext, useContext } from 'react';

// Creating the user context
const UserContext = createContext();

// Making the function which will wrap the whole app using Context Provider
export default function AppStore({ children }) {
  const user = {
    id: 1,
    name: 'John Doe',
    token: '3DJ39#DFLLDF58$LKDFO#O3N4OO',
  };

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
// Make useUserContext Hook to easily use our context throughout the application
export const useUserContext = () => useContext(UserContext);
