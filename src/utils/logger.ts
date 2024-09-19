/**
 * Logger function that logs a message with a timestamp.
 *
 * This function logs a message to the console, prefixed with '[LOG]'
 * and followed by the current timestamp in ISO format.
 *
 * @param {string} message - The message to be logged.
 *
 * @returns {void}
 */
export const logger = (message: string) => {
  console.log(`[LOG] - ${new Date().toISOString()}: ${message}`);
};
