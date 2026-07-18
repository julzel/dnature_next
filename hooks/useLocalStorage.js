import { useCallback, useMemo, useSyncExternalStore } from 'react';

const STORAGE_EVENT = 'dnature-local-storage';

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

function useLocalStorage(key, initialValue) {
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

  const getSnapshot = useCallback(() => window.localStorage.getItem(key), [key]);
  const getServerSnapshot = useCallback(() => null, []);
  const storedItem = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const storedValue = useMemo(
    () => parseStoredValue(storedItem, initialValue),
    [initialValue, storedItem]
  );

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
