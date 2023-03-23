import { useState, useEffect } from "react";
import storage from "../util/storage";

const isServer = typeof window === "undefined";

const useStorage = (key, defaultValue, isSession = false) => {
  const [value, setValue] = useState(() => {
    if (isServer) return defaultValue;

    const storedValue = storage.getItem(key, isSession);
    return storedValue !== null ? storedValue : defaultValue;
  });

  useEffect(() => {
    if (!isServer) {
      storage.setItem(key, value, isSession);
    }
  }, [key, value, isSession]);

  const remove = () => {
    if (!isServer) {
      storage.removeItem(key, isSession);
    }
    setValue(null);
  };

  return [value, setValue, remove];
};

export default useStorage;
