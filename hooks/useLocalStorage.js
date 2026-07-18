import { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, initialValue) {
  // Get from local storage then
  // parse stored json or if none return initialValue
  const readValue = useCallback(() => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback((value) => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
      return;
    }

    setStoredValue((currentValue) => {
      try {
        const valueToStore =
          value instanceof Function ? value(currentValue) : value;

        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
        return currentValue;
      }
    });
  }, [key]);

  // Read from local storage when key changes
  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
