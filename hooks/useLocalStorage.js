import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';

const STORAGE_EVENT = 'dnature-local-storage';
const identity = (value) => value;

const parseStoredValue = (value, initialValue) => {
  if (value === null) {
    return initialValue;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Unable to parse browser storage value.', error);
    return initialValue;
  }
};

function useLocalStorage(key, initialValue, normalizeValue = identity) {
  const subscribe = useCallback(
    (callback) => {
      const onStorageChange = (event) => {
        if (event.type === STORAGE_EVENT ? event.detail?.key === key : event.key === key) {
          callback();
        }
      };

      window.addEventListener('storage', onStorageChange);
      window.addEventListener(STORAGE_EVENT, onStorageChange);

      return () => {
        window.removeEventListener('storage', onStorageChange);
        window.removeEventListener(STORAGE_EVENT, onStorageChange);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn(`Unable to read ${key} from browser storage.`, error);
      return null;
    }
  }, [key]);
  const getServerSnapshot = useCallback(() => null, []);
  const storedItem = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const storedValue = useMemo(() => {
    const parsedValue = parseStoredValue(storedItem, initialValue);
    return normalizeValue(parsedValue);
  }, [initialValue, normalizeValue, storedItem]);

  useEffect(() => {
    if (storedItem === null) {
      return;
    }

    const normalizedItem = JSON.stringify(storedValue);

    if (normalizedItem !== storedItem) {
      try {
        window.localStorage.setItem(key, normalizedItem);
        window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
      } catch (error) {
        console.warn(`Unable to migrate ${key} in browser storage.`, error);
      }
    }
  }, [key, storedItem, storedValue]);

  const setValue = useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        const currentValue = parseStoredValue(window.localStorage.getItem(key), initialValue);
        const valueToStore = value instanceof Function ? value(currentValue) : value;

        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
      } catch (error) {
        console.warn(`Unable to save ${key} to browser storage.`, error);
      }
    },
    [initialValue, key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
