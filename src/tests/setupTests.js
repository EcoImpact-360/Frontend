import '@testing-library/jest-dom';
function createMemoryStorage() {
  let store = {};
  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}
Object.defineProperty(window, 'localStorage', {
  value: createMemoryStorage(),
  writable: true,
});
