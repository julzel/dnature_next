const isServer = typeof window === "undefined";

const storage = {
  setItem: (key, value, isSession = false) => {
    if (isServer) return;

    const storageType = isSession ? sessionStorage : localStorage;
    storageType.setItem(key, JSON.stringify(value));
  },
  getItem: (key, isSession = false) => {
    if (isServer) return null;

    const storageType = isSession ? sessionStorage : localStorage;
    const value = storageType.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  removeItem: (key, isSession = false) => {
    if (isServer) return;

    const storageType = isSession ? sessionStorage : localStorage;
    storageType.removeItem(key);
  },
};

export default storage;
