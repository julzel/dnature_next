const isServer = typeof window === 'undefined';
const STORAGE_VERSION = 1;

const storage = {
  setItem: (key, value, { expiresInDays, isSession = false } = {}) => {
    if (isServer) return;

    try {
      const storageType = isSession ? sessionStorage : localStorage;
      const expiresAt = Number.isFinite(expiresInDays)
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;
      storageType.setItem(
        key,
        JSON.stringify({ version: STORAGE_VERSION, expiresAt, value })
      );
    } catch (error) {
      console.warn(`Unable to save ${key} to browser storage.`, error);
    }
  },
  getItem: (key, { isSession = false } = {}) => {
    if (isServer) return null;

    try {
      const storageType = isSession ? sessionStorage : localStorage;
      const rawValue = storageType.getItem(key);
      if (!rawValue) return null;

      const parsed = JSON.parse(rawValue);
      const isCurrentEnvelope =
        parsed?.version === STORAGE_VERSION && Object.hasOwn(parsed, 'value');

      if (!isCurrentEnvelope || (parsed.expiresAt && Date.parse(parsed.expiresAt) <= Date.now())) {
        storageType.removeItem(key);
        return null;
      }

      return parsed.value;
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

export { STORAGE_VERSION };
export default storage;
