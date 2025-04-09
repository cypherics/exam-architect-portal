
/**
 * Generates a random numeric ID with a specified length
 * @param length - The length of the ID to generate (default: 4)
 * @returns A string containing a random numeric ID
 */
export const generateNumericId = (length: number = 4): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return `${Math.floor(min + Math.random() * (max - min + 1))}`;
};

/**
 * Generates a UUID v4
 * @returns A string containing a UUID
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Generates a timestamp-based ID with optional prefix
 * @param prefix - An optional prefix to add to the ID
 * @returns A string containing a timestamp-based ID
 */
export const generateTimestampId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
