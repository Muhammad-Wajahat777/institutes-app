// Convert snake_case keys to camelCase
const toCamel = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Convert camelCase keys to snake_case
const toSnake = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

// Recursively convert object keys from snake_case to camelCase
export const keysToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamel);
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [toCamel(key), keysToCamel(value)])
    );
  }
  return obj;
};

// Recursively convert object keys from camelCase to snake_case
export const keysToSnake = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnake);
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [toSnake(key), keysToSnake(value)])
    );
  }
  return obj;
};
