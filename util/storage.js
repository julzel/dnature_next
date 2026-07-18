const isServer = typeof window === "undefined";

const storage = {
  setItem: (key, value, isSession = false) => {
    if (isServer) return;

    try {
      const storageType = isSession ? sessionStorage : localStorage;
      storageType.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Unable to save ${key} to browser storage.`, error);
    }
  },
  getItem: (key, isSession = false) => {
    if (isServer) return null;

    try {
      const storageType = isSession ? sessionStorage : localStorage;
      const value = storageType.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`Unable to read ${key} from browser storage.`, error);
      return null;
    }
  },
  removeItem: (key, isSession = false) => {
    if (isServer) return;

    try {
      const storageType = isSession ? sessionStorage : localStorage;
      storageType.removeItem(key);
    } catch (error) {
      console.warn(`Unable to remove ${key} from browser storage.`, error);
    }
  },
};

export default storage;
