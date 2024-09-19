// Importing the Express app instance from the app module
import app from './app';
// Importing configuration settings, including the port number
import { config } from './config';
// Importing the logger utility to log messages with a timestamp
import { logger } from './utils/logger';

/**
 * Starts the Express application and listens on the configured port.
 *
 * The server listens on the port specified in the configuration,
 * and once the server starts, a message is logged using the logger utility.
 *
 * @returns {void}
 */
app.listen(config.PORT, () => {
  // Log a message indicating the server has started and the port it's listening on
  logger(`Server started on port ${config.PORT}`);
});
